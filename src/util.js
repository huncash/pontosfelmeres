const crypto = require('crypto');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function oneLine(value, max = 200) {
  return String(value ?? '').replace(/[\r\n\u0000]+/g, ' ').trim().slice(0, max);
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!key) continue;
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
  }
  return cookies;
}

function cookieHeader(name, value, { secure = false, maxAge = 0 } = {}) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

function createSession(secret, ttlSeconds = 60 * 60 * 12) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const csrf = crypto.randomBytes(18).toString('base64url');
  const payload = `${exp}.${csrf}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return { token: `${payload}.${sig}`, csrf, exp };
}

function readSession(secret, token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [exp, csrf, sig] = parts;
  if (!/^\d{10}$/.test(exp) || !/^[A-Za-z0-9_-]{8,}$/.test(csrf)) return null;
  const expected = crypto.createHmac('sha256', secret).update(`${exp}.${csrf}`).digest('base64url');
  const actualBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (actualBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(actualBuf, expectedBuf)) return null;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return null;
  return { csrf, exp: Number(exp) };
}

function passwordsMatch(input, expected) {
  const a = crypto.createHash('sha256').update(String(input ?? ''), 'utf8').digest();
  const b = crypto.createHash('sha256').update(String(expected ?? ''), 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

function sameOrigin(req) {
  const origin = req.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.get('host');
  } catch {
    return false;
  }
}

function clientIp(req) {
  return req.ip || req.socket?.remoteAddress || 'ismeretlen';
}

function createRateLimiter({ windowMs, max }) {
  const hits = new Map();
  return function limit(key) {
    const now = Date.now();
    if (hits.size > 5000) {
      for (const [storedKey, entry] of hits) {
        if (entry.reset < now) hits.delete(storedKey);
      }
    }
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return { ok: true, remaining: max - 1 };
    }
    entry.count += 1;
    if (entry.count > max) return { ok: false, remaining: 0 };
    return { ok: true, remaining: max - entry.count };
  };
}

function jsonScript(data, nonce) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script type="application/ld+json" nonce="${esc(nonce)}">${json}</script>`;
}

function refCode(id) {
  return `PF-${String(id).padStart(5, '0')}`;
}

function formatWhen(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return new Intl.DateTimeFormat('hu-HU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Budapest',
  }).format(date);
}

function safeEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '')) ? String(email) : '';
}

function telHref(phone) {
  const compact = String(phone || '').replace(/[^\d+]/g, '');
  return compact ? `tel:${compact}` : '';
}

module.exports = {
  esc,
  oneLine,
  parseCookies,
  cookieHeader,
  createSession,
  readSession,
  passwordsMatch,
  sameOrigin,
  clientIp,
  createRateLimiter,
  jsonScript,
  refCode,
  formatWhen,
  safeEmail,
  telHref,
};
