"""Prepare the website catalogue offline. Never change the feed or podcast media."""
from pathlib import Path
from html.parser import HTMLParser
import json, re, shutil, sys, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT.parent
DATA = ROOT / 'src/app/the-deep-end/data.ts'
NS = {'i': 'http://www.itunes.com/dtds/podcast-1.0.dtd'}

class Text(HTMLParser):
    def __init__(self): super().__init__(); self.parts = []
    def handle_data(self, data): self.parts.append(data)
    def handle_starttag(self, tag, attrs):
        if tag in ['p', 'br', 'div']: self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ['p', 'div']: self.parts.append('\n')

source = DATA.read_text()
prefix, tail = source.split('export const episodes = ', 1)
array, suffix = tail.split('];', 1)
existing = {e['episode_number']: e for e in json.loads(array+']')}
supplied = {e['episode_number']: e for e in json.loads((ROOT/'public/episode-visuals/episodes.json').read_text())}
art = {e['episode_number']: e['jpg'] for e in json.loads((WORK/'outputs/artwork/episode-art-manifest.json').read_text())}
new_packages = {e['episode']: e for e in json.loads((WORK/'outputs/pending-episodes-69-plus/inventory.json').read_text())}
target_count = int(sys.argv[2]) if len(sys.argv) > 2 else 96
assert target_count == 96, 'Only the creator-approved96 snapshot is authorized here'
episodes = []
for item in ET.parse(sys.argv[1]).findall('./channel/item'):
    n = int(item.findtext('i:episode', namespaces=NS))
    assert 1 <= n <= target_count
    if n <= 68 and n in existing:
        old = existing[n]
        assert old['guid'] == item.findtext('guid') and old['title'] == item.findtext('title')
        episodes.append(old)
        continue
    manifest = new_packages[n] if n >= 69 else (json.loads((WORK/f'outputs/episode{n}-preparation/manifest.json').read_text()) if n > 46 else None)
    old = existing.get(n) or supplied.get(n) or manifest
    slug = old.get('slug') or re.sub(r'^ep\d+-', '', Path(manifest['source_audio']).stem)
    t = Text(); t.feed(item.findtext('description', ''))
    description = '\n'.join(t.parts)
    synopsis = re.sub(r'\s+', ' ', description.split('Chapters',1)[0].split('Created by Sankalp',1)[0]).strip()
    assert synopsis and not synopsis.startswith('Scripts generated')
    chunks = item.findtext('i:duration', namespaces=NS).split(':')
    duration = 0
    for chunk in chunks: duration = duration*60+float(chunk)
    series = 'The Facility' if 52 <= n <= 67 else (old.get('series') or 'Engineering Deep Dives')
    if n >= 47 and not 52 <= n <= 67: series = 'Engineering Deep Dives'
    if n >= 69: series = manifest.get('series') or 'Engineering Deep Dives'
    chapters = [{'time': a, 'title': b.strip()} for a,b in re.findall(r'(\d{2}:\d{2}:\d{2})\s+([^\n]+)', description.split('Created by Sankalp',1)[0])]
    cover = f'/images/the-deep-end/episodes/{n:02d}-{slug}.jpg'
    cover_source = Path(manifest['cover_jpg'] if manifest else art[n])
    target = ROOT/'public'/cover.lstrip('/'); target.parent.mkdir(parents=True,exist_ok=True); shutil.copyfile(cover_source,target)
    episodes.append({'episode_number': n, 'title': item.findtext('title'), 'series': series, 'slug': slug,
                     'synopsis_draft': synopsis, 'duration_seconds': duration, 'guid': item.findtext('guid'),
                     'public_episode_url': item.findtext('link'), 'cover': cover, 'chapters': chapters,
                     'has_visual': old.get('has_visual', n <= 70)})
episodes.sort(key=lambda e:e['episode_number'])
assert [e['episode_number'] for e in episodes] == list(range(1,target_count+1))
assert len({e['slug'] for e in episodes}) == target_count
assert len({e['guid'] for e in episodes}) == target_count
assert all(existing[n]['slug']==episodes[n-1]['slug'] for n in existing)
assert all(existing[n] == episodes[n-1] for n in existing if n <= 68)
# Keep existing audioUrls unchanged. The supplied player expansion is intentionally excluded.
DATA.write_text(prefix+'export const episodes = '+json.dumps(episodes,ensure_ascii=False,indent=2)+';'+suffix)
(ROOT/'public/episode-visuals/episodes.json').write_text(json.dumps(episodes,ensure_ascii=False,indent=2)+'\n')
print('Prepared96 approved entries and new28 exact cover copies; retained original68 records/routes and audioUrls. Only prepared companions are enabled.')
