const { esc, jsonScript, safeEmail, telHref } = require('./util');

const NAV = [
  ['/epulet-felmeres', 'Épületfelmérés'],
  ['/felujitas-alapfelmeres', 'Felújítás előtt'],
  ['/tervezoknek', 'Tervezőknek'],
  ['/mintak', 'Minták'],
  ['/folyamat', 'Folyamat'],
  ['/arak', 'Árak'],
];

function organizationLd(config) {
  return {
    '@type': 'Organization',
    '@id': `${config.siteUrl}/#szervezet`,
    name: config.companyShortName,
    legalName: config.companyLegalName,
    url: config.siteUrl,
    email: safeEmail(config.contactEmail) || undefined,
    telephone: config.contactPhone || undefined,
    taxID: config.companyTaxId,
    vatID: config.companyEuTaxId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.companySeat,
      addressCountry: 'HU',
    },
  };
}

function professionalServiceLd(config) {
  return {
    '@type': 'ProfessionalService',
    '@id': `${config.siteUrl}/#szolgaltatas`,
    name: config.siteName,
    url: config.siteUrl,
    image: `${config.siteUrl}/images/og.png`,
    description:
      'Meglévő épületek terepi felmérése tervezéshez használható, előre egyeztetett dokumentációval.',
    telephone: config.contactPhone || undefined,
    email: safeEmail(config.contactEmail) || undefined,
    areaServed: { '@type': 'Country', name: 'Magyarország' },
    address: organizationLd(config).address,
    provider: { '@id': `${config.siteUrl}/#szervezet` },
    knowsAbout: [
      'épületfelmérés',
      'meglévő állapotfelmérés',
      'felújítás előtti felmérés',
      'alaprajz',
      'pontfelhő',
      'terepi felmérés',
    ],
  };
}

function breadcrumbLd(config, crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${config.siteUrl}${crumb.path}`,
    })),
  };
}

function faqLd(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

function articleLd(config, article) {
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'hu',
    datePublished: article.published,
    dateModified: article.published,
    mainEntityOfPage: `${config.siteUrl}${article.path}`,
    author: { '@type': 'Organization', name: config.companyShortName },
    publisher: { '@id': `${config.siteUrl}/#szervezet` },
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
}) {
  const canonical = `${config.siteUrl}${path}`;
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
  <meta name="robots" content="${esc(robots)}">
  <link rel="canonical" href="${esc(canonical)}">
  <link rel="alternate" hreflang="hu" href="${esc(canonical)}">
  <meta name="theme-color" content="#0c4a3e">
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:locale" content="hu_HU">
  <meta property="og:site_name" content="${esc(config.siteName)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(config.siteUrl)}/images/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Tervezéshez használható meglévő állapotfelmérés">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(config.siteUrl)}/images/og.png">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/css/site.css?v=${esc(config.assetVersion)}">
  ${scripts}
</head>
<body>
  <a class="skip" href="#tartalom">Ugrás a tartalomra</a>
  <header class="site-header">
    <div class="wrap utility">
      <p>${esc(config.companyShortName)} · meglévő állapotfelmérés</p>
      <p class="utility-links">
        <a href="/gyik">GYIK</a>
        <a href="/kapcsolat">Kapcsolat</a>
        ${phoneHref ? `<a href="${esc(phoneHref)}">${esc(config.contactPhone)}</a>` : ''}
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
          <small>tervezéshez rögzített kimenet</small>
        </span>
      </a>
      <input class="nav-toggle" id="nav-toggle" type="checkbox">
      <label class="nav-button" for="nav-toggle">Menü</label>
      <nav class="menu" aria-label="Főmenü">
        ${nav}
        <a class="menu-cta" href="/kapcsolat#ajanlat">Kérjen ajánlatot</a>
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
        <p>Meglévő épület felmérése, a tervezővel egyeztetett dokumentációval. Az ajánlat a feladat ismeretében készül.</p>
        <p>${esc(config.companyShortName)}<br>${esc(config.companySeat)}</p>
      </section>
      <section>
        <h2>Szolgáltatás</h2>
        <ul>
          <li><a href="/epulet-felmeres">Épületfelmérés</a></li>
          <li><a href="/felujitas-alapfelmeres">Felújítás előtti alapfelmérés</a></li>
          <li><a href="/tervezoknek">Tervezőknek</a></li>
          <li><a href="/mintak">Minta kimenetek</a></li>
          <li><a href="/folyamat">A felmérés menete</a></li>
          <li><a href="/arak">Árazási logika</a></li>
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
        <h2>Cég</h2>
        <ul>
          ${email ? `<li><a href="mailto:${esc(email)}">${esc(email)}</a></li>` : ''}
          ${phoneHref ? `<li><a href="${esc(phoneHref)}">${esc(config.contactPhone)}</a></li>` : ''}
          <li><a href="/adatvedelem">Adatkezelési tájékoztató</a></li>
          <li><a href="/impresszum">Impresszum</a></li>
          <li><a href="https://bim.vrgo.hu">Kapcsolódó mérnöki felület: bim.vrgo.hu</a></li>
        </ul>
      </section>
    </div>
    <div class="wrap legal-line">
      <p>© ${new Date().getFullYear()} ${esc(config.companyShortName)} Az oldal tájékoztat és ajánlatot fogad. Nem köt szerződést és nem számít árat.</p>
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
  });
}

module.exports = {
  layout,
  page,
  organizationLd,
  professionalServiceLd,
  breadcrumbLd,
  faqLd,
  articleLd,
  graph,
};
