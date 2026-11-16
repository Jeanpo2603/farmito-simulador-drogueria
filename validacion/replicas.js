// 200 réplicas independientes de 1.000 valores por distribución, para la tasa de rechazo de la prueba K-S.
// Uso: node validacion/replicas.js > validacion/replicas.json
const {cargar} = require('../pruebas/cargar');
const {MOTOR, PRODUCTOS} = cargar();
const R = 200, N = 1000;
const LT = [['DIC',3,5,8],['ACE',4,7,12],['CPB',5,7,10],['LOR',7,10,15],['INS',30,45,90]];
const out = {R, n: N, lt: [], demanda: []};
LT.forEach(([id,a,c,b], i) => { MOTOR.fijarSemilla(70000 + i);
  out.lt.push({id, a, c, b, rep: Array.from({length: R}, () => Array.from({length: N}, () => +MOTOR.tiempoEntregaTriangular(a, c, b).toFixed(6)))}); });
PRODUCTOS.forEach((p, i) => { MOTOR.fijarSemilla(80000 + i);
  out.demanda.push({id: p.id, mu: p.mu, sigma: p.sigma, rep: Array.from({length: R}, () => Array.from({length: N}, () => +MOTOR.demandaSemanal(p.mu, p.sigma, 1).toFixed(4)))}); });
process.stdout.write(JSON.stringify(out));
