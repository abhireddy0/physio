import { PHONE, PROFILE, ROUTES, TEL_LINK, whatsappLink } from '../config';
import { FAQS, TECHNIQUE_NOTE, TECHNIQUES, TREATMENTS, type Treatment } from '../data/content';
import { BrandLockup } from '../components/Brand';
import { BrandCard } from '../components/BrandCard';
import { CallButton, WhatsAppButton } from '../components/ContactButtons';
import { Header } from '../components/Header';
import { ArrowRightIcon, ContactIcon, HeartIcon, HomeIcon, JointIcon, NeuroIcon, PhoneIcon, WhatsAppIcon } from '../components/Icons';
import { Picture } from '../components/Picture';
import { PhysioAnimation } from '../components/PhysioAnimation';
import { ReviewsSection } from '../components/ReviewsSection';

export function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Treatments />
        <Techniques />
        <HomeVisits />
        <ReviewsSection />
        <FaqSection />
        <Contact />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}

function Hero() {
  const stats = [
    { value: '4+ years', label: 'at Manipal Hospitals' },
    { value: '800+', label: 'patients treated' },
    { value: 'BPT, MPT', label: 'Musculoskeletal Sciences' },
  ];
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker">{PROFILE.name} · Physiotherapist, Bengaluru</p>
          <h1 id="hero-title" className="hero__title">
            Personalized Physiotherapy. Recovery That Moves You Forward.
          </h1>
          <p className="hero__lede">
            Professional physiotherapy and rehabilitation services in Bengaluru, with convenient home visits tailored to
            individual recovery needs.
          </p>
          <div className="btn-row">
            <WhatsAppButton intent="general" />
            <a className="btn btn--ghost" href="#treatments">
              Explore Treatments
            </a>
          </div>
          <p className="hero__note">
            <HomeIcon size={18} />
            Home visits in Bengaluru, available on enquiry
          </p>
        </div>

        <figure className="hero__media">
          <div className="framed">
            <Picture
              name="portrait"
              priority
              alt="Portrait of Dr. Prashanth S., physiotherapist, wearing a white coat and stethoscope"
              sizes="(min-width: 960px) 38vw, 92vw"
            />
          </div>
        </figure>
      </div>

      <div className="container">
        <ul className="hero__stats" aria-label="Experience and qualifications">
          {stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function About() {
  const facts = [
    { term: 'Qualifications', detail: 'Bachelor of Physiotherapy (BPT)\nMaster of Physiotherapy (MPT), Musculoskeletal Sciences' },
    { term: 'Clinical experience', detail: '4+ years at Manipal Hospitals\n800+ patients treated' },
    { term: 'Approach', detail: 'Individual assessment, functional goals, mobility and strength, patient education' },
    { term: 'Language', detail: PROFILE.languages.join(', ') },
  ];
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <figure className="about__media">
          <div className="framed framed--left">
            <Picture
              name="hospital"
              alt="Dr. Prashanth S. in navy hospital scrubs with a stethoscope, standing in a hospital corridor"
              sizes="(min-width: 960px) 36vw, 92vw"
              position="50% 30%"
            />
          </div>
        </figure>
        <div className="about__copy">
          <h2 id="about-title">About Dr. Prashanth</h2>
          <p className="lead">
            A physiotherapist with a Master of Physiotherapy in Musculoskeletal Sciences and over four years of clinical
            experience at Manipal Hospitals, where he has treated more than 800 patients.
          </p>
          <p>
            His approach is personal and practical: a careful assessment, a treatment plan shaped around your goals, and
            steady work on mobility and function, with clear guidance so you can keep progressing between sessions.
          </p>
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.term}>
                <dt>{f.term}</dt>
                <dd>{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const TREATMENT_ICONS: Record<Treatment['icon'], typeof JointIcon> = {
  joint: JointIcon,
  neuro: NeuroIcon,
  heart: HeartIcon,
};

function Treatments() {
  return (
    <section className="section treatments" id="treatments" aria-labelledby="treatments-title">
      <div className="container">
        <header className="section-head">
          <h2 id="treatments-title">Treatments &amp; rehabilitation</h2>
          <p>
            Physiotherapy in Bengaluru across three areas of care, at home where suitable. Every programme is planned
            after an individual assessment.
          </p>
        </header>

        <ul className="treatment-list">
          {TREATMENTS.map((t) => {
            const Icon = TREATMENT_ICONS[t.icon];
            return (
              <li key={t.id} id={t.id}>
                <BrandCard className="treatment">
                  <Icon size={30} className="treatment__icon" />
                  <h3>{t.title}</h3>
                  <p className="treatment__summary">{t.summary}</p>
                  <ul className="condition-list" aria-label={`${t.title} conditions`}>
                    {t.conditions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  {t.note && <p className="clinical-note">{t.note}</p>}
                </BrandCard>
              </li>
            );
          })}
        </ul>

        <p className="treatments__cta">
          Not sure which service fits your situation?{' '}
          <a href={whatsappLink('treatment')} target="_blank" rel="noopener noreferrer">
            Ask about your condition on WhatsApp
            <ArrowRightIcon size={16} />
          </a>
        </p>
      </div>
    </section>
  );
}

function Techniques() {
  return (
    <section className="section techniques" id="techniques" aria-labelledby="techniques-title">
      <div className="container techniques__grid">
        <div>
          <header className="section-head">
            <h2 id="techniques-title">Specialised techniques</h2>
            <p>{TECHNIQUE_NOTE}</p>
          </header>
          <dl className="technique-list">
            {TECHNIQUES.map((t) => (
              <div key={t.title}>
                <dt>{t.title}</dt>
                <dd>{t.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function HomeVisits() {
  const benefits = [
    'Treatment in a familiar, comfortable environment',
    'No travel when pain, surgery or limited mobility makes getting out difficult',
    'Exercises adapted to your own stairs, chairs, bed and routine',
    'Family members or caregivers can learn how to support recovery',
  ];
  const steps = [
    { t: 'Send an enquiry', d: 'Message on WhatsApp or call with a short description of the concern and your area in Bengaluru.' },
    { t: 'Discuss suitability', d: 'Dr. Prashanth will discuss whether treatment at home is appropriate and whether a visit can be arranged.' },
    { t: 'Agree a visit', d: 'If suitable, a visit time is agreed directly with you. A message alone does not confirm an appointment.' },
  ];
  return (
    <section className="section home-visits" id="home-visits" aria-labelledby="home-visits-title">
      <div className="container home-visits__grid">
        <div className="home-visits__copy">
          <div className="home-visits__eyebrow">
            <img className="home-visits__mark" src="/images/physio-mark.svg" alt="" aria-hidden="true" />
            <p className="hero__kicker hero__kicker--light">Home physiotherapy in Bengaluru</p>
          </div>
          <h2 id="home-visits-title">Professional Physiotherapy, In the Comfort of Your Home.</h2>
          <p className="home-visits__lede">
            Rehabilitation at home brings the same careful assessment and treatment to where you recover. It is especially
            useful after surgery, a fracture or a hospital stay, and for people for whom travel is difficult.
          </p>
          <ul className="benefit-list">
            {benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="btn-row">
            <WhatsAppButton intent="homeVisit" variant="light">
              Enquire about a home visit
            </WhatsAppButton>
            <CallButton variant="outline-light" />
          </div>
          <p className="home-visits__note">
            Availability depends on your location within Bengaluru and on whether treatment at home is clinically
            suitable for your condition.
          </p>
        </div>

        <div className="home-visits__side">
          <figure className="home-visits__animation">
            <PhysioAnimation />
            <figcaption>
              <span>A little movement, animated.</span>
              <a
                href="https://lottiefiles.com/free-animation/physiotherapy-01i8mPRoEi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Animation by Oğuz AKAR on LottieFiles
              </a>
            </figcaption>
          </figure>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.t}>
                <span className="steps__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <header className="section-head">
          <h2 id="faq-title">Frequently asked questions</h2>
          <p>
            Can’t find what you need?{' '}
            <a href={whatsappLink('general')} target="_blank" rel="noopener noreferrer">
              Send a message on WhatsApp
            </a>
            .
          </p>
        </header>
        <div className="faq__list">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>
                <h3>{f.q}</h3>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div>
          <h2 id="contact-title">Enquire about treatment or a home visit</h2>
          <p className="contact__lede">
            WhatsApp is the quickest way to reach Dr. Prashanth. Share a brief description of your concern and your area
            in Bengaluru. There is no need to send medical records in your first message.
          </p>
          <a className="contact__phone" href={TEL_LINK} aria-label={`Call ${PHONE.display}`}>
            {PHONE.display}
          </a>
          <div className="btn-row">
            <WhatsAppButton intent="general" variant="light" />
            <CallButton variant="outline-light" />
          </div>
        </div>

        <address className="contact__details">
          <dl>
            <div>
              <dt>Physiotherapist</dt>
              <dd>
                {PROFILE.name}
                <br />
                {PROFILE.qualificationsShort}
              </dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>
                {PROFILE.address.street},
                <br />
                {PROFILE.address.city} {PROFILE.address.postalCode}
              </dd>
            </div>
            <div>
              <dt>Home visits</dt>
              <dd>In Bengaluru on enquiry, depending on location and suitability</dd>
            </div>
            <div>
              <dt>Phone &amp; WhatsApp</dt>
              <dd>
                <a href={TEL_LINK}>{PHONE.display}</a>
              </dd>
            </div>
          </dl>
          <a className="contact__save" href={ROUTES.vcard} download="Dr-Prashanth-S.vcf">
            <ContactIcon size={18} />
            Save contact to your phone
          </a>
          <p className="contact__emergency">
            Physiotherapy is not an emergency service. For a medical emergency in India, call <a href="tel:112">112</a>.
          </p>
        </address>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <BrandLockup light href="#top" />
          <p>
            {PROFILE.title} · {PROFILE.qualificationsShort}
            <br />
            Home physiotherapy in {PROFILE.city}, {PROFILE.region}
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="site-footer__heading">Explore</h2>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#treatments">Treatments</a></li>
            <li><a href="#home-visits">Home Visits</a></li>
            <li><a href="#reviews">Patient reviews</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>
        <div>
          <h2 className="site-footer__heading">Contact</h2>
          <ul>
            <li><a href={TEL_LINK}>{PHONE.display}</a></li>
            <li><a href={whatsappLink('general')} target="_blank" rel="noopener noreferrer">WhatsApp enquiry</a></li>
            <li>
              {PROFILE.address.street},
              <br />
              {PROFILE.address.city} {PROFILE.address.postalCode}
            </li>
          </ul>
        </div>
      </div>
      <div className="container site-footer__legal">
        <p>
          The information on this website is general and educational. It does not replace an individual assessment by a
          qualified healthcare professional. Review submissions are shared privately with Dr. Prashanth and appear
          publicly only with your consent and his approval. Please do not include personal health information in a review.
        </p>
        <p suppressHydrationWarning>© {year} {PROFILE.name}</p>
      </div>
    </footer>
  );
}

/** Persistent Call / WhatsApp actions on small screens. */
function MobileActionBar() {
  return (
    <div className="action-bar" role="region" aria-label="Quick contact">
      <a href={TEL_LINK} className="action-bar__btn">
        <PhoneIcon size={20} />
        Call
      </a>
      <a href={whatsappLink('general')} target="_blank" rel="noopener noreferrer" className="action-bar__btn action-bar__btn--wa">
        <WhatsAppIcon size={20} />
        WhatsApp
        <span className="visually-hidden"> (opens WhatsApp)</span>
      </a>
    </div>
  );
}
