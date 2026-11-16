const test = require('node:test');
const assert = require('node:assert/strict');
const { isPublishableRate, publishedRates, rateHtml, INSTRUMENT_CLAIMS } = require('../src/content/instrument');

const approved = {
  name: 'Lézeres térfelmérés adatgyűjtési sebessége',
  configuration: 'gyári alapbeállítás, egy álláspont',
  unit: 'pont/másodperc',
  manufacturerSource: 'https://example.invalid/spec',
  sourceCheckedOn: '2026-11-13',
  deviceAccessConfirmed: true,
  ownerApproved: true,
  publishable: true,
  ratePerSecond: 1000,
};

test('jóváhagyás nélkül nincs publikus sebesség', () => {
  assert.equal(publishedRates(INSTRUMENT_CLAIMS).length, 0);
  assert.equal(rateHtml(INSTRUMENT_CLAIMS), '');
  assert.equal(isPublishableRate({ ...approved, ownerApproved: false }), false);
  assert.equal(isPublishableRate({ ...approved, deviceAccessConfirmed: false }), false);
  assert.equal(isPublishableRate({ ...approved, publishable: false }), false);
  assert.equal(isPublishableRate({ ...approved, manufacturerSource: '' }), false);
  assert.equal(isPublishableRate({ ...approved, ratePerSecond: null }), false);
});

test('a pont/másodperc nem jelenik meg képpontként', () => {
  assert.equal(isPublishableRate({ ...approved, unit: 'képpont/másodperc' }), false);
  const html = rateHtml([{ ...approved }]);
  assert.match(html, /1000 pont\/másodperc/);
  assert.doesNotMatch(html, /képpont/);
});
