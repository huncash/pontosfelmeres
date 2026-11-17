const assert = require('node:assert/strict');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const test = require('node:test');

const dataFile = path.join(os.tmpdir(), `pf-seo-${process.pid}.sqlite`);
process.env.DATA_FILE = dataFile;
process.env.NODE_ENV = 'production';
process.env.SITE_URL = 'https://pontosfelmeres.hu';
process.env.ADMIN_TOKEN = 'teszt-admin-jelszo-123456';
process.env.SMTP_HOST = '';
process.env.PORT = '6000';
process.env.GOOGLE_SITE_VERIFICATION = '';
process.env.BING_SITE_VERIFICATION = '';

const { createApp } = require('../src/server');
const { loadConfig } = require('../src/config');

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function text(base, pathname, headers) {
  const response = await fetch(base + pathname, { headers, redirect: 'manual' });
  return { response, body: await response.text() };
}

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

test('éles metaadat, sitemap és megosztás', async (t) => {
  const { app, db } = createApp();
  const server = await listen(app);
  t.after(async () => {
    await close(server);
    db.close();
    for (const suffix of ['', '-wal', '-shm']) fs.rmSync(dataFile + suffix, { force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  const home = await text(base, '/?utm_source=hirlevel&utm_medium=email');
  assert.equal(home.response.status, 200);
  assert.match(home.body, /<html lang="hu">/);
  assert.match(home.body, /<title>3D épületfelmérés, alaprajz és pontfelhő \| Pontosfelmérés<\/title>/);
  assert.match(home.body, /3D lézeres felmérése\. Pontfelhő, igény szerint alaprajz, metszet és homlokzati rajz/);
  assert.match(home.body, /rel="canonical" href="https:\/\/pontosfelmeres\.hu\/"/);
  assert.doesNotMatch(home.body, /canonical" href="[^"]*(utm_|localhost|127\.0\.0\.1|:6000)/);
  assert.doesNotMatch(home.body, /localhost|127\.0\.0\.1|:6000/);
  assert.match(home.body, /name="robots" content="index,follow"/);
  assert.equal(home.response.headers.get('x-robots-tag'), 'index,follow');
  assert.match(home.body, /property="og:image" content="https:\/\/pontosfelmeres\.hu\/images\/og\.png"/);
  assert.match(home.body, /property="og:locale" content="hu_HU"/);
  assert.match(home.body, /name="twitter:card" content="summary_large_image"/);
  assert.match(home.body, /href="\/favicon\.ico"/);
  assert.doesNotMatch(home.body, /FAQPage|AggregateRating|openingHours|streetAddress/);

  const blocks = [...home.body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length >= 1);
  const graph = JSON.parse(blocks[0][1]);
  const types = graph['@graph'].map((node) => node['@type']);
  assert.deepEqual(types, ['WebSite', 'Organization', 'Service']);
  assert.equal(graph['@graph'][1].name, 'ADP-TOP Kereskedelmi és Szolgáltató Kft.');
  assert.equal(graph['@graph'][1].alternateName, 'Pontosfelmérés');

  const site = await text(base, '/sitemap.xml');
  const locs = [...site.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locs.includes('https://pontosfelmeres.hu/'));
  assert.ok(locs.includes('https://pontosfelmeres.hu/felujitas-alapfelmeres'));
  assert.ok(locs.includes('https://pontosfelmeres.hu/cikkek/pontfelho-alaprajz-bim'));
  for (const loc of locs) {
    assert.match(loc, /^https:\/\/pontosfelmeres\.hu\//);
    assert.doesNotMatch(loc, /localhost|:6000|\/admin|\/koszonjuk|\/healthz/);
  }
  const dates = [...site.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
  assert.equal(dates.length, locs.length);
  for (const date of dates) assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(dates.includes('2026-11-09'));
  assert.ok(dates.includes('2026-11-17'));

  const titles = new Set();
  const descriptions = new Set();
  for (const loc of locs) {
    const pathname = loc.replace('https://pontosfelmeres.hu', '') || '/';
    const page = await text(base, pathname);
    assert.equal(page.response.status, 200, pathname);
    const title = page.body.match(/<title>([^<]*)<\/title>/)[1];
    const description = page.body.match(/<meta name="description" content="([^"]*)"/)[1];
    assert.ok(title.length > 10, pathname);
    assert.ok(description.length > 40, pathname);
    assert.equal(titles.has(title), false, title);
    assert.equal(descriptions.has(description), false, description);
    titles.add(title);
    descriptions.add(description);
    assert.match(page.body, new RegExp(`rel="canonical" href="${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.equal((page.body.match(/<h1>/g) || []).length, 1, pathname);
    assert.doesNotMatch(page.body, /localhost|127\.0\.0\.1|:6000/);
    const jsonBlocks = [...page.body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    for (const block of jsonBlocks) {
      const parsed = JSON.parse(block[1]);
      const raw = JSON.stringify(parsed);
      assert.doesNotMatch(raw, /FAQPage|AggregateRating|openingHours|streetAddress|priceRange/);
    }
  }

  const robots = await text(base, '/robots.txt');
  assert.match(robots.body, /Sitemap: https:\/\/pontosfelmeres\.hu\/sitemap\.xml/);
  assert.match(robots.body, /Disallow: \/admin/);
  assert.doesNotMatch(robots.body, /localhost|:6000/);

  const missing = await text(base, '/nincs-ilyen-oldal');
  assert.equal(missing.response.status, 404);
  assert.match(missing.body, /noindex/);
  assert.equal(locs.includes('https://pontosfelmeres.hu/nincs-ilyen-oldal'), false);

  const thanks = await text(base, '/koszonjuk');
  assert.match(thanks.body, /noindex,nofollow/);
  const gyik = await text(base, '/gyik');
  assert.doesNotMatch(gyik.body, /FAQPage/);

  const root = path.join(__dirname, '..', 'public');
  for (const file of [
    'favicon.ico',
    'favicon.svg',
    'icons/icon-48.png',
    'icons/icon-96.png',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/apple-touch-icon.png',
    'images/og.png',
  ]) {
    assert.equal(fs.existsSync(path.join(root, file)), true, file);
  }
  assert.deepEqual(pngSize(path.join(root, 'images', 'og.png')), { width: 1200, height: 630 });
  assert.deepEqual(pngSize(path.join(root, 'icons', 'icon-512.png')), { width: 512, height: 512 });
});

test('hibás éles cím sem ír localhostot a metaadatba', async (t) => {
  const config = {
    ...loadConfig(),
    nodeEnv: 'production',
    siteUrl: 'http://127.0.0.1:6000',
    dataFile: path.join(os.tmpdir(), `pf-seo-bad-${process.pid}.sqlite`),
  };
  const { app, db } = createApp({ config });
  const server = await listen(app);
  t.after(async () => {
    await close(server);
    db.close();
    for (const suffix of ['', '-wal', '-shm']) fs.rmSync(config.dataFile + suffix, { force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const home = await text(base, '/');
  assert.match(home.body, /noindex,nofollow/);
  assert.match(home.body, /rel="canonical" href="https:\/\/pontosfelmeres\.hu\/"/);
  assert.doesNotMatch(home.body, /localhost|127\.0\.0\.1|:6000/);
  const site = await text(base, '/sitemap.xml');
  assert.doesNotMatch(site.body, /<loc>/);
});

test('a www cím az apexre megy', async (t) => {
  const data = path.join(os.tmpdir(), `pf-seo-www-${process.pid}.sqlite`);
  const { app, db } = createApp({
    config: { ...loadConfig(), dataFile: data },
  });
  const server = await listen(app);
  t.after(async () => {
    await close(server);
    db.close();
    for (const suffix of ['', '-wal', '-shm']) fs.rmSync(data + suffix, { force: true });
  });
  const location = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: server.address().port,
        path: '/arak/?utm_source=cegprofil',
        headers: { host: 'www.pontosfelmeres.hu' },
      },
      (res) => {
        res.resume();
        resolve(res.headers.location);
      }
    );
    req.on('error', reject);
    req.end();
  });
  assert.equal(location, 'https://pontosfelmeres.hu/arak?utm_source=cegprofil');
});
