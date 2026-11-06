import type { ReactNode } from 'react';
import { PHONE, TEL_LINK, whatsappLink, type EnquiryIntent } from '../config';
import { PhoneIcon, WhatsAppIcon } from './Icons';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outline-light';

export function WhatsAppButton({
  intent = 'general',
  variant = 'primary',
  children = 'Enquire on WhatsApp',
  className = '',
}: {
  intent?: EnquiryIntent;
  variant?: Variant;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`btn btn--${variant} ${className}`}
      href={whatsappLink(intent)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon />
      <span>{children}</span>
      <span className="visually-hidden"> (opens WhatsApp)</span>
    </a>
  );
}

export function CallButton({
  variant = 'secondary',
  children = 'Call Now',
  showNumber = false,
  className = '',
}: {
  variant?: Variant;
  children?: ReactNode;
  showNumber?: boolean;
  className?: string;
}) {
  return (
    <a className={`btn btn--${variant} ${className}`} href={TEL_LINK} aria-label={`Call ${PHONE.display}`}>
      <PhoneIcon />
      <span>{showNumber ? PHONE.display : children}</span>
    </a>
  );
}
