const { esc, formatWhen, refCode } = require('./util');
const { STATUSES, STATUS_LABEL } = require('./db');

const MAIL_LABEL = {
  fuggo: 'Küldés folyamatban',
  nincs_smtp: 'Nincs SMTP, a lead rögzítve van',
  nincs_cimzett: 'Nincs címzett e-mail',
  elkuldve: 'Értesítés elküldve',
  reszben: 'Az üzemeltetői levél kiment, a másolat nem',
  hiba: 'Az e-mail küldése nem sikerült, a lead rögzítve van',
  kimaradt: 'Spam, levelet nem küldtünk',
};

function statusOptions(current) {
  return STATUSES.map(
    ([value, label]) =>
      `<option value="${value}"${value === current ? ' selected' : ''}>${esc(label)}</option>`
  ).join('');
}

function loginPage(error) {
  return `
  <article class="prose wrap admin">
    <p class="kicker">Admin</p>
    <h1>Lead-nyilvántartás</h1>
    <p>A felület az ajánlatkéréseket mutatja. A jelszó az ADMIN_TOKEN környezeti változó.</p>
    ${error ? `<p class="form-errors" role="alert">${esc(error)}</p>` : ''}
    <form class="lead-form" method="post" action="/admin/bejelentkezes">
      <div class="field">
        <label for="password">Jelszó</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>
      </div>
      <div class="form-actions">
        <button class="btn" type="submit">Belépés</button>
      </div>
    </form>
  </article>`;
}

function disabledPage() {
  return `
  <article class="prose wrap admin">
    <p class="kicker">Admin</p>
    <h1>A nyilvántartás még nincs megnyitva</h1>
    <p>Állítson be legalább 16 karakteres ADMIN_TOKEN értéket a környezeti fájlban. A példa jelszó szándékosan nem fogadható el.</p>
  </article>`;
}

function listPage({ rows, q, status, includeSpam, csrf }) {
  const body = rows.length
    ? `<div class="table-wrap"><table>
        <thead><tr>
          <th>Szám</th><th>Időpont</th><th>Név</th><th>Elérhetőség</th><th>Feladat</th><th>Státusz</th>
        </tr></thead>
        <tbody>
          ${rows
            .map(
              (row) => `<tr>
                <td><a href="/admin/leads/${row.id}">${esc(refCode(row.id))}</a></td>
                <td>${esc(formatWhen(row.submitted_at))}</td>
                <td>${esc(row.name)}<br><span class="muted">${esc(row.city)}</span></td>
                <td>${esc(row.email)}<br>${esc(row.phone)}</td>
                <td>${esc(row.project_type)}<br><span class="muted">${esc(row.property_type)}</span></td>
                <td>${esc(STATUS_LABEL[row.status] || row.status)}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table></div>`
    : `<p>Nincs a szűrésnek megfelelő ajánlatkérés.</p>`;

  return `
  <article class="prose wrap admin">
    <div class="admin-bar">
      <div>
        <p class="kicker">Admin</p>
        <h1>Ajánlatkérések</h1>
      </div>
      <form method="post" action="/admin/kijelentkezes">
        <input type="hidden" name="csrf" value="${esc(csrf)}">
        <button class="btn btn-ghost" type="submit">Kilépés</button>
      </form>
    </div>
    <form class="filters" method="get" action="/admin">
      <label>Keresés <input name="q" value="${esc(q)}" maxlength="80"></label>
      <label>Státusz
        <select name="status">
          <option value="">Összes</option>
          ${statusOptions(status)}
        </select>
      </label>
      <label class="check"><input type="checkbox" name="spam" value="1"${includeSpam ? ' checked' : ''}> Spam is</label>
      <button class="btn" type="submit">Szűrés</button>
      <a class="btn btn-ghost" href="/admin/export.csv">CSV export</a>
    </form>
    ${body}
    <p class="hint">A CSV pontosvesszős és UTF-8, a magyar Excelhez. Legfeljebb 500 tétel látszik a listában; az export a szűrés szerinti találatokat tartalmazza.</p>
  </article>`;
}

function detailPage({ lead, csrf }) {
  const rows = [
    ['Hivatkozás', refCode(lead.id)],
    ['Beküldés', formatWhen(lead.submitted_at)],
    ['Utolsó módosítás', formatWhen(lead.updated_at)],
    ['Státusz', STATUS_LABEL[lead.status] || lead.status],
    ['E-mail állapot', MAIL_LABEL[lead.mail_status] || lead.mail_status],
    ['Név', lead.name],
    ['E-mail', lead.email],
    ['Telefon', lead.phone],
    ['Város', lead.city],
    ['Ingatlan típusa', lead.property_type],
    ['Ingatlan mérete', lead.floor_area],
    ['Projekt típusa', lead.project_type],
    ['Kívánt dokumentáció', lead.documentation],
    ['Tervező', lead.designer],
    ['Határidő', lead.deadline],
    ['Forrásdomain', lead.source_domain],
    ['Forrás URL', lead.source_url],
    ['Kampány', lead.utm_campaign],
    ['UTM source', lead.utm_source],
    ['UTM medium', lead.utm_medium],
    ['UTM term', lead.utm_term],
    ['UTM content', lead.utm_content],
    ['GDPR hozzájárulás', lead.consent ? 'igen' : 'nem'],
  ];
  return `
  <article class="prose wrap admin">
    <p class="kicker"><a href="/admin">Vissza a listához</a></p>
    <h1>${esc(lead.name)}</h1>
    <dl class="facts">
      ${rows
        .map(
          ([label, value]) =>
            `<div><dt>${esc(label)}</dt><dd>${esc(value || '–')}</dd></div>`
        )
        .join('')}
    </dl>
    <h2>Megjegyzés</h2>
    <div class="prewrap">${esc(lead.comment || 'Nincs megjegyzés.')}</div>
    <form class="status-form" method="post" action="/admin/leads/${lead.id}/status">
      <input type="hidden" name="csrf" value="${esc(csrf)}">
      <label for="status">Státusz</label>
      <select id="status" name="status">${statusOptions(lead.status)}</select>
      <button class="btn" type="submit">Mentés</button>
    </form>
  </article>`;
}

module.exports = { loginPage, disabledPage, listPage, detailPage, MAIL_LABEL };
