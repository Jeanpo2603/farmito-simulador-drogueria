// Genera las muestras del motor para la validación estadística (Entregable 5).
// Uso: node validacion/muestras.js > validacion/muestras.json
const {cargar} = require('../pruebas/cargar');
const {MOTOR, PRODUCTOS} = cargar();
const N = 1000;
// Tiempos de entrega cotizados (Tabla 10): nacionales por medicamento e insulina importada
const LT = [['DIC',3,5,8],['ACE',4,7,12],['CPB',5,7,10],['LOR',7,10,15],['INS',30,45,90]];
const out = {n: N, lt: [], demanda: []};
LT.forEach(([id,a,c,b], i) => {
  MOTOR.fijarSemilla(5000 + i);
  out.lt.push({id, a, c, b, x: Array.from({length: N}, () => MOTOR.tiempoEntregaTriangular(a, c, b))});
});
PRODUCTOS.forEach((p, i) => {
  MOTOR.fijarSemilla(6000 + i);
  out.demanda.push({id: p.id, mu: p.mu, sigma: p.sigma, x: Array.from({length: N}, () => MOTOR.demandaSemanal(p.mu, p.sigma, 1))});
});
process.stdout.write(JSON.stringify(out));
