# Farmito · simulador de compras e inventario de una droguería

Simulador educativo en el que el estudiante asume el rol de analista de compras de una droguería y decide, ronda a ronda, el aprovisionamiento de una cartera piloto de cinco medicamentos con la ayuda de un sistema de soporte de decisiones (pronóstico de la demanda y orden sugerida con la política de revisión periódica (R, S)).

Proyecto de grado de la Escuela de Ingeniería Industrial de la Universidad Católica Andrés Bello · Equipo N.° 21: Camila Barrera y Jean Paul Szczedrin · Tutores: Prof. Luis Gutiérrez y Prof. Joao De Gouveia.

## Cómo usarlo

- **En la web:** abrir la página publicada con GitHub Pages y elegir una de las versiones disponibles.
- **Sin conexión:** descargar cualquier archivo de `versiones/` y abrirlo con doble clic en un navegador moderno (Chrome, Edge, Firefox o Safari). No requiere instalación.

## Contenido del repositorio

| Carpeta o archivo | Contenido |
|---|---|
| `index.html` | Página de inicio con el acceso a las versiones publicadas. |
| `versiones/` | Las entregas semanales publicadas hasta la semana 2 (un archivo HTML autocontenido cada una). |

## Versiones

| Semana | Archivo | Módulo incorporado | Estado |
|---|---|---|---|
| 1 | `farmito-v1-contabilidad.html` | Menú, ronda semanal y Contabilidad | Disponible |
| 2 | `farmito-v2-compras.html` | Compras y sistema de soporte de decisiones | Disponible |
| 3 | — | Inventario, lotes y cadena de frío | En construcción (disponible el 24 de noviembre) |
| 4 | — | Despacho y demanda de las farmacias | En construcción (disponible el 27 de noviembre) |
| 5 | — | Personal y capacidad operativa | En construcción (disponible el 1 de diciembre) |
| 6 | — | Cumplimiento y marco legal | En construcción (disponible el 5 de diciembre) |
| 7 | — | Indicadores e integración de los siete módulos | En construcción (disponible el 9 de diciembre) |

## Arquitectura

Aplicación web en HTML, CSS y JavaScript, sin servidor. Cada archivo está organizado por secciones (§1 a §14) que separan los datos del modelo (cartera, proveedores, farmacias y parámetros), el motor generador estocástico, el módulo de pronóstico, la lógica de la ronda semanal de cinco fases y la interfaz. La constante `ETAPA` de la sección §4-B indica qué módulos están construidos en cada entrega.

## Publicación con GitHub Pages

En el repositorio: *Settings → Pages → Build and deployment → Deploy from a branch*, rama `main`, carpeta `/ (root)`. La página queda disponible en `https://<usuario>.github.io/<repositorio>/`.

## Aviso

El país (Vesper), sus instituciones, leyes, laboratorios, importadores y farmacias son ficticios. El Farmacoin (FC) es la Unidad Monetaria del simulador. Los parámetros de la cartera piloto son los de las Tablas 9 y 10 del proyecto de grado.
