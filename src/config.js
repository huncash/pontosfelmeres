const fs = require('fs');
const path = require('path');

const PLACEHOLDER_TOKENS = new Set([
  'cserelje-le-egy-hosszu-veletlen-szovegre',
  'change-me-to-a-long-random-token',
  'change-me',
  'admin',
  'password',
  'jelszo',
]);

function loadEnvFile(file = path.resolve('.env')) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function env(name, fallback) {
  return process.env[name] === undefined ? fallback : process.env[name];
}

function boolEnv(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'igen'].includes(String(value).toLowerCase());
}

function resolveDatabasePath() {
  if (process.env.DATA_FILE) return path.resolve(process.env.DATA_FILE);
  const url = process.env.DATABASE_URL;
  if (!url) return path.resolve('data', 'leads.sqlite');
  if (url.startsWith('sqlite:') || url.startsWith('file:')) {
    const prefix = url.startsWith('sqlite:') ? 'sqlite:' : 'file:';
    let rest = url.slice(prefix.length);
    if (rest.startsWith('///')) rest = rest.slice(2);
    else if (rest.startsWith('//')) rest = rest.slice(2);
    if (!rest) {
      throw new Error('A DATABASE_URL üres útvonalat tartalmaz.');
    }
    return path.resolve(rest);
  }
  throw new Error(
    'A DATABASE_URL ebben az alkalmazásban csak sqlite: vagy file: útvonal lehet. Közös adatbázist nem használunk.'
  );
}

function loadConfig() {
  loadEnvFile();
  const port = Number.parseInt(process.env.PORT || '6000', 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('A PORT egész szám legyen 1 és 65535 között.');
  }
  const siteUrl = String(env('SITE_URL', 'https://pontosfelmeres.hu')).replace(/\/+$/, '');
  const adminToken = env('ADMIN_TOKEN', '');
  const sessionSecret = env('SESSION_SECRET', '') || `pf6:${adminToken}:session`;
  return {
    siteName: env('SITE_NAME', 'Pontosfelmérés'),
    siteUrl,
    port,
    nodeEnv: env('NODE_ENV', 'development'),
    trustProxy: boolEnv('TRUST_PROXY', false),
    dataFile: resolveDatabasePath(),
    contactEmail: env('CONTACT_EMAIL', 'info@pontosfelmeres.hu').trim(),
    contactPhone: env('CONTACT_PHONE', '+36 30 667 2510').trim(),
    companyLegalName: env('COMPANY_LEGAL_NAME', 'ADP-TOP Kereskedelmi és Szolgáltató Kft.'),
    companyShortName: env('COMPANY_SHORT_NAME', 'ADP-TOP Kft.'),
    companySeat: env('COMPANY_SEAT', '1116 Budapest, Híradó utca 29.'),
    companyRegNumber: env('COMPANY_REG_NUMBER', '01-09-872622'),
    companyCourt: env('COMPANY_COURT', 'Fővárosi Törvényszék Cégbírósága'),
    companyTaxId: env('COMPANY_TAX_ID', '13777164-2-43'),
    companyEuTaxId: env('COMPANY_EU_TAX_ID', 'HU13777164'),
    companyActivity: env('COMPANY_ACTIVITY', '4712 – Iparcikk jellegű vegyes kiskereskedelem'),
    hostingProvider: env('HOSTING_PROVIDER', '').trim(),
    hostingAddress: env('HOSTING_ADDRESS', '').trim(),
    hostingEmail: env('HOSTING_EMAIL', '').trim(),
    smtp: {
      host: env('SMTP_HOST', '').trim(),
      port: Number.parseInt(env('SMTP_PORT', '587'), 10) || 587,
      secure: boolEnv('SMTP_SECURE', false),
      user: env('SMTP_USER', ''),
      pass: env('SMTP_PASS', ''),
      from: env('SMTP_FROM', '').trim(),
      sendCustomerCopy: boolEnv('SMTP_SEND_CUSTOMER_COPY', true),
    },
    adminToken,
    adminEnabled:
      typeof adminToken === 'string' &&
      adminToken.length >= 16 &&
      !PLACEHOLDER_TOKENS.has(adminToken.toLowerCase()),
    sessionSecret,
    retentionMonths: Number.parseInt(env('RETENTION_MONTHS', '24'), 10) || 24,
    assetVersion: '4',
  };
}

module.exports = { loadConfig, loadEnvFile };
