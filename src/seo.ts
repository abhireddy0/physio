import { absoluteUrl, INDEXABLE, PHONE, PROFILE, ROUTES, SITE_URL } from './config';

const META = {
  title: 'Physiotherapist in Bengaluru | Dr. Prashanth S., BPT MPT',
  description:
    'Book physiotherapy in Bengaluru with Dr. Prashanth S., BPT, MPT. Orthopedic, neurological and cardiac rehabilitation, plus home visits by enquiry.',
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Structured data limited to verified facts. Kept as a Person, not a LocalBusiness, as there are no clinic hours or premises details. */
function jsonLd(): object {
  const url = absoluteUrl(ROUTES.home) || undefined;
  const person = {
    '@type': 'Person',
    '@id': url ? `${url}#person` : undefined,
    name: PROFILE.name,
    jobTitle: PROFILE.title,
    telephone: PHONE.e164,
    url,
    image: url ? absoluteUrl('/images/portrait-800.jpg') : undefined,
    knowsLanguage: PROFILE.languages,
    knowsAbout: [
      'Physiotherapy',
      'Orthopedic rehabilitation',
      'Neurological rehabilitation',
      'Cardiac rehabilitation',
      'Pulmonary rehabilitation',
      'Dry needling',
      'Kinesiology taping',
      'Dry cupping',
    ],
    hasCredential: PROFILE.qualifications.map((q) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: q,
    })),
    address: {
      '@type': 'PostalAddress',
      streetAddress: PROFILE.address.street,
      addressLocality: PROFILE.address.city,
      addressRegion: PROFILE.address.region,
      postalCode: PROFILE.address.postalCode,
      addressCountry: 'IN',
    },
  };
  const service = {
    '@type': 'Service',
    name: 'Physiotherapy and home physiotherapy visits',
    serviceType: 'Physiotherapy',
    provider: url ? { '@id': `${url}#person` } : person,
    areaServed: { '@type': 'City', name: 'Bengaluru', containedInPlace: { '@type': 'State', name: 'Karnataka' } },
  };
  const graph: object[] = [person, service];
  if (url) {
    graph.push(
      { '@type': 'WebSite', '@id': `${url}#website`, url, name: PROFILE.name, inLanguage: 'en-IN' },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: META.title,
        description: META.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${url}#website` },
        about: { '@id': `${url}#person` },
        primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl('/og-image.jpg') },
      },
    );
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** <head> tags injected into the pre-rendered page. */
export function renderHead(): string {
  const meta = META;
  const canonical = absoluteUrl(ROUTES.home);
  const ogImage = absoluteUrl('/og-image.jpg');
  const index = INDEXABLE;
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${index ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}" />`,
    canonical && `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(PROFILE.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    canonical && `<meta property="og:url" content="${canonical}" />`,
    ogImage && `<meta property="og:image" content="${ogImage}" />`,
    ogImage && `<meta property="og:image:width" content="1200" />`,
    ogImage && `<meta property="og:image:height" content="630" />`,
    ogImage && `<meta property="og:image:alt" content="Dr. Prashanth S., Physiotherapist in Bengaluru" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    ogImage && `<meta name="twitter:image" content="${ogImage}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}

export function renderRobots(): string {
  if (!INDEXABLE) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

export function renderSitemap(lastmod: string): string {
  if (!INDEXABLE) return '';
  const urls = `  <url>\n    <loc>${absoluteUrl(ROUTES.home)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Escapes vCard text values (RFC 2426 §4). */
const vEsc = (s: string) => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1');

/** vCard 3.0 — only verified fields are included. */

export function renderVcard(): string {
  const site = absoluteUrl(ROUTES.home);
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vEsc(PROFILE.familyName)};${vEsc(PROFILE.givenName)};;Dr.;`,
    `FN:${PROFILE.name}`,
    `TITLE:${vEsc(PROFILE.title)}`,
    'ORG:Physiotherapy & Rehabilitation',
    `TEL;TYPE=CELL,VOICE,pref:${PHONE.e164}`,
    PROFILE.email && `EMAIL;TYPE=INTERNET:${vEsc(PROFILE.email)}`,
    `ADR;TYPE=WORK:;;${vEsc(PROFILE.address.street)};${PROFILE.address.city};${PROFILE.address.region};${PROFILE.address.postalCode};${PROFILE.address.country}`,
    site && `URL:${site}`,
    `NOTE:${vEsc(`${PROFILE.qualificationsShort}. Home physiotherapy visits in Bengaluru on enquiry. WhatsApp: ${PHONE.display}`)}`,
    'END:VCARD',
  ];
  return lines.filter(Boolean).join('\r\n') + '\r\n';
}
