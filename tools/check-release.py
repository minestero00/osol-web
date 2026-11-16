"""Read-only release check before publishing the static installation instructions."""
import json
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parent.parent
with urllib.request.urlopen('https://api.minestero.com/app/updates.json', timeout=20) as response:
    manifest = json.load(response)["channels"]
html = (root / 'download.html').read_text()
# The manifest is authoritative; a new build requires reviewing the static notes too.
for channel in ('android_apk', 'ios_testflight'):
    release = manifest[channel]
    assert release['url'] in html, f'{channel}: update the installation link'
    assert str(release['build']) in html, f'{channel}: update the build and release notes'
assert manifest['android_store'] is None and manifest['ios_store'] is None, 'Review newly available store channels'
print('PASS: installation links/builds match public manifest; static notes still require editorial review')
