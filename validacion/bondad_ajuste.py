"""Prueba de bondad de ajuste de Kolmogórov-Smirnov (Entregable 5).
Tiempos de entrega frente a la triangular (a, c, b) y demanda frente a la normal (μ, σ).
Uso: node validacion/muestras.js > validacion/muestras.json && python3 validacion/bondad_ajuste.py"""
import json, csv, os
from scipy import stats
aqui = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(aqui, 'muestras.json')))
filas = []
for s in d['lt']:
    a, c, b = s['a'], s['c'], s['b']
    r = stats.kstest(s['x'], stats.triang(c=(c-a)/(b-a), loc=a, scale=b-a).cdf)
    filas.append(['Tiempo de entrega', s['id'], f"Triangular({a}, {c}, {b})", d['n'], r.statistic, r.pvalue])
for s in d['demanda']:
    r = stats.kstest(s['x'], stats.norm(loc=s['mu'], scale=s['sigma']).cdf)
    filas.append(['Demanda semanal', s['id'], f"Normal({s['mu']}, {s['sigma']})", d['n'], r.statistic, r.pvalue])
with open(os.path.join(aqui, 'bondad_ajuste.csv'), 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f, delimiter=';'); w.writerow(['variable','medicamento','distribucion','n','D','p_valor','resultado (alfa = 0,05)'])
    for v in filas: w.writerow(v[:4] + [f'{v[4]:.4f}', f'{v[5]:.4f}', 'No se rechaza' if v[5] > 0.05 else 'Se rechaza'])
for v in filas: print(f'{v[0]:18} {v[1]:4} {v[2]:22} n={v[3]} D={v[4]:.4f} p={v[5]:.4f} {"OK" if v[5]>0.05 else "RECHAZA"}')

# ---------------------------------------------------------------- réplicas
# Si el generador es correcto, los p-valores son uniformes y la prueba rechaza
# cerca del 5 % de las réplicas al nivel α = 0,05.
ruta = os.path.join(aqui, 'replicas.json')
if os.path.exists(ruta):
    r = json.load(open(ruta)); res = []
    for s in r['lt']:
        a, c, b = s['a'], s['c'], s['b']; F = stats.triang(c=(c-a)/(b-a), loc=a, scale=b-a).cdf
        p = [stats.kstest(x, F).pvalue for x in s['rep']]
        res.append(['Tiempo de entrega', s['id'], r['R'], sum(v <= 0.05 for v in p)/len(p), stats.kstest(p, 'uniform').pvalue])
    for s in r['demanda']:
        F = stats.norm(loc=s['mu'], scale=s['sigma']).cdf
        p = [stats.kstest(x, F).pvalue for x in s['rep']]
        res.append(['Demanda semanal', s['id'], r['R'], sum(v <= 0.05 for v in p)/len(p), stats.kstest(p, 'uniform').pvalue])
    with open(os.path.join(aqui, 'bondad_ajuste_replicas.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f, delimiter=';'); w.writerow(['variable','medicamento','replicas','tasa_de_rechazo','p_uniformidad_de_p_valores'])
        for v in res: w.writerow([v[0], v[1], v[2], f'{v[3]:.3f}', f'{v[4]:.4f}'])
    for v in res: print(f'{v[0]:18} {v[1]:4} réplicas={v[2]} rechazo={v[3]*100:.1f} % p_unif={v[4]:.3f}')
