const fs = require('fs');
const path = require('path');
const { esc, jsonScript, safeEmail, telHref } = require('./util');
const { metadataOrigin, effectiveRobots, verificationMetas } = require('./seo');

const NAV = [
  ['/epulet-felmeres', 'Épületfelmérés'],
  ['/felujitas-alapfelmeres', 'Felújítás előtt'],
  ['/tervezoknek', 'Tervezőknek'],
  ['/mintak', 'Átadott anyagok'],
  ['/folyamat', 'Folyamat'],
  ['/arak', 'Árak'],
];

function organizationLd(config) {
  const origin = metadataOrigin(config);
  return {
    '@type': 'Organization',
    '@id': `${origin}/#szervezet`,
    name: config.companyLegalName,
    alternateName: config.siteName,
    url: `${origin}/`,
    email: safeEmail(config.contactEmail) || undefined,
    telephone: config.contactPhone || undefined,
    logo: `${origin}/images/adp-top-logo.png`,
  };
}

function footerLogo() {
  const file = path.join(__dirname, '..', 'public', 'images', 'adp-top-logo.png');
  if (!fs.existsSync(file)) return '';
  const buf = fs.readFileSync(file);
  const png = buf.length >= 24 && buf.toString('ascii', 1, 4) === 'PNG';
  const width = png ? buf.readUInt32BE(16) : 120;
  const height = png ? buf.readUInt32BE(20) : 48;
  return `<img class="footer-logo" src="/images/adp-top-logo.png" width="${width}" height="${height}" alt="ADP-TOP" loading="lazy" decoding="async">`;
}

function websiteLd(config) {
  const origin = metadataOrigin(config);
  return {
    '@type': 'WebSite',
    '@id': `${origin}/#weboldal`,
    name: config.siteName,
    url: `${origin}/`,
    inLanguage: 'hu',
    publisher: { '@id': `${origin}/#szervezet` },
  };
}

function serviceLd(config) {
  const origin = metadataOrigin(config);
  return {
    '@type': 'Service',
    '@id': `${origin}/#szolgaltatas`,
    name: 'Épületfelmérés tervezéshez',
    serviceType: 'Meglévő állapotfelmérés',
    url: `${origin}/`,
    description:
      'Lakások, házak, irodák és üzlethelyiségek 3D lézeres felmérése. Pontfelhő, igény szerint alaprajz, metszet és homlokzati rajz.',
    provider: { '@id': `${origin}/#szervezet` },
    areaServed: { '@type': 'Country', name: 'Magyarország' },
    image: `${origin}/images/og.png`,
  };
}

function breadcrumbLd(config, crumbs) {
  const origin = metadataOrigin(config);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${origin}${crumb.path}`,
    })),
  };
}

function articleLd(config, article) {
  const origin = metadataOrigin(config);
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'hu',
    datePublished: article.published,
    dateModified: article.published,
    mainEntityOfPage: `${origin}${article.path}`,
    author: { '@id': `${origin}/#szervezet` },
    publisher: { '@id': `${origin}/#szervezet` },
    image: `${origin}/images/og.png`,
  };
}

function graph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}

