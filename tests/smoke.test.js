const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pontosfelmeres-'));
const TOKEN = 'teszt-admin-jelszo-123456';

process.env.DATA_FILE = path.join(tmp, 'leads.sqlite');
process.env.DATABASE_URL = '';
process.env.ADMIN_TOKEN = TOKEN;
process.env.SESSION_SECRET = 'teszt-session-titok-123456';
process.env.SITE_URL = 'http://127.0.0.1:6000';
process.env.SITE_NAME = 'Pontosfelmérés';
process.env.CONTACT_EMAIL = 'ertesites@example.com';
process.env.CONTACT_PHONE = '+36 30 667 2510';
process.env.SMTP_HOST = '';
process.env.PORT = '6000';
process.env.TRUST_PROXY = '0';
process.env.NODE_ENV = 'test';

const { createApp } = require('../src/server');

let server;
let base;
let db;

test.before(async () => {
  const created = createApp();
  db = created.db;
  server = created.app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

function leadBody(extra = {}) {
  return new URLSearchParams({
    name: 'Teszt Anna',
    email: 'anna@example.com',
    phone: '+36 30 111 2233',
    city: 'Budapest',
    property_type: 'Lakás',
    floor_area: '74 m2',
    project_type: 'Felújítás',
    documentation_type: '2D alaprajz',
    deadline: 'rugalmas',
    comment: 'A nappali és a konyha kell.',
    consent: 'igen',
    source_domain: '127.0.0.1',
    utm_campaign: 'osz',
    ...extra,
  });
}

async function text(pathname) {
  const response = await fetch(base + pathname);
  return { response, body: await response.text() };
}

test('a főoldal a kért főcímet és a három szolgáltatást mutatja', async () => {
  const { response, body } = await text('/');
  assert.equal(response.status, 200);
  assert.match(body, /<h1>3D épületfelmérés felújításhoz és tervezéshez<\/h1>/);
  assert.match(body, /3D lézerszkennerrel/);
  assert.match(body, /pontokból álló digitális képe/);
  assert.match(body, /href="#ajanlat">Ajánlatot kérek/);
  assert.match(body, /href="#mit-kapok">Mit adunk át\?/);
  assert.match(body, /A megrendelt felmérés és dokumentáció pontos tartalmát az ajánlatban rögzítjük\./);
  assert.match(body, /<small>3D épületfelmérés<\/small>/);
  assert.match(body, /Átadott anyagok/);
  assert.match(body, /Árak és ajánlatkérés/);
  assert.doesNotMatch(body, /Helyőrző|Ide kerül a jóváhagyott projektábra|Ami nincs a listán|24 órás ajánlatot|tervezéshez rögzített kimenet/);
  assert.doesNotMatch(body, /kimenet/);
  assert.doesNotMatch(body, /pont\/másodperc|képpont\/másodperc|millió pont|modell-előkészítés|Teszt Anna|másnapi átad/);
  assert.match(body, /2016–2026 \(R\) Minden jog fenntartva\./);
  assert.match(body, /href="\/">pontosfelmeres\.hu/);
  assert.match(body, /href="\/kapcsolat#ajanlat">Írjon nekünk/);
  assert.match(body, /Telefonon: H–P 8:00–19:00/);
  assert.doesNotMatch(body, /ADP-TOP Kft/);
  assert.doesNotMatch(body, /Híradó/);
  assert.match(body, /property="og:title"/);
  assert.match(body, /application\/ld\+json/);
  assert.doesNotMatch(body, /garantált pontosság/);
  assert.doesNotMatch(body, /nulla hiba/);
});

test('a főoldal belső linkjei élnek, és a szöveg a kért keretben marad', async () => {
  const pagesToScan = ['/', '/arak', '/epulet-felmeres'];
  const hrefs = new Set();
  for (const pathname of pagesToScan) {
    const { body } = await text(pathname);
    for (const match of body.matchAll(/href="(\/[^"#?]*)/g)) {
      if (match[1] && match[1] !== '/') hrefs.add(match[1]);
    }
  }
  for (const href of hrefs) {
    const { response } = await text(href);
    assert.equal(response.status, 200, href);
  }
  const { body } = await text('/');
  const marketing = body.split('id="ajanlat"')[0].replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  const words = marketing.split(/\s+/).filter(Boolean);
  assert.ok(words.length >= 120 && words.length <= 450, `szószám: ${words.length}`);
  assert.match(body, /action="\/ajanlat"/);
  assert.doesNotMatch(body, /alaprajz, metszet és pontfelhő/);
});

test('az impresszumban megmarad az üzemeltető, a főtevékenységi sor nincs', async () => {
  const { body } = await text('/impresszum');
  assert.match(body, /ADP-TOP Kereskedelmi és Szolgáltató Kft\./);
  assert.match(body, /Híradó utca 29/);
  assert.doesNotMatch(body, /4712/);
  assert.doesNotMatch(body, /Iparcikk jellegű vegyes kiskereskedelem/);
  assert.doesNotMatch(body, /független címen/);
});

test('a nyilvános oldalak válaszolnak', async () => {
  const paths = [
    '/epulet-felmeres',
    '/felujitas-alapfelmeres',
    '/tervezoknek',
    '/mintak',
    '/folyamat',
    '/arak',
    '/gyik',
    '/kapcsolat',
    '/adatvedelem',
    '/impresszum',
    '/cikkek',
    '/cikkek/mikor-kell-meglevo-allapotfelmeres',
    '/cikkek/pontfelho-alaprajz-bim',
    '/cikkek/mit-kerjen-a-tervezo',
    '/cikkek/milyen-dokumentumok-kellenek',
    '/cikkek/mikor-nem-eleg-a-kezi-felmeres',
    '/cikkek/hogyan-zajlik-a-helyszini-felmeres',
    '/healthz',
  ];
  for (const pathname of paths) {
    const { response } = await text(pathname);
    assert.equal(response.status, 200, pathname);
  }
});

test('fejlesztői módban a sitemap üres, a robots nem hirdet indexelést', async () => {
  const site = await text('/sitemap.xml');
  assert.doesNotMatch(site.body, /<loc>/);
  assert.doesNotMatch(site.body, /\/admin/);
  assert.doesNotMatch(site.body, /127\.0\.0\.1/);
  const robots = await text('/robots.txt');
  assert.match(robots.body, /Disallow: \//);
  assert.doesNotMatch(robots.body, /Sitemap:/);
  const home = await text('/');
  assert.match(home.body, /noindex,nofollow/);
});

test('az ékezetes felújítási cím átirányít', async () => {
  const response = await fetch(base + '/felujitas-alapfelmérés', { redirect: 'manual' });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), '/felujitas-alapfelmeres');
});

test('hiányos űrlap nem rögzít leadet', async () => {
  const response = await fetch(base + '/ajanlat', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: leadBody({ consent: '' }),
  });
  assert.equal(response.status, 400);
  const body = await response.text();
  assert.match(body, /adatkezelési tájékoztatót/);
});

test('érvényes ajánlatkérés visszaigazolást ad, és az admin CSV-be exportálja', async () => {
  const created = await fetch(base + '/ajanlat', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: leadBody({ utm_source: 'teszt' }),
    redirect: 'manual',
  });
  assert.equal(created.status, 303);
  const location = created.headers.get('location');
  assert.match(location, /^\/koszonjuk\?ref=PF-\d{5}$/);
  const thanks = await text(location);
  assert.match(thanks.body, /Rögzítettük az ajánlatkérését/);
  assert.match(thanks.body, /PF-/);

  const hidden = await text('/admin');
  assert.equal(hidden.response.status, 401);
  assert.doesNotMatch(hidden.body, /anna@example.com/);

  const login = await fetch(base + '/admin/bejelentkezes', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ password: TOKEN }),
    redirect: 'manual',
  });
  assert.equal(login.status, 303);
  const cookie = login.headers.getSetCookie().find((item) => item.startsWith('pf6_admin=')).split(';')[0];
  const admin = await fetch(base + '/admin', { headers: { cookie } });
  const adminBody = await admin.text();
  assert.match(adminBody, /anna@example.com/);
  assert.match(adminBody, /Budapest/);

  const csv = await fetch(base + '/admin/export.csv', { headers: { cookie } });
  const csvBody = await csv.text();
  assert.match(csvBody, /Kampány \/ UTM campaign/);
  assert.match(csvBody, /anna@example.com/);
  assert.match(csvBody, /teszt/);

  const minimal = await fetch(base + '/ajanlat', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      name: 'Teszt Béla',
      email: 'bela@example.com',
      comment: 'A földszinti nappalit szeretném felméretni.',
      consent: 'igen',
    }),
    redirect: 'manual',
  });
  assert.equal(minimal.status, 303);
  const ref = new URL(minimal.headers.get('location'), base).searchParams.get('ref');
  const detail = await fetch(`${base}/admin/leads/${Number(ref.slice(3))}`, { headers: { cookie } });
  const detailBody = await detail.text();
  assert.equal(detail.status, 200);
  assert.match(detailBody, /bela@example.com/);
  assert.match(detailBody, /A földszinti nappalit szeretném felméretni/);
});
