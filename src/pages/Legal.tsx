import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { ArrowLeft, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

export default function Legal() {
  const { type = 'terms' } = useParams<{ type: string }>();
  const easeCurve = [0.22, 1, 0.36, 1];

  const legalContent: Record<string, { title: string; subtitle: string; icon: any; sections: { heading: string; text: string }[] }> = {
    terms: {
      title: 'Terms of Service',
      subtitle: 'Guidelines governing the purchase of digital publications, scores, and professional commissions.',
      icon: FileText,
      sections: [
        {
          heading: '1. Intellectual Property & Digital Products',
          text: 'All compositions, musical manuscripts, digital sheet music, video masterclasses, audio stems, and literary publications available on this platform are the intellectual property of Michael Bakare and protected by international copyright laws. Purchase of a digital product grants a personal, non-exclusive, non-transferable license for personal study or designated synchronization, and does not convey master publishing rights unless explicitly executed via written commercial contract.',
        },
        {
          heading: '2. Commercial Sync & Derivative Works',
          text: 'Digital sample libraries and stems labeled "Royalty-Free" permit integration into commercial musical releases, film cues, and broadcast media. However, reselling, re-distributing, or sub-licensing the isolated audio samples or MIDI data as standalone sound libraries is strictly prohibited.',
        },
        {
          heading: '3. Professional Commissions & Quotations',
          text: 'Inquiries submitted via the Request-a-Quote portal constitute non-binding expressions of interest. Formal contractual engagements for film scoring, orchestral arranging, and masterclasses require execution of a separate Master Service Agreement (MSA) and initial deposit.',
        },
        {
          heading: '4. Payment Processing',
          text: 'All digital store transactions are securely processed through authorized global gateways including Selar, accepting major credit cards, bank transfers, and local currencies. We do not store sensitive payment card details on our servers.',
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Our commitment to protecting your personal data, project briefs, and communications.',
      icon: ShieldCheck,
      sections: [
        {
          heading: '1. Information We Collect',
          text: 'We collect contact information (such as name, email address, and organization) when you submit a proposal request, register for the newsletter, or complete a store transaction. Project brief documents uploaded via our quoting portal are treated with the highest level of confidentiality.',
        },
        {
          heading: '2. Use of Information',
          text: 'Your information is used strictly to fulfill store orders, transmit secure digital download links, evaluate commission inquiries, and provide periodic newsletter insights if you have opted in. We never sell, rent, or trade personal data to third parties.',
        },
        {
          heading: '3. Data Security & Encryption',
          text: 'All transmissions across this platform are encrypted via 256-bit SSL protocols. Database storage is governed by enterprise-grade Zero-Trust Firestore Security Rules preventing unauthorized public reading or scraping of personal inquiry data.',
        },
        {
          heading: '4. Your Rights (GDPR & International)',
          text: 'You maintain the right to request access to, correction of, or permanent deletion of your personal records from our database by contacting office@michaelbakare.com.',
        },
      ],
    },
    refunds: {
      title: 'Digital Fulfillment & Refund Policy',
      subtitle: 'Clear terms regarding digital downloads, instant fulfillment, and service deposits.',
      icon: RefreshCw,
      sections: [
        {
          heading: '1. Digital Goods Policy',
          text: 'Due to the immediate digital delivery and non-returnable nature of downloaded sheet music, eBooks, audio stems, and masterclass video courses, digital product purchases are generally non-refundable once the encrypted download link has been accessed.',
        },
        {
          heading: '2. Damaged or Corrupt Downloads',
          text: 'If a downloaded file is corrupted or technically defective, our support team will provide replacement download links or technical assistance within 24 hours of notification to office@michaelbakare.com.',
        },
        {
          heading: '3. Professional Service Retainers',
          text: 'Retainers and milestone deposits for bespoke scoring or arranging commissions are governed by the project-specific Master Service Agreement. Deposits cover committed studio hours and scoring stage allocations and are non-refundable once production commences.',
        },
      ],
    },
  };

  const activeDoc = legalContent[type] || legalContent['terms'];
  const IconComponent = activeDoc.icon;

  return (
    <div className="w-full pb-32">
      <SEO
        title={`${activeDoc.title} | Michael Bakare`}
        description={activeDoc.subtitle}
        url={`/legal/${type}`}
      />

      <section className="max-w-4xl mx-auto px-6 sm:px-12 pt-32 pb-16 md:pt-48 md:pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-ink-muted hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Return to Home
        </Link>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1.5 bg-surface border border-border-subtle rounded-full mb-12 w-fit">
          <Link
            to="/legal/terms"
            className={`text-xs uppercase tracking-wider font-semibold px-5 py-2 rounded-full transition-colors ${
              type === 'terms' ? 'bg-ink text-canvas shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Terms of Service
          </Link>
          <Link
            to="/legal/privacy"
            className={`text-xs uppercase tracking-wider font-semibold px-5 py-2 rounded-full transition-colors ${
              type === 'privacy' ? 'bg-ink text-canvas shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/legal/refunds"
            className={`text-xs uppercase tracking-wider font-semibold px-5 py-2 rounded-full transition-colors ${
              type === 'refunds' ? 'bg-ink text-canvas shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Refund Policy
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-ink">
              <IconComponent size={20} />
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted">
              Legal Documentation
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink leading-tight mb-4">
            {activeDoc.title}
          </h1>
          <p className="text-lg text-ink-muted font-light leading-relaxed mb-12 pb-8 border-b border-border-subtle">
            {activeDoc.subtitle}
          </p>

          <div className="space-y-12">
            {activeDoc.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="font-serif text-2xl text-ink font-medium">{sec.heading}</h2>
                <p className="text-ink-muted font-light leading-relaxed text-base md:text-lg">
                  {sec.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border-subtle text-xs text-ink-muted font-light">
            Last Updated: September 2026. For inquiries regarding contracts or legal licensing, email{' '}
            <a href="mailto:office@michaelbakare.com" className="text-ink underline">
              office@michaelbakare.com
            </a>
            .
          </div>
        </motion.div>
      </section>
    </div>
  );
}
