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
  assert.match(body, /<h1>Tervezéshez használható meglévő állapotfelmérés<\/h1>/);
  assert.match(body, /Pontfelhő, alaprajz és a tervezőjével egyeztetett dokumentáció\./);
  assert.match(body, /Lakás és családi ház felmérés/);
  assert.match(body, /Iroda, üzlet és kisebb kereskedelmi egység/);
  assert.match(body, /Felújítás vagy átépítés előtti állapotfelmérés/);
  assert.match(body, /A felmérést ugyanaz a csapat viszi végig\./);
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

test('a sitemap és a robots a nyilvános címeket kezeli', async () => {
  const site = await text('/sitemap.xml');
  assert.match(site.body, /felujitas-alapfelmeres/);
  assert.match(site.body, /pontfelho-alaprajz-bim/);
  assert.doesNotMatch(site.body, /\/admin/);
  const robots = await text('/robots.txt');
  assert.match(robots.body, /Disallow: \/admin/);
  assert.match(robots.body, /Sitemap: http:\/\/127\.0\.0\.1:6000\/sitemap\.xml/);
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
});
