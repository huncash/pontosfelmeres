const { esc } = require('./util');
const { PROPERTY_TYPES, PROJECT_TYPES, DOC_TYPES, UTM_KEYS } = require('./leads');

function fieldError(errors, name) {
  if (!errors || !errors[name]) return '';
  return `<p class="field-error" id="${name}-error">${esc(errors[name])}</p>`;
}

function selectField({ name, label, options, value, errors, required = true, span = false }) {
  const invalid = errors && errors[name];
  const opts = ['<option value="">Válasszon</option>']
    .concat(
      options.map(
        (option) =>
          `<option value="${esc(option)}"${option === value ? ' selected' : ''}>${esc(option)}</option>`
      )
    )
    .join('');
  return `<div class="field${span ? ' span-2' : ''}">
    <label for="${name}">${esc(label)}${required ? ' <span class="req">kötelező</span>' : ''}</label>
    <select id="${name}" name="${name}"${required ? ' required' : ''}${invalid ? ' aria-invalid="true" aria-describedby="' + name + '-error"' : ''}>${opts}</select>
    ${fieldError(errors, name)}
  </div>`;
}

function textField({ name, label, value = '', errors, type = 'text', required = false, span = false, max, hint, autocomplete }) {
  const invalid = errors && errors[name];
  return `<div class="field${span ? ' span-2' : ''}">
    <label for="${name}">${esc(label)}${required ? ' <span class="req">kötelező</span>' : ''}</label>
    <input id="${name}" name="${name}" type="${type}" value="${esc(value)}"${required ? ' required' : ''}${max ? ` maxlength="${max}"` : ''}${autocomplete ? ` autocomplete="${esc(autocomplete)}"` : ''}${invalid ? ' aria-invalid="true" aria-describedby="' + name + '-error"' : ''}>
    ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
    ${fieldError(errors, name)}
  </div>`;
}

function renderLeadForm({ values = {}, errors = null } = {}) {
  const errorKeys = errors ? Object.keys(errors) : [];
  const summary = errorKeys.length
    ? `<div class="form-errors" role="alert"><p>Az ajánlatkérést még nem rögzítettük. Javítsa a jelzett mezőket.</p><ul>${errorKeys
        .map((key) => `<li><a href="#${esc(key)}">${esc(errors[key])}</a></li>`)
        .join('')}</ul></div>`
    : '';
  const hidden = [
    ['source_url', values.source_url || ''],
    ['source_domain', values.source_domain || ''],
    ...UTM_KEYS.map((key) => [key, values[key] || '']),
  ]
    .map(([name, value]) => `<input type="hidden" name="${name}" value="${esc(value)}">`)
    .join('');

  return `<form class="lead-form" method="post" action="/ajanlat" data-lead novalidate>
    ${summary}
    ${hidden}
    <div class="hp" aria-hidden="true">
      <label for="pf_hp">Fax</label>
      <input id="pf_hp" name="pf_hp" type="text" tabindex="-1" autocomplete="off" value="">
    </div>
    <div class="form-grid">
      ${textField({ name: 'name', label: 'Név', value: values.name, errors, required: true, max: 100, autocomplete: 'name' })}
      ${textField({ name: 'email', label: 'E-mail', value: values.email, errors, type: 'email', required: true, max: 160, autocomplete: 'email' })}
      ${textField({ name: 'phone', label: 'Telefon', value: values.phone, errors, type: 'tel', required: true, max: 40, autocomplete: 'tel' })}
      ${textField({ name: 'city', label: 'Település', value: values.city, errors, required: true, max: 80, autocomplete: 'address-level2' })}
      ${selectField({ name: 'property_type', label: 'Ingatlan típusa', options: PROPERTY_TYPES, value: values.property_type, errors })}
      ${textField({ name: 'floor_area', label: 'Becsült alapterület', value: values.floor_area, errors, max: 80, hint: 'Elég a nagyságrend, például 74 m² vagy ház, két szint.' })}
      ${selectField({ name: 'project_type', label: 'Milyen munkát tervez?', options: PROJECT_TYPES, value: values.project_type, errors, span: true })}
      ${selectField({ name: 'documentation_type', label: 'Milyen dokumentációt kér a tervezője?', options: DOC_TYPES, value: values.documentation_type, errors, span: true })}
      <div class="field span-2">
        <label for="documentation_note">A dokumentáció részletezése, ha már tudja</label>
        <textarea id="documentation_note" name="documentation_note" maxlength="1000" rows="3">${esc(values.documentation_note || '')}</textarea>
        ${fieldError(errors, 'documentation_note')}
      </div>
      ${textField({ name: 'designer', label: 'Tervező neve vagy elérhetősége, ha már van', value: values.designer, errors, max: 160, span: true })}
      ${textField({ name: 'deadline', label: 'Kívánt határidő', value: values.deadline, errors, max: 120, hint: 'Ha még nincs dátum, írja be, hogy rugalmas.' })}
      <div class="field span-2">
        <label for="comment">Megjegyzés</label>
        <textarea id="comment" name="comment" maxlength="4000" rows="5">${esc(values.comment || '')}</textarea>
        <p class="hint">Ide kerülhet a cím, a szintszám, a megközelítés és az, ami a tervezés szempontjából számít.</p>
        ${fieldError(errors, 'comment')}
      </div>
      <div class="field span-2 consent">
        <label for="consent">
          <input id="consent" name="consent" type="checkbox" value="igen"${values.consent ? ' checked' : ''}${errors && errors.consent ? ' aria-invalid="true" aria-describedby="consent-error"' : ''}>
          <span>Elolvastam az <a href="/adatvedelem" target="_blank" rel="noopener">adatkezelési tájékoztatót</a>, és kérem, hogy az ajánlatkérésem ügyében megkeressenek. Hírlevelet nem kérek.</span>
        </label>
        ${fieldError(errors, 'consent')}
      </div>
    </div>
    <div class="form-actions">
      <button class="btn" type="submit">Ajánlatkérés elküldése</button>
      <p>Az elküldés még nem ajánlat és nem szerződés. Ha a kimenethez kevés az adat, előbb visszakérdezünk.</p>
    </div>
  </form>`;
}

function ctaBand() {
  return `<aside class="cta-band">
    <div>
      <h2>Kérjen ajánlatot a konkrét kimenetre</h2>
      <p>Írja meg a települést, az ingatlan típusát és azt, amit a tervező kér. Ha ez még nincs tisztázva, az ajánlat előtt ezt egyeztetjük. Az űrlap nem ad azonnali árat.</p>
    </div>
    <div class="actions">
      <a class="btn" href="/kapcsolat#ajanlat">Kérjen ajánlatot</a>
      <a class="btn btn-ghost" href="/mintak">Nézze meg, mit kap pontosan</a>
    </div>
  </aside>`;
}

module.exports = { renderLeadForm, ctaBand };
