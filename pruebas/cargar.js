// Carga el motor (§7), los parámetros (§5) y el pronóstico (§7-C) directamente
// desde el archivo HTML del simulador, sin navegador, para las pruebas unitarias.
const fs = require('fs');
const path = require('path');
function bloque(src, inicio, fin){
  const i = src.indexOf(inicio); if(i < 0) throw new Error('No se encontró ' + inicio);
  const j = src.indexOf(fin, i); if(j < 0) throw new Error('No se encontró el cierre de ' + inicio);
  return src.slice(i, j + fin.length);
}
function cargar(archivo){
  const html = fs.readFileSync(archivo || path.join(__dirname, '..', 'versiones', 'farmito-v7-completo.html'), 'utf8');
  const codigo = [
    bloque(html, 'const MOTOR = (function(){', '\n})();'),
    bloque(html, 'const CFG = {', '\n};'),
    bloque(html, 'const PRODUCTOS = [', '\n];'),
    bloque(html, 'const PRONOSTICO = (function(){', '\n})();'),
    'return {MOTOR, CFG, PRODUCTOS, PRONOSTICO};'
  ].join('\n');
  return new Function(codigo)();
}
module.exports = {cargar};
