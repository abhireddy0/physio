import { PROFILE, ROUTES } from '../config';

/** "PS" monogram used in the header, favicon, digital card and printed card. */
export function Monogram({ size = 40, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <svg
      className="monogram"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="11" fill={inverted ? '#ffffff' : 'var(--navy)'} />
      <path d="M11 37.5h26" stroke="var(--teal-bright)" strokeWidth="2.2" strokeLinecap="round" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontFamily="Manrope Variable, Manrope, sans-serif"
        fontWeight="700"
        fontSize="19"
        letterSpacing="0.5"
        fill={inverted ? 'var(--navy)' : '#ffffff'}
      >
        PS
      </text>
    </svg>
  );
}

export function BrandLockup({ href = ROUTES.home, light = false }: { href?: string; light?: boolean }) {
  return (
    <a className={`brand${light ? ' brand--light' : ''}`} href={href} aria-label={`${PROFILE.name}, home`}>
      <Monogram size={40} inverted={light} />
      <span className="brand__text">
        <span className="brand__name">{PROFILE.name}</span>
        <span className="brand__sub">{PROFILE.tagline}</span>
      </span>
    </a>
  );
}
