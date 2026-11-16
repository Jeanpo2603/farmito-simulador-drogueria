// Pruebas unitarias del motor generador y del módulo de pronóstico del simulador Farmito.
// Ejecutar con:  npm test   (o  node --test pruebas/motor.test.js)
const test = require('node:test');
const assert = require('node:assert/strict');
const {cargar} = require('./cargar');
const {MOTOR, CFG, PRODUCTOS, PRONOSTICO} = cargar();

const media = a => a.reduce((x, y) => x + y, 0) / a.length;
const desv = a => { const m = media(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const muestras = (n, f) => Array.from({length: n}, f);

/* ------------------------------------------------------------ generador de números */
test('RNF-05: la misma semilla reproduce la misma secuencia', () => {
  MOTOR.fijarSemilla(2026); const a = muestras(50, () => MOTOR.U());
  MOTOR.fijarSemilla(2026); const b = muestras(50, () => MOTOR.U());
  assert.deepEqual(a, b);
  MOTOR.fijarSemilla(2027); const c = muestras(50, () => MOTOR.U());
  assert.notDeepEqual(a, c);
});
test('U está en el intervalo [0, 1)', () => {
  MOTOR.fijarSemilla(1);
  for(const u of muestras(100000, () => MOTOR.U())) assert.ok(u >= 0 && u < 1);
});
test('Box-Muller: Z tiene media 0 y desviación 1', () => {
  MOTOR.fijarSemilla(7); const z = muestras(40000, () => MOTOR.normalEstandar());
  assert.ok(Math.abs(media(z)) < 0.02, 'media ' + media(z));
  assert.ok(Math.abs(desv(z) - 1) < 0.02, 'desviación ' + desv(z));
});

/* ------------------------------------------------------------ demanda (RF-03) */
test('RF-03: D(t) nunca es negativa (truncamiento en cero)', () => {
  MOTOR.fijarSemilla(3);
  for(let i = 0; i < 20000; i++) assert.ok(MOTOR.demandaSemanal(400, 140, 0.5) >= 0);
});
test('RF-03: la demanda generada reproduce μ y σ de cada medicamento', () => {
  MOTOR.fijarSemilla(11);
  for(const p of PRODUCTOS){
    const d = muestras(20000, () => MOTOR.demandaSemanal(p.mu, p.sigma, 1));
    assert.ok(Math.abs(media(d) - p.mu) / p.mu < 0.02, p.id + ' media ' + media(d));
    assert.ok(Math.abs(desv(d) - p.sigma) / p.sigma < 0.05, p.id + ' desviación ' + desv(d));
  }
});
test('Estacionalidad: S(t) promedia 1 en las 52 semanas y respeta su rango', () => {
  for(const p of PRODUCTOS){
    const s = muestras(52, (_, i) => MOTOR.indiceEstacionalidad(p.estac, i + 1));
    assert.ok(Math.abs(media(s) - 1) < 0.005, p.id + ' promedio ' + media(s));
    assert.ok(Math.min(...s) >= p.estac.min - 1e-9 && Math.max(...s) <= p.estac.max + 1e-9);
  }
});

/* ------------------------------------------------------------ tiempo de entrega (RF-04) */
test('RF-04: el tiempo de entrega triangular queda en [a, b] y su media es (a + c + b) / 3', () => {
  MOTOR.fijarSemilla(5);
  for(const [a, c, b] of [[3, 5, 8], [30, 45, 90], [7, 10, 21]]){
    const lt = muestras(30000, () => MOTOR.tiempoEntregaTriangular(a, c, b));
    assert.ok(Math.min(...lt) >= a && Math.max(...lt) <= b);
    assert.ok(Math.abs(media(lt) - (a + c + b) / 3) < 0.01 * (b - a), 'media ' + media(lt));
    assert.ok(Math.abs(desv(lt) - MOTOR.desvTriangular([a, c, b])) < 0.02 * (b - a));
  }
});
test('Caso límite: entrega fija cuando b ≤ a', () => {
  assert.equal(MOTOR.tiempoEntregaTriangular(10, 10, 10), 10);
});

/* ------------------------------------------------------------ eventos (RF-05) */
test('RF-05: el evento se activa si y solo si R ≤ Pe', () => {
  MOTOR.fijarSemilla(9);
  for(let i = 0; i < 5000; i++){ const r = MOTOR.ocurreEvento(0.25); assert.equal(r.activo, r.R <= 0.25); }
  assert.equal(MOTOR.ocurreEvento(0).activo, false);
  assert.equal(MOTOR.ocurreEvento(1).activo, true);
});
test('RF-05: la frecuencia de activación se acerca a Pe', () => {
  MOTOR.fijarSemilla(13);
  for(const pe of Object.values(CFG.Pe).filter(v => v < 1)){
    const f = media(muestras(20000, () => MOTOR.ocurreEvento(pe).activo ? 1 : 0));
    assert.ok(Math.abs(f - pe) < 0.015, 'Pe ' + pe + ' frecuencia ' + f);
  }
});
test('Un evento cuya condición no se cumple no se sortea', () => {
  const r = MOTOR.sortearEventos([{id: 'x', Pe: 1, condicion: () => false}, {id: 'y', Pe: 1}]);
  assert.deepEqual(r.map(e => e.id), ['y']);
});

/* ------------------------------------------------------------ pronóstico (RF-08) */
test('Suavizamiento simple: una serie constante se pronostica sin error', () => {
  const y = Array(60).fill(500), r = PRONOSTICO.ses(y, 0.3);
  assert.equal(r.h(1), 500);
  const m = PRONOSTICO.metricas(y, r.fc, 30);
  assert.equal(m.mape, 0); assert.equal(m.rmse, 0);
});
test('Promedio móvil de 4 semanas e ingenuo estacional', () => {
  const y = muestras(120, (_, t) => 100 + t);
  assert.equal(PRONOSTICO.promedioMovil(y, 4).h(1), (216 + 217 + 218 + 219) / 4);
  assert.equal(PRONOSTICO.ingenuoEstacional(y, 52).h(1), y[120 - 52]);
});
test('Holt-Winters reproduce una serie estacional pura con error bajo', () => {
  const y = muestras(156, (_, t) => 500 * (1 + 0.3 * Math.sin(2 * Math.PI * t / 52)));
  const r = PRONOSTICO.holtWinters(y, 0.2, 0, 0.1, 52);
  const m = PRONOSTICO.metricas(y, r.fc, 104);
  assert.ok(m.mape < 0.02, 'MAPE ' + m.mape);
});
test('Regla de adopción: el modelo se usa solo si su MAPE es menor que el de la base', () => {
  MOTOR.fijarSemilla(21);
  for(const p of PRODUCTOS){
    const y = muestras(156, (_, t) => Math.round(MOTOR.demandaSemanal(p.mu, p.sigma, MOTOR.indiceEstacionalidad(p.estac, (t % 52) + 1))));
    const cfg = {modelo: p.id === 'ACE' || p.id === 'LOR' ? 'HW' : 'SES', base: p.id === 'ACE' || p.id === 'LOR' ? 'SNAIVE' : 'MA4'};
    const ev = PRONOSTICO.evaluar(y, cfg);
    assert.equal(ev.nTest, CFG.semanasPrueba);
    if(ev.adoptado) assert.ok(ev.metM.mape < ev.metB.mape);
    else assert.equal(ev.usado, cfg.base);
    assert.ok(ev.sigma > 0);
  }
});
test('Demanda intermitente: clasificación de Syntetos y Boylan', () => {
  assert.equal(PRONOSTICO.clasificar(Array(52).fill(100)).tipo, 'suave');
  const inter = muestras(52, (_, t) => t % 4 === 0 ? 30 : 0);
  assert.equal(PRONOSTICO.clasificar(inter).intermitente, true);
  assert.ok(PRONOSTICO.croston(inter) > 0 && PRONOSTICO.sba(inter) < PRONOSTICO.croston(inter));
});
