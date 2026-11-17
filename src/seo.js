const PUBLIC_ORIGIN = 'https://pontosfelmeres.hu';

function isIndexable(config) {
  return config.nodeEnv === 'production' && config.siteUrl === PUBLIC_ORIGIN;
}

function metadataOrigin(config) {
  if (config.nodeEnv === 'production') return PUBLIC_ORIGIN;
  return config.siteUrl;
}

function effectiveRobots(config, requested = 'index,follow') {
  if (!isIndexable(config)) return 'noindex,nofollow';
  return requested;
}

function robotsTxt(config) {
  if (!isIndexable(config)) {
    return 'User-agent: *\nDisallow: /\n';
  }
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /koszonjuk',
    'Disallow: /healthz',
    '',
    `Sitemap: ${PUBLIC_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n');
}

function verificationMetas(config) {
  const tags = [];
  if (config.googleSiteVerification) {
    tags.push(`<meta name="google-site-verification" content="${config.googleSiteVerification}">`);
  }
  if (config.bingSiteVerification) {
    tags.push(`<meta name="msvalidate.01" content="${config.bingSiteVerification}">`);
  }
  return tags.join('\n  ');
}

module.exports = {
  PUBLIC_ORIGIN,
  isIndexable,
  metadataOrigin,
  effectiveRobots,
  robotsTxt,
  verificationMetas,
};
