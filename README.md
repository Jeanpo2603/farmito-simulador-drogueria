# Farmito · simulador de compras e inventario de una droguería

Simulador educativo en el que el estudiante asume el rol de analista de compras de una droguería y decide, ronda a ronda, el aprovisionamiento de una cartera piloto de cinco medicamentos con la ayuda de un sistema de soporte de decisiones (pronóstico de la demanda y orden sugerida con la política de revisión periódica (R, S)).

Proyecto de grado de la Escuela de Ingeniería Industrial de la Universidad Católica Andrés Bello · Equipo N.° 21: Camila Barrera y Jean Paul Szczedrin · Tutores: Prof. Luis Gutiérrez y Prof. Joao De Gouveia.

## Cómo usarlo

- **En la web:** abrir la página publicada con GitHub Pages y elegir una versión.
- **Sin conexión:** descargar cualquier archivo de `versiones/` y abrirlo con doble clic en un navegador moderno (Chrome, Edge, Firefox o Safari). No requiere instalación.

## Contenido del repositorio

| Carpeta o archivo | Contenido |
|---|---|
| `index.html` | Página de inicio con el acceso a las siete versiones. |
| `versiones/` | Las siete entregas semanales del simulador (un archivo HTML autocontenido cada una). |
| `pruebas/` | Pruebas unitarias del motor generador y del módulo de pronóstico (`npm test`). |
| `validacion/` | Hoja de cálculo de contraste del motor y scripts de la prueba de bondad de ajuste de Kolmogórov-Smirnov. |

## Versiones

| Semana | Archivo | Módulo incorporado |
|---|---|---|
| 1 | `farmito-v1-contabilidad.html` | Menú, ronda semanal y Contabilidad |
| 2 | `farmito-v2-compras.html` | Compras y sistema de soporte de decisiones |
| 3 | `farmito-v3-inventario.html` | Inventario, lotes y cadena de frío |
| 4 | `farmito-v4-despacho.html` | Despacho y demanda de las farmacias |
| 5 | `farmito-v5-personal.html` | Personal y capacidad operativa |
| 6 | `farmito-v6-cumplimiento.html` | Cumplimiento y marco legal |
| 7 | `farmito-v7-completo.html` | Indicadores e integración de los siete módulos |

## Arquitectura

Aplicación web en HTML, CSS y JavaScript, sin servidor. Cada archivo está organizado por secciones (§1 a §14) que separan los datos del modelo (cartera, proveedores, farmacias y parámetros), el motor generador estocástico, el módulo de pronóstico, la lógica de la ronda semanal de cinco fases y la interfaz. La constante `ETAPA` de la sección §4-B indica qué módulos están construidos en cada entrega.

## Pruebas

```bash
npm test                                   # 16 pruebas unitarias del motor y del pronóstico (Node.js 18 o superior)
node validacion/muestras.js > validacion/muestras.json
node validacion/replicas.js > validacion/replicas.json
python3 validacion/bondad_ajuste.py        # prueba de Kolmogórov-Smirnov (requiere SciPy)
```

## Publicación con GitHub Pages

En el repositorio: *Settings → Pages → Build and deployment → Deploy from a branch*, rama `main`, carpeta `/ (root)`. La página queda disponible en `https://<usuario>.github.io/<repositorio>/`.

## Aviso

El país (Vesper), sus instituciones, leyes, laboratorios, importadores y farmacias son ficticios. El Farmacoin (FC) es la Unidad Monetaria del simulador. Los parámetros de la cartera piloto son los de las Tablas 9 y 10 del proyecto de grado.
