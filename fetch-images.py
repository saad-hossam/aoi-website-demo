#!/usr/bin/env python3
"""Download every remote aoi.org.eg image used by the project into assets/images/remote/
and rewrite the data files + index.html to use the local copies (no hotlinking needed).
Usage:  python3 fetch-images.py          (run from the project root)"""
import re, os, sys, hashlib, urllib.request, urllib.parse
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'assets', 'images', 'remote')
os.makedirs(OUT, exist_ok=True)
files = [os.path.join(ROOT, 'index.html')] + [os.path.join(dp, f) for dp, _, fs in os.walk(os.path.join(ROOT, 'assets', 'js', 'data')) for f in fs if f.endswith('.js')]
pat = re.compile(r"https://www\.aoi\.org\.eg/storage/[^'\")\s]+")
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36', 'Referer': 'https://www.aoi.org.eg/'}
done, failed = {}, []
for path in files:
    src = open(path, encoding='utf8').read()
    def rep(m):
        url = m.group(0)
        if url not in done:
            name = urllib.parse.unquote(url.split('/')[-1])
            ext = os.path.splitext(name)[1].lower() or '.jpg'
            local = hashlib.md5(url.encode()).hexdigest()[:10] + ext
            try:
                data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()
                open(os.path.join(OUT, local), 'wb').write(data); done[url] = 'assets/images/remote/' + local
                print('ok  ', url)
            except Exception as e:
                failed.append((url, str(e))); done[url] = url; print('FAIL', url, e)
        return done[url]
    new = pat.sub(rep, src)
    if new != src: open(path, 'w', encoding='utf8').write(new)
print('\n%d downloaded, %d failed' % (len([1 for k, v in done.items() if k != v]), len(failed)))
