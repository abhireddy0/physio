// Single source of truth for verified professional details and site URLs.
// Only information supplied by Dr. Prashanth belongs here — leave unknown
// fields empty rather than guessing.

function normaliseSiteUrl(raw: string | undefined): string {
  const url = (raw ?? '').trim().replace(/\/+$/, '');
  if (!/^https?:\/\//.test(url)) return '';
  // Never let a local address leak into canonical URLs or the vCard.
  if (/\/\/(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.)/.test(url)) return '';
  return url;
}

/** Production origin, e.g. "https://www.example.in". Empty until the domain is configured. */
export const SITE_URL = normaliseSiteUrl(import.meta.env.VITE_SITE_URL);

/** Indexing is only allowed for a configured production domain. */
export const INDEXABLE = SITE_URL !== '' && import.meta.env.VITE_ALLOW_INDEXING !== 'false';

export const ROUTES = {
  home: '/',
  vcard: '/prashanth-s.vcf',
} as const;

/** Absolute URL for a route, or '' when no domain is configured yet. */
export function absoluteUrl(path: string): string {
  return SITE_URL ? SITE_URL + path : '';
}

export const PROFILE = {
  name: 'Dr. Prashanth S.',
  givenName: 'Prashanth',
  familyName: 'S.',
  title: 'Physiotherapist',
  tagline: 'Physiotherapy & Rehabilitation',
  qualifications: ['Bachelor of Physiotherapy (BPT)', 'Master of Physiotherapy (MPT) in Musculoskeletal Sciences'],
  qualificationsShort: 'BPT, MPT (Musculoskeletal Sciences)',
  experience: '4+ years of experience at Manipal Hospitals',
  patients: '800+ patients treated',
  city: 'Bengaluru',
  region: 'Karnataka',
  country: 'India',
  locationLine: 'Bengaluru, Karnataka, India',
  address: { street: 'Hebbal, R. T. Nagar Post', city: 'Bengaluru', region: 'Karnataka', postalCode: '560032', country: 'India' },
  languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
  // Social links render only when provided.
  email: 'Prashanthlucky507@gmail.com',
  social: {} as Partial<Record<'instagram' | 'linkedin' | 'facebook', string>>,
} as const;

export const PHONE = {
  display: '+91 94488 98469',
  e164: '+919448898469',
  waNumber: '919448898469',
};

export const TEL_LINK = `tel:${PHONE.e164}`;

export const WHATSAPP_MESSAGES = {
  general:
    'Hello Dr. Prashanth, I would like to enquire about physiotherapy services and a home visit in Bengaluru.',
  homeVisit:
    'Hello Dr. Prashanth, I would like to enquire about a home physiotherapy visit in Bengaluru.\nArea / locality: \nConcern: ',
  treatment:
    'Hello Dr. Prashanth, I would like to enquire about physiotherapy treatment.\nConcern: ',
} as const;

export type EnquiryIntent = keyof typeof WHATSAPP_MESSAGES;

export function whatsappLink(intent: EnquiryIntent = 'general'): string {
  return `https://wa.me/${PHONE.waNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGES[intent])}`;
}
