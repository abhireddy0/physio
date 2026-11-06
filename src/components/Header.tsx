import { useEffect, useState } from 'react';
import { PHONE, TEL_LINK, whatsappLink } from '../config';
import { BrandLockup } from './Brand';
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from './Icons';

const NAV = [
  { href: '#top', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#treatments', label: 'Treatments' },
  { href: '#home-visits', label: 'Home Visits' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.body.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled || open ? ' is-raised' : ''}`}>
      <div className="container site-header__inner">
        <BrandLockup href="#top" />

        <nav className="site-nav" aria-label="Main">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="header-call" href={TEL_LINK} aria-label={`Call ${PHONE.display}`}>
            <PhoneIcon size={18} />
            <span>{PHONE.display}</span>
          </a>
          <a className="btn btn--primary btn--sm header-cta" href={whatsappLink('homeVisit')} target="_blank" rel="noopener noreferrer">
            Book a Home Visit
            <span className="visually-hidden"> (opens WhatsApp)</span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__actions">
          <a className="btn btn--primary btn--block" href={whatsappLink('homeVisit')} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Book a Home Visit
            <span className="visually-hidden"> (opens WhatsApp)</span>
          </a>
          <a className="btn btn--secondary btn--block" href={TEL_LINK}>
            <PhoneIcon />
            Call {PHONE.display}
          </a>
        </div>
      </div>
    </header>
  );
}
