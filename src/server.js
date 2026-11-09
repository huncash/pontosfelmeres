const path = require('path');
const crypto = require('crypto');
const express = require('express');
const { loadConfig } = require('./config');
const { openDatabase, STATUS_LABEL } = require('./db');
const { validateLead, toCsv } = require('./leads');
const { notifyLead } = require('./mail');
const {
  esc,
  parseCookies,
  cookieHeader,
  createSession,
  readSession,
  passwordsMatch,
  sameOrigin,
  clientIp,
  createRateLimiter,
  refCode,
} = require('./util');
const {
  page,
  organizationLd,
  professionalServiceLd,
  faqLd,
  articleLd,
  graph,
} = require('./layout');
const { renderLeadForm } = require('./form');
const { FAQ } = require('./content/faq');
const { ARTICLES, articleBySlug } = require('./content/articles');
const pages = require('./content/pages');
const adminView = require('./admin-view');

const COOKIE = 'pf6_admin';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function siteHost(config) {
  try {
    return new URL(config.siteUrl).hostname;
  } catch {
    return 'pontosfelmeres.hu';
  }
}

function send(res, status, html) {
  res.status(status);
  res.setHeader('Cache-Control', status === 200 ? 'no-cache' : 'no-store');
  res.type('html').send(html);
}

