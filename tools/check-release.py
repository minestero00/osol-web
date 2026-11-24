"""Read-only release check before publishing the static installation instructions."""
import json
import urllib.request
from pathlib import Path
from html.parser import HTMLParser

root = Path(__file__).resolve().parent.parent
with urllib.request.urlopen('https://api.minestero.com/app/updates.json', timeout=20) as response:
    manifest = json.load(response)["channels"]
html = (root / 'download.html').read_text()
class InstallSections(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = None
        self.text = {'android': [], 'ios': []}
        self.links = {'android': [], 'ios': []}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'section' and attrs.get('id') in self.text:
            self.active = attrs['id']
        if self.active and tag == 'a':
            self.links[self.active].append(attrs.get('href'))
    def handle_endtag(self, tag):
        if tag == 'section':
            self.active = None
    def handle_data(self, data):
        if self.active:
            self.text[self.active].append(data)
sections = InstallSections()
sections.feed(html)
# The manifest is authoritative; a new build requires reviewing the static notes too.
for channel in ('android_apk', 'ios_testflight'):
    release = manifest[channel]
    platform = 'android' if channel == 'android_apk' else 'ios'
    text = ' '.join(' '.join(sections.text[platform]).split())
    assert release['url'] in sections.links[platform], f'{channel}: update the installation link'
    assert f"{release['version']} · 빌드{release['build']}" in text, f'{channel}: update this platform build; another platform does not prove it'
assert manifest['android_store'] is None and manifest['ios_store'] is None, 'Review newly available store channels'
print('PASS: installation links/builds match public manifest; static notes still require editorial review')
