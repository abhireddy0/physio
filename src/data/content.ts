export type Treatment = {
  id: string;
  title: string;
  summary: string;
  conditions: string[];
  note?: string;
  icon: 'joint' | 'neuro' | 'heart';
};

export const TREATMENTS: Treatment[] = [
  {
    id: 'orthopedic',
    title: 'Orthopedic Rehabilitation',
    summary:
      'Structured rehabilitation for bone, joint, muscle and tendon problems, aimed at restoring mobility, rebuilding strength and returning you to everyday functional movement at a pace your recovery allows.',
    conditions: [
      'Fracture rehabilitation',
      'Joint arthritis',
      'Tendinitis',
      'Tendon repair rehabilitation',
      'Rotator cuff injuries',
    ],
    icon: 'joint',
  },
  {
    id: 'neurological',
    title: 'Neurological Rehabilitation',
    summary:
      'Goal focused therapy for people living with the effects of neurological conditions, working on mobility, balance, coordination and everyday activities where clinically appropriate.',
    conditions: [
      'Stroke rehabilitation',
      'Cerebrovascular accident (CVA) rehabilitation',
      'Traumatic brain injury rehabilitation',
      "Parkinson's disease rehabilitation",
    ],
    icon: 'neuro',
  },
  {
    id: 'cardiopulmonary',
    title: 'Cardiac & Pulmonary Rehabilitation',
    summary:
      'Supervised, graded rehabilitation to support recovery after cardiac or respiratory illness and hospital treatment, helping rebuild exercise tolerance, breathing efficiency and confidence in daily activity.',
    conditions: [
      'Rehabilitation following CABG surgery',
      'Ischemic heart disease rehabilitation support',
      'Rehabilitation support related to unstable angina, once medically stabilised',
      'Pulmonary rehabilitation for suitable respiratory conditions',
      'Recovery support following relevant hospital treatment',
    ],
    note:
      'Cardiac and respiratory rehabilitation begins only after assessment and clearance from your treating doctor. Acute or unstable symptoms, such as new or worsening chest pain or breathlessness, need emergency medical care, not a home visit. In an emergency in India, call 112.',
    icon: 'heart',
  },
];

export type Technique = { title: string; body: string };

export const TECHNIQUES: Technique[] = [
  {
    title: 'Dry needling',
    body:
      'Fine, sterile filament needles are inserted into specific points in muscle or soft tissue. It may be used as one part of a treatment plan for certain muscular pain and movement problems.',
  },
  {
    title: 'Kinesiology taping',
    body:
      'An elastic therapeutic tape applied to the skin to support muscles and joints during movement. It is typically combined with exercise and other treatment rather than used on its own.',
  },
  {
    title: 'Dry cupping',
    body:
      'Cups create gentle suction on the skin over soft tissue. Temporary circular marks are common afterwards. It may be included as a complementary technique for selected patients.',
  },
];

export const TECHNIQUE_NOTE =
  'Each technique is used only when your assessment suggests it is suitable for you. Responses vary from person to person, and none of these techniques is a cure on its own.';

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: 'What physiotherapy services does Dr. Prashanth provide?',
    a: 'Orthopedic rehabilitation, neurological rehabilitation, and cardiac and pulmonary rehabilitation, along with specialised techniques such as dry needling, kinesiology taping and dry cupping where they are suitable. Every plan begins with an individual assessment.',
  },
  {
    q: 'Are home physiotherapy visits available in Bengaluru?',
    a: 'Yes, you can enquire about home physiotherapy visits in Bengaluru. Whether a visit can be arranged depends on your location and on whether treatment at home is clinically suitable for your condition.',
  },
  {
    q: 'How can I enquire about an appointment?',
    a: 'Send a message on WhatsApp or call +91 94488 98469. Sending a message is an enquiry only. An appointment is confirmed once a suitable time has been agreed directly with Dr. Prashanth.',
  },
  {
    q: 'What information should I share when enquiring?',
    a: 'A brief description of the concern (for example, “knee pain after a fracture” or “recovery after a stroke”), your area in Bengaluru if you would like a home visit, and any timing preferences. There is no need to send detailed medical records in your first message; anything clinically relevant will be discussed during assessment.',
  },
  {
    q: 'Which rehabilitation services may require medical clearance?',
    a: 'Cardiac and pulmonary rehabilitation, for example after CABG surgery or with heart or lung conditions, should begin only with assessment and clearance from your treating doctor. Recent surgery, fractures and some neurological conditions may also need your doctor’s guidance first. Acute or unstable symptoms need emergency care rather than physiotherapy.',
  },
];