function createApp(options = {}) {
  const config = options.config || loadConfig();
  const db = options.db || openDatabase(config.dataFile);
  const app = express();
  const limitLead = createRateLimiter({ windowMs: 30 * 60 * 1000, max: 8 });
  const limitLogin = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 8 });

  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy ? 1 : false);
  app.use(express.urlencoded({ extended: false, limit: '32kb' }));

  app.use((req, res, next) => {
    const started = process.hrtime.bigint();
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - started) / 1e6;
      console.log(`${new Date().toISOString()} ${req.method} ${req.path} ${res.statusCode} ${ms.toFixed(1)}ms`);
    });
    next();
  });

  app.use((req, res, next) => {
    const nonce = crypto.randomBytes(16).toString('base64url');
    res.locals.nonce = nonce;
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self'; img-src 'self' data:; form-action 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'`
    );
    if (req.method === 'GET' && req.path.length > 1 && req.path.endsWith('/')) {
      return res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length));
    }
    next();
  });

  function adminSession(req) {
    const cookies = parseCookies(req);
    return readSession(config.sessionSecret, cookies[COOKIE]);
  }

  function setAdminCookie(res, req, token) {
    res.setHeader(
      'Set-Cookie',
      cookieHeader(COOKIE, token, { secure: Boolean(req.secure), maxAge: 60 * 60 * 12 })
    );
  }

  function clearAdminCookie(res, req) {
    res.setHeader('Set-Cookie', cookieHeader(COOKIE, '', { secure: Boolean(req.secure), maxAge: 0 }));
  }

  function requireAdmin(req, res, next) {
    if (!config.adminEnabled) {
      send(res, 503, page({
        config,
        nonce: res.locals.nonce,
        meta: { path: '/admin', title: 'Admin | Pontosfelmérés', description: 'A lead-nyilvántartás nincs megnyitva.', crumb: 'Admin' },
        body: adminView.disabledPage(),
        robots: 'noindex,nofollow',
      }));
      return;
    }
    const session = adminSession(req);
    if (!session) {
      send(res, 401, page({
        config,
        nonce: res.locals.nonce,
        meta: { path: '/admin', title: 'Belépés | Pontosfelmérés', description: 'A lead-nyilvántartás jelszóval védett.', crumb: 'Admin' },
        body: adminView.loginPage(),
        robots: 'noindex,nofollow',
      }));
      return;
    }
    req.admin = session;
    next();
  }

  app.get('/healthz', (req, res) => {
    try {
      db.ping();
      res.type('text').send('ok');
    } catch (error) {
      console.error(error.message);
      res.status(500).type('text').send('db-error');
    }
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /koszonjuk\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const urls = [
      pages.PAGES.home,
      pages.PAGES.building,
      pages.PAGES.renovation,
      pages.PAGES.designers,
      pages.PAGES.samples,
      pages.PAGES.process,
      pages.PAGES.pricing,
      pages.PAGES.faq,
      pages.PAGES.contact,
      pages.PAGES.privacy,
      pages.PAGES.impressum,
      pages.PAGES.articles,
      ...ARTICLES,
    ];
    const body = urls
      .map((item) => {
        const loc = `${config.siteUrl}${item.path}`;
        const lastmod = item.published || '2026-11-09';
        return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
      })
      .join('\n');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
  });

  app.get('/', (req, res) => {
    const body = pages.renderHome({ formHtml: renderLeadForm() });
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: pages.PAGES.home,
      body,
      jsonLd: [graph([organizationLd(config), professionalServiceLd(config), faqLd(pages.HOME_FAQ)])],
    }));
  });

  const simple = [
    ['/epulet-felmeres', pages.PAGES.building, pages.renderBuilding],
    ['/felujitas-alapfelmeres', pages.PAGES.renovation, pages.renderRenovation],
    ['/tervezoknek', pages.PAGES.designers, pages.renderDesigners],
    ['/mintak', pages.PAGES.samples, pages.renderSamples],
    ['/folyamat', pages.PAGES.process, pages.renderProcess],
    ['/arak', pages.PAGES.pricing, pages.renderPricing],
  ];
  for (const [route, meta, render] of simple) {
    app.get(route, (req, res) => {
      send(res, 200, page({ config, nonce: res.locals.nonce, meta, body: render() }));
    });
  }

  app.get(['/felujitas-alapfelmérés', '/felujitas-alapfelm%C3%A9r%C3%A9s'], (req, res) => {
    res.redirect(301, '/felujitas-alapfelmeres');
  });

  app.get('/gyik', (req, res) => {
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: pages.PAGES.faq,
      body: pages.renderFaqPage(),
      jsonLd: [graph([faqLd(FAQ)])],
    }));
  });

  app.get('/kapcsolat', (req, res) => {
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: pages.PAGES.contact,
      body: pages.renderContact({ formHtml: renderLeadForm(), config }),
      jsonLd: [graph([professionalServiceLd(config)])],
    }));
  });

  app.get('/adatvedelem', (req, res) => {
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: pages.PAGES.privacy,
      body: pages.renderPrivacy(config),
    }));
  });

  app.get('/impresszum', (req, res) => {
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: pages.PAGES.impressum,
      body: pages.renderImpressum(config),
      jsonLd: [graph([organizationLd(config)])],
    }));
  });

  app.get('/cikkek', (req, res) => {
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: pages.PAGES.articles,
      body: pages.renderArticlesIndex(),
    }));
  });

  app.get('/cikkek/:slug', (req, res) => {
    const article = articleBySlug(req.params.slug);
    if (!article) {
      send(res, 404, page({
        config,
        nonce: res.locals.nonce,
        meta: { path: req.path, title: 'Az oldal nem található | Pontosfelmérés', description: 'A kért cím nem létezik.', crumb: 'Nem található' },
        body: pages.renderNotFound(),
        robots: 'noindex,follow',
      }));
      return;
    }
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: {
        path: article.path,
        title: `${article.title} | Pontosfelmérés`,
        description: article.description,
        crumb: article.title,
      },
      body: pages.renderArticle(article),
      crumbs: [
        { name: 'Főoldal', path: '/' },
        { name: 'Tudnivalók', path: '/cikkek' },
        { name: article.title, path: article.path },
      ],
      jsonLd: [graph([organizationLd(config), articleLd(config, article)])],
      ogType: 'article',
    }));
  });

  app.get('/koszonjuk', (req, res) => {
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: pages.PAGES.thanks,
      body: pages.renderThanks(String(req.query.ref || '')),
      robots: 'noindex,nofollow',
    }));
  });

  app.post('/ajanlat', async (req, res, next) => {
    try {
      if (!sameOrigin(req)) {
        send(res, 403, page({
          config,
          nonce: res.locals.nonce,
          meta: pages.PAGES.contact,
          body: `<article class="prose wrap"><h1>A küldés nem fogadható el</h1><p>Az űrlapot erről az oldalról lehet elküldeni.</p></article>`,
          robots: 'noindex,nofollow',
        }));
        return;
      }
      const limit = limitLead(clientIp(req));
      if (!limit.ok) {
        send(res, 429, page({
          config,
          nonce: res.locals.nonce,
          meta: { ...pages.PAGES.contact, title: 'Túl sok ajánlatkérés | Pontosfelmérés' },
          body: `<article class="prose wrap"><h1>Rövid szünet kell</h1><p>Erről a címről rövid idő alatt több ajánlatkérés érkezett. Várjon egy kicsit, vagy írjon a ${esc(config.contactEmail)} címre.</p></article>`,
          robots: 'noindex,nofollow',
        }));
        return;
      }
      const result = validateLead(req.body, { fallbackHost: siteHost(config), referer: req.get('referer') || '' });
      if (!result.ok) {
        const onContact = (() => {
          try {
            return new URL(req.get('referer') || '').pathname === '/kapcsolat';
          } catch {
            return false;
          }
        })();
        const formHtml = renderLeadForm({ values: result.values, errors: result.errors });
        if (onContact) {
          send(res, 400, page({
            config,
            nonce: res.locals.nonce,
            meta: pages.PAGES.contact,
            body: pages.renderContact({ formHtml, config }),
            robots: 'noindex,nofollow',
          }));
        } else {
          send(res, 400, page({
            config,
            nonce: res.locals.nonce,
            meta: pages.PAGES.home,
            body: pages.renderHome({ formHtml }),
            robots: 'noindex,nofollow',
          }));
        }
        return;
      }
      const lead = {
        ...result.values,
        consent: true,
        status: result.spam ? 'spam' : 'uj',
        mail_status: result.spam ? 'kimaradt' : 'fuggo',
      };
      const id = db.insertLead(lead);
      if (!result.spam) {
        const stored = db.getLead(id);
        const mailStatus = await notifyLead(config, stored, id);
        db.setMailStatus(id, mailStatus);
      }
      res.redirect(303, `/koszonjuk?ref=${refCode(id)}`);
    } catch (error) {
      next(error);
    }
  });

  app.get('/admin/bejelentkezes', (req, res) => res.redirect(302, '/admin'));

  app.post('/admin/bejelentkezes', (req, res) => {
    if (!sameOrigin(req) || !config.adminEnabled) {
      send(res, 403, page({
        config,
        nonce: res.locals.nonce,
        meta: { path: '/admin', title: 'Belépés | Pontosfelmérés', description: 'A belépés sikertelen.', crumb: 'Admin' },
        body: adminView.loginPage('A belépés most nem elérhető.'),
        robots: 'noindex,nofollow',
      }));
      return;
    }
    if (!limitLogin(clientIp(req)).ok) {
      send(res, 429, page({
        config,
        nonce: res.locals.nonce,
        meta: { path: '/admin', title: 'Belépés | Pontosfelmérés', description: 'Túl sok próbálkozás.', crumb: 'Admin' },
        body: adminView.loginPage('Túl sok próbálkozás. Várjon, és próbálja újra.'),
        robots: 'noindex,nofollow',
      }));
      return;
    }
    if (!passwordsMatch(req.body.password, config.adminToken)) {
      send(res, 401, page({
        config,
        nonce: res.locals.nonce,
        meta: { path: '/admin', title: 'Belépés | Pontosfelmérés', description: 'A jelszó nem megfelelő.', crumb: 'Admin' },
        body: adminView.loginPage('A jelszó nem megfelelő.'),
        robots: 'noindex,nofollow',
      }));
      return;
    }
    const session = createSession(config.sessionSecret);
    setAdminCookie(res, req, session.token);
    res.redirect(303, '/admin');
  });

  app.post('/admin/kijelentkezes', (req, res) => {
    const session = adminSession(req);
    if (!session || session.csrf !== req.body.csrf || !sameOrigin(req)) {
      res.status(403).type('text').send('Érvénytelen munkamenet.');
      return;
    }
    clearAdminCookie(res, req);
    res.redirect(303, '/admin');
  });

  app.get('/admin/export.csv', requireAdmin, (req, res) => {
    const rows = filteredLeads(db, req);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ajanlatkeresek.csv"');
    res.setHeader('Cache-Control', 'no-store');
    res.send(toCsv(rows));
  });

  app.get('/admin', requireAdmin, (req, res) => {
    const rows = filteredLeads(db, req);
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: { path: '/admin', title: 'Lead-nyilvántartás | Pontosfelmérés', description: 'Ajánlatkérések kezelése.', crumb: 'Admin' },
      body: adminView.listPage({
        rows,
        q: String(req.query.q || ''),
        status: STATUS_LABEL[req.query.status] ? req.query.status : '',
        includeSpam: req.query.spam === '1' || req.query.status === 'spam',
        csrf: req.admin.csrf,
      }),
      robots: 'noindex,nofollow',
    }));
  });

  app.get('/admin/leads/:id', requireAdmin, (req, res) => {
    const lead = loadLead(db, req.params.id);
    if (!lead) {
      send(res, 404, page({
        config,
        nonce: res.locals.nonce,
        meta: { path: req.path, title: 'Nincs ilyen lead | Pontosfelmérés', description: 'A kért ajánlatkérés nem található.', crumb: 'Admin' },
        body: `<article class="prose wrap"><h1>Nincs ilyen ajánlatkérés</h1><p><a href="/admin">Vissza a listához</a></p></article>`,
        robots: 'noindex,nofollow',
      }));
      return;
    }
    send(res, 200, page({
      config,
      nonce: res.locals.nonce,
      meta: { path: req.path, title: `${refCode(lead.id)} | Pontosfelmérés`, description: 'Ajánlatkérés részletei.', crumb: refCode(lead.id) },
      body: adminView.detailPage({ lead, csrf: req.admin.csrf }),
      robots: 'noindex,nofollow',
    }));
  });

  app.post('/admin/leads/:id/status', requireAdmin, (req, res) => {
    if (!sameOrigin(req) || req.body.csrf !== req.admin.csrf) {
      res.status(403).type('text').send('Érvénytelen munkamenet.');
      return;
    }
    const lead = loadLead(db, req.params.id);
    if (!lead || !STATUS_LABEL[req.body.status]) {
      res.status(400).type('text').send('A státusz nem módosítható.');
      return;
    }
    db.updateStatus(lead.id, req.body.status);
    res.redirect(303, `/admin/leads/${lead.id}`);
  });

  app.use(express.static(PUBLIC_DIR, { index: false, maxAge: '7d', fallthrough: true }));

  app.use((req, res) => {
    send(res, 404, page({
      config,
      nonce: res.locals.nonce,
      meta: { path: req.path, title: 'Az oldal nem található | Pontosfelmérés', description: 'A kért cím nem létezik a pontosfelmeres.hu oldalon.', crumb: 'Nem található' },
      body: pages.renderNotFound(),
      robots: 'noindex,follow',
    }));
  });

  app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) return next(error);
    send(res, 500, page({
      config,
      nonce: res.locals.nonce || 'error',
      meta: { path: '/hiba', title: 'Váratlan hiba | Pontosfelmérés', description: 'A kérés nem sikerült.', crumb: 'Hiba' },
      body: `<article class="prose wrap"><h1>A kérés nem sikerült</h1><p>Az ajánlatkérést nem tudtuk rögzíteni. Írjon a ${esc(config.contactEmail)} címre, ha a hiba megismétlődik.</p></article>`,
      robots: 'noindex,nofollow',
    }));
  });

  return { app, db, config };
}

function loadLead(db, rawId) {
  if (!/^\d+$/.test(String(rawId || ''))) return null;
  return db.getLead(Number(rawId));
}

function filteredLeads(db, req) {
  const status = STATUS_LABEL[req.query.status] ? req.query.status : '';
  return db.listLeads({
    status,
    q: String(req.query.q || '').slice(0, 80),
    includeSpam: req.query.spam === '1' || status === 'spam',
  });
}

function main() {
  const { app, config } = createApp();
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`${config.siteName} figyel a ${config.port} porton (${config.siteUrl}).`);
    console.log(`Adatfájl: ${config.dataFile}`);
    if (!config.adminEnabled) console.log('Az admin nincs megnyitva: állítson be egyedi ADMIN_TOKEN értéket.');
    if (!config.smtp.host) console.log('SMTP nincs beállítva: a leadek rögzülnek, e-mail nem megy ki.');
  });
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`A ${config.port} port foglalt. Ez a folyamat nem osztozik más site portján.`);
    } else {
      console.error(error);
    }
    process.exit(1);
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      server.close(() => process.exit(0));
    });
  }
}

if (require.main === module) main();

module.exports = { createApp };
