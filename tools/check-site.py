"""Offline publication checks. Does not change or approve consent-policy versions."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parent.parent
FROZEN = {
    'legal/terms/2026-07-21.html': 'b1ab30923282b4faac26e60a60c68c23cff3379d6ad13cad89a400e6c788e632',
    'legal/privacy/2026-07-17.html': '9bb4272cfbdf32cc9aded9f0ab2a709ad4440a684ef088300643f0f7edaababf',
}

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.duplicates = []
        self.links = []
        self.feed(text)

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        for attribute in ('href', 'src'):
            if attribute in attrs:
                self.links.append((tag, attribute, attrs[attribute]))

errors = []
documents = {p: Document(p.read_text()) for p in ROOT.rglob('*.html')
             if not {'node_modules', 'test-results', 'playwright-report'} & set(p.parts)}
for file, document in documents.items():
    for duplicate in document.duplicates:
        errors.append(f'{file.relative_to(ROOT)}: duplicate id {duplicate}')
    for tag, attribute, link in document.links:
        url = urlsplit(link)
        if tag == 'script' and (url.scheme or url.netloc):
            errors.append(f'{file.relative_to(ROOT)}: external script {link}')
        if url.scheme or url.netloc or not link or link == '#':
            continue
        target = ((ROOT / unquote(url.path).lstrip('/')) if url.path.startswith('/')
                  else file.parent / unquote(url.path)) if url.path else file
        if target.is_dir():
            target /= 'index.html'
        target = target.resolve()
        if not target.is_file():
            errors.append(f'{file.relative_to(ROOT)}: missing {link}')
        elif url.fragment and target in documents and unquote(url.fragment) not in documents[target].ids:
            errors.append(f'{file.relative_to(ROOT)}: missing anchor {link}')
for name, expected in FROZEN.items():
    if hashlib.sha256((ROOT / name).read_bytes()).hexdigest() != expected:
        errors.append(f'Immutable consent snapshot changed: {name}')
for item in json.loads((ROOT / 'docs/screenshot-provenance.json').read_text()):
    if hashlib.sha256((ROOT / item['asset']).read_bytes()).hexdigest() != item['sha256']:
        errors.append(f'Screenshot attribution/source mismatch: {item["asset"]}')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'PASS: {len(documents)} HTML documents, local assets/anchors, immutable policy and screenshot hashes')
