const PROPERTY_TYPES = [
  'Lakás',
  'Családi ház',
  'Iroda',
  'Üzlet vagy vendéglátóhely',
  'Kisebb kereskedelmi egység',
  'Egyéb',
];

const PROJECT_TYPES = [
  'Felújítás',
  'Átépítés',
  'Bővítés',
  'Belsőépítészeti tervezés előkészítése',
  'Más',
];

const DOC_TYPES = [
  'Még nem tudom, ezt szeretném az ajánlat előtt tisztázni',
  'Pontfelhő',
  '2D alaprajz',
  'Alaprajz és metszet',
  'Tervezővel egyeztetett dokumentációs csomag',
  'Más, a megjegyzésben leírom',
];

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function cleanLine(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanUrl(value) {
  const raw = cleanLine(value);
  if (!raw || raw.length > 1000) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.toString();
  } catch {
    return '';
  }
}

function cleanHost(value, fallback) {
  const host = cleanLine(value).toLowerCase().replace(/:\d+$/, '');
  if (/^[a-z0-9.-]{1,253}$/.test(host) && !host.startsWith('.') && !host.endsWith('.')) return host;
  return fallback;
}

function utmFromUrl(value) {
  const found = {};
  try {
    const url = new URL(value);
    for (const key of UTM_KEYS) found[key] = cleanLine(url.searchParams.get(key) || '').slice(0, 160);
  } catch {
    for (const key of UTM_KEYS) found[key] = '';
  }
  return found;
}

function requireMax(errors, key, value, max, label) {
  if (value.length > max) errors[key] = `A(z) ${label} legfeljebb ${max} karakter lehet.`;
}

function validateLead(body, { fallbackHost, referer }) {
  const errors = {};
  const name = cleanLine(body.name);
  const email = cleanLine(body.email).toLowerCase();
  const phone = cleanLine(body.phone);
  const city = cleanLine(body.city);
  const propertyType = cleanLine(body.property_type);
  const floorArea = cleanLine(body.floor_area);
  const projectType = cleanLine(body.project_type);
  const docType = cleanLine(body.documentation_type);
  const docNote = cleanText(body.documentation_note);
  const designer = cleanLine(body.designer);
  const deadline = cleanLine(body.deadline);
  const comment = cleanText(body.comment);
  const consent = body.consent === 'igen';
  const honeypot = cleanLine(body.pf_hp);

  if (name.length < 2) errors.name = 'Adja meg a nevét.';
  requireMax(errors, 'name', name, 100, 'név');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    errors.email = 'Adjon meg egy használható e-mail címet.';
  }
  const digits = phone.replace(/\D/g, '');
  if (!/^[0-9+()/\-\s]+$/.test(phone) || digits.length < 6 || digits.length > 15) {
    errors.phone = 'Adjon meg egy visszahívható telefonszámot.';
  }
  if (city.length < 2) errors.city = 'Adja meg a települést.';
  requireMax(errors, 'city', city, 80, 'település');
  if (!PROPERTY_TYPES.includes(propertyType)) errors.property_type = 'Válassza ki az ingatlan típusát.';
  if (!PROJECT_TYPES.includes(projectType)) errors.project_type = 'Válassza ki, milyen munkát tervez.';
  if (!DOC_TYPES.includes(docType)) errors.documentation_type = 'Válassza ki, milyen dokumentációt kér a tervező.';
  requireMax(errors, 'floor_area', floorArea, 80, 'alapterület');
  requireMax(errors, 'documentation_note', docNote, 1000, 'dokumentációs megjegyzés');
  requireMax(errors, 'designer', designer, 160, 'tervező');
  requireMax(errors, 'deadline', deadline, 120, 'határidő');
  requireMax(errors, 'comment', comment, 4000, 'megjegyzés');
  if (!consent) errors.consent = 'Az ajánlatkéréshez el kell fogadnia az adatkezelési tájékoztatót.';

  const refererUrl = cleanUrl(referer);
  const sourceUrl = cleanUrl(body.source_url) || refererUrl;
  let sourceDomain = cleanHost(body.source_domain, '');
  if (!sourceDomain && sourceUrl) {
    try {
      sourceDomain = cleanHost(new URL(sourceUrl).hostname, fallbackHost);
    } catch {
      sourceDomain = fallbackHost;
    }
  }
  if (!sourceDomain) sourceDomain = fallbackHost;

  const fromBody = {};
  const fromReferer = utmFromUrl(refererUrl);
  for (const key of UTM_KEYS) {
    const direct = cleanLine(body[key] || '').slice(0, 160);
    fromBody[key] = direct || fromReferer[key] || '';
  }

  let documentation = docType;
  if (docNote) documentation = `${docType}. Részletezés: ${docNote}`;

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    spam: Boolean(honeypot),
    values: {
      name,
      email,
      phone,
      city,
      property_type: propertyType,
      floor_area: floorArea,
      project_type: projectType,
      documentation_type: docType,
      documentation_note: docNote,
      documentation,
      designer,
      deadline,
      comment,
      consent,
      source_domain: sourceDomain,
      source_url: sourceUrl,
      ...fromBody,
    },
  };
}

function csvCell(value) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  if (/[;"\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

const CSV_COLUMNS = [
  ['id', 'Azonosító'],
  ['submitted_at', 'Beküldés időpontja'],
  ['source_domain', 'Forrásdomain'],
  ['source_url', 'Forrás URL'],
  ['utm_source', 'UTM source'],
  ['utm_medium', 'UTM medium'],
  ['utm_campaign', 'Kampány / UTM campaign'],
  ['utm_term', 'UTM term'],
  ['utm_content', 'UTM content'],
  ['name', 'Név'],
  ['email', 'E-mail'],
  ['phone', 'Telefon'],
  ['city', 'Város'],
  ['property_type', 'Ingatlan típusa'],
  ['floor_area', 'Ingatlan mérete'],
  ['project_type', 'Projekt típusa'],
  ['documentation', 'Kívánt dokumentáció'],
  ['designer', 'Tervező'],
  ['deadline', 'Határidő'],
  ['comment', 'Megjegyzés'],
  ['status', 'Státusz'],
  ['consent', 'GDPR hozzájárulás'],
  ['mail_status', 'E-mail állapot'],
  ['updated_at', 'Utolsó módosítás'],
];

function toCsv(rows) {
  const header = CSV_COLUMNS.map(([, label]) => csvCell(label)).join(';');
  const lines = rows.map((row) =>
    CSV_COLUMNS.map(([key]) => {
      if (key === 'consent') return csvCell(row.consent ? 'igen' : 'nem');
      return csvCell(row[key]);
    }).join(';')
  );
  return `\uFEFF${[header, ...lines].join('\r\n')}\r\n`;
}

module.exports = {
  PROPERTY_TYPES,
  PROJECT_TYPES,
  DOC_TYPES,
  UTM_KEYS,
  validateLead,
  csvCell,
  toCsv,
  cleanUrl,
};
