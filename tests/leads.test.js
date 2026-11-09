const test = require('node:test');
const assert = require('node:assert/strict');
const { toCsv, validateLead } = require('../src/leads');

test('a csv pontosvesszős, és a képletet nem hagyja nyersnek', () => {
  const csv = toCsv([
    {
      id: 1,
      submitted_at: '2026-11-09T10:00:00.000Z',
      source_domain: 'pontosfelmeres.hu',
      source_url: 'https://pontosfelmeres.hu/?utm_campaign=osz',
      utm_source: 'hirlevel',
      utm_medium: 'email',
      utm_campaign: 'osz',
      utm_term: '',
      utm_content: '',
      name: '=1+1',
      email: 'anna@example.com',
      phone: '+36 30 111 2233',
      city: 'Budapest',
      property_type: 'Lakás',
      floor_area: '74 m²',
      project_type: 'Felújítás',
      documentation: '2D alaprajz',
      designer: '',
      deadline: 'rugalmas',
      comment: 'Sor1\nSor2',
      status: 'uj',
      consent: 1,
      mail_status: 'nincs_smtp',
      updated_at: '2026-11-09T10:00:00.000Z',
    },
  ]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv, /Beküldés időpontja;Forrásdomain;Forrás URL;UTM source/);
  assert.match(csv, /'=1\+1/);
  assert.match(csv, /"Sor1\nSor2"/);
  assert.match(csv, /igen/);
});

test('hozzájárulás nélkül nem érvényes a lead', () => {
  const result = validateLead(
    {
      name: 'Teszt Anna',
      email: 'anna@example.com',
      phone: '+36301112233',
      city: 'Budapest',
      property_type: 'Lakás',
      project_type: 'Felújítás',
      documentation_type: '2D alaprajz',
    },
    { fallbackHost: 'pontosfelmeres.hu', referer: '' }
  );
  assert.equal(result.ok, false);
  assert.ok(result.errors.consent);
});

test('a kitöltött csapda mező spam, de a többi adat megmarad', () => {
  const result = validateLead(
    {
      name: 'Teszt Anna',
      email: 'anna@example.com',
      phone: '+36 30 111 2233',
      city: 'Pécs',
      property_type: 'Családi ház',
      project_type: 'Bővítés',
      documentation_type: 'Pontfelhő',
      consent: 'igen',
      pf_hp: 'http://spam.example',
      utm_campaign: 'tavasz',
    },
    { fallbackHost: 'pontosfelmeres.hu', referer: 'https://pontosfelmeres.hu/?utm_source=hirdetes' }
  );
  assert.equal(result.ok, true);
  assert.equal(result.spam, true);
  assert.equal(result.values.city, 'Pécs');
  assert.equal(result.values.utm_campaign, 'tavasz');
  assert.equal(result.values.utm_source, 'hirdetes');
});
