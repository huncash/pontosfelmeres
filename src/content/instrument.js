const INSTRUMENT_CLAIMS = [
  {
    name: 'Lézeres térfelmérés adatgyűjtési sebessége',
    configuration: '',
    unit: 'pont/másodperc',
    manufacturerSource: '',
    sourceCheckedOn: '',
    deviceAccessConfirmed: false,
    ownerApproved: false,
    publishable: false,
    ratePerSecond: null,
  },
];

function isPublishableRate(claim) {
  if (!claim || claim.publishable !== true) return false;
  if (claim.ownerApproved !== true || claim.deviceAccessConfirmed !== true) return false;
  if (!claim.name || !claim.configuration || !claim.manufacturerSource || !claim.sourceCheckedOn) return false;
  if (claim.unit !== 'pont/másodperc') return false;
  return Number.isFinite(claim.ratePerSecond) && claim.ratePerSecond > 0;
}

function publishedRates(claims = INSTRUMENT_CLAIMS) {
  return claims.filter(isPublishableRate);
}

function rateHtml(claims = INSTRUMENT_CLAIMS) {
  const rows = publishedRates(claims);
  if (!rows.length) return '';
  const items = rows
    .map(
      (claim) =>
        `<li>${claim.name}: ${claim.configuration}, ${claim.ratePerSecond} ${claim.unit}. Forrás: ${claim.manufacturerSource}, ellenőrizve: ${claim.sourceCheckedOn}.</li>`
    )
    .join('');
  return `<ul class="rate-list">${items}</ul>`;
}

module.exports = { INSTRUMENT_CLAIMS, isPublishableRate, publishedRates, rateHtml };
