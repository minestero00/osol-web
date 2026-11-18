"""Publish a completed offline render; never invent geometry or request routes."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--render-dir', type=Path, required=True)
args = parser.parse_args()
render = args.render_dir.resolve()
data = json.loads((render / 'projection-light.json').read_text())
dark = json.loads((render / 'projection-dark.json').read_text())
for key in ('width', 'height', 'center', 'zoom'):
    if data[key] != dark[key]:
        raise SystemExit(f'Theme registration differs: {key}')
source = json.loads((root / 'assets/maps/comparison/source.json').read_text())
if any(a['response'] != b['response'] for a,b in zip(data['routes'],source)):
    raise SystemExit('Render does not match retained routing responses')
html_path = root / 'index.html'
html = html_path.read_text()
projection = {k: data[k] for k in ('width','height','zoom','center')}
projection['routes'] = []
for route in data['routes']:
    route_path = 'M' + ' L'.join(f'{x:.3f},{y:.3f}' for x,y in route['projected'])
    html, count = re.subn(r'(data-path="' + re.escape(route['id']) + r'"\s+d=")[^"]+',
                         lambda m: m[1] + route_path, html)
    if count != 1:
        raise SystemExit(f'Missing unique route target: {route["id"]}')
    projection['routes'].append({'id':route['id'], 'points':route['projected'], 'path':route_path})
points = iter([data['routes'][0]['projected'][0],data['routes'][0]['projected'][-1]])
def endpoint(match):
    x,y = next(points)
    label = '미포' if '미포' in match[0] else '일광'
    return f'<g class="route-end"><circle cx="{x:.3f}" cy="{y:.3f}" r="9"/><text x="{x+18:.3f}" y="{y+6:.3f}">{label}</text></g>'
html = re.sub(r'<g class="route-end">.*?</g>',endpoint,html,flags=re.S)
for theme in ('light','dark'):
    subprocess.run(['cwebp','-quiet','-q','92',str(render/f'coast-{theme}.png'),'-o',str(root/f'assets/maps/comparison/coast-{theme}.webp')],check=True)
html_path.write_text(html)
(root/'assets/maps/comparison/projection.json').write_text(json.dumps(projection,indent=2)+'\n')
manifest_path = root/'docs/comparison-provenance.json'
manifest = json.loads(manifest_path.read_text())
manifest['style_sha256'] = (render/'style-sha256.txt').read_text().strip()
manifest['evidence'] = str(render)
for asset in manifest['assets']:
    asset['sha256'] = hashlib.sha256((root/asset['path']).read_bytes()).hexdigest()
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
print('Updated registered basemaps and route SVG. Run formatting and checks; review metrics/copy if routing source changed.')