function layout({
  config,
  nonce,
  title,
  description,
  path,
  body,
  robots = 'index,follow',
  crumbs = [],
  jsonLd = [],
  ogType = 'website',
  imageAlt = 'Épületfelmérés a tervezéshez',
}) {
  const origin = metadataOrigin(config);
  const canonical = `${origin}${path}`;
  const robotsValue = effectiveRobots(config, robots);
  const image = `${origin}/images/og.png`;
  const verify = verificationMetas(config);
  const phoneHref = telHref(config.contactPhone);
  const email = safeEmail(config.contactEmail);
  const nav = NAV.map(
    ([href, label]) =>
      `<a href="${href}"${path === href ? ' aria-current="page"' : ''}>${esc(label)}</a>`
  ).join('');
  const crumbHtml = crumbs.length
    ? `<nav class="crumbs" aria-label="Morzsa"><ol>${crumbs
        .map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return `<li>${last ? `<span aria-current="page">${esc(crumb.name)}</span>` : `<a href="${esc(crumb.path)}">${esc(crumb.name)}</a>`}</li>`;
        })
        .join('')}</ol></nav>`
    : '';
  const scripts = jsonLd.map((entry) => jsonScript(entry, nonce)).join('');

  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${esc(robotsValue)}">
  ${verify ? `${verify}\n  ` : ''}<link rel="canonical" href="${esc(canonical)}">
  <link rel="alternate" hreflang="hu" href="${esc(canonical)}">
  <meta name="theme-color" content="#0c4a3e">
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:locale" content="hu_HU">
  <meta property="og:site_name" content="${esc(config.siteName)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <meta name="twitter:image:alt" content="${esc(imageAlt)}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" type="image/png" sizes="48x48" href="/icons/icon-48.png">
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/css/site.css?v=${esc(config.assetVersion)}">
  ${scripts}
</head>
<body>
  <a class="skip" href="#tartalom">Ugrás a tartalomra</a>
  <header class="site-header">
    <div class="wrap utility">
      <p>Meglévő állapotfelmérés</p>
      <p class="utility-links">
        <a href="/gyik">GYIK</a>
        <a href="/kapcsolat">Kapcsolat</a>
        ${phoneHref ? `<a href="${esc(phoneHref)}">${esc(config.contactPhone)}</a><span>H–P 8:00–19:00</span>` : ''}
      </p>
    </div>
    <div class="wrap header-main">
      <a class="brand" href="/">
        <span class="mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="36" height="36">
            <rect x="5" y="5" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 16H14V5M34 5H43V14M43 34V43H34M14 43H5V34" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M24 14V34M14 24H34" fill="none" stroke="currentColor" stroke-width="1.4"/>
          </svg>
        </span>
        <span>
          <strong>pontosfelmérés</strong>
          <small>3D épületfelmérés</small>
        </span>
      </a>
      <input class="nav-toggle" id="nav-toggle" type="checkbox">
      <label class="nav-button" for="nav-toggle">Menü</label>
      <nav class="menu" aria-label="Főmenü">
        ${nav}
        <a class="menu-cta" href="/kapcsolat#ajanlat">Ajánlatot kérek</a>
      </nav>
    </div>
  </header>
  <main id="tartalom">
    ${crumbHtml}
    ${body}
  </main>
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <section>
        <h2>${esc(config.siteName)}</h2>
        <p>Épületek 3D lézeres felmérése felújításhoz és tervezéshez. Pontfelhő, igény szerint alaprajz, metszet és homlokzati rajz.</p>
      </section>
      <section>
        <h2>Szolgáltatás</h2>
        <ul>
          <li><a href="/epulet-felmeres">Épületfelmérés</a></li>
          <li><a href="/felujitas-alapfelmeres">Felújítás előtti alapfelmérés</a></li>
          <li><a href="/tervezoknek">Tervezőknek</a></li>
          <li><a href="/mintak">Átadott anyagok</a></li>
          <li><a href="/folyamat">A felmérés menete</a></li>
          <li><a href="/arak">Árak és ajánlatkérés</a></li>
        </ul>
      </section>
      <section>
        <h2>Tudnivalók</h2>
        <ul>
          <li><a href="/cikkek">Összes cikk</a></li>
          <li><a href="/cikkek/mikor-kell-meglevo-allapotfelmeres">Mikor kell felmérés?</a></li>
          <li><a href="/cikkek/pontfelho-alaprajz-bim">Pontfelhő, alaprajz, BIM</a></li>
          <li><a href="/cikkek/mit-kerjen-a-tervezo">Mit kérjen a tervező?</a></li>
          <li><a href="/gyik">Gyakori kérdések</a></li>
        </ul>
      </section>
      <section>
        <h2>Jogi információk</h2>
        <ul>
          ${email ? `<li><a href="mailto:${esc(email)}">${esc(email)}</a></li>` : ''}
          ${phoneHref ? `<li><a href="${esc(phoneHref)}">${esc(config.contactPhone)}</a> · H–P 8:00–19:00</li>` : ''}
          <li><a href="/adatvedelem">Adatkezelési tájékoztató</a></li>
          <li><a href="/impresszum">Impresszum</a></li>
          <li><a href="https://bim.vrgo.hu">bim.vrgo.hu</a></li>
        </ul>
      </section>
    </div>
    <div class="wrap footer-base">
      ${footerLogo()}
      <p>2016–2026 (R) Minden jog fenntartva.</p>
      <a href="/">pontosfelmeres.hu</a>
      <a href="/kapcsolat#ajanlat">Írjon nekünk</a>
      <p>Telefonon: H–P 8:00–19:00</p>
    </div>
  </footer>
  <script src="/js/site.js?v=${esc(config.assetVersion)}" defer></script>
</body>
</html>`;
}

function page({ config, nonce, meta, body, crumbs, jsonLd, robots, ogType }) {
  const trail = crumbs || (meta.path === '/' ? [] : [{ name: 'Főoldal', path: '/' }, { name: meta.crumb || meta.h1, path: meta.path }]);
  const data = [...(jsonLd || [])];
  if (trail.length) data.push(graph([breadcrumbLd(config, trail)]));
  return layout({
    config,
    nonce,
    title: meta.title,
    description: meta.description,
    path: meta.path,
    body,
    crumbs: trail,
    jsonLd: data,
    robots,
    ogType,
    imageAlt: meta.imageAlt,
  });
}

module.exports = {
  layout,
  page,
  organizationLd,
  websiteLd,
  serviceLd,
  breadcrumbLd,
  articleLd,
  graph,
};
