import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Service } from '../types';
import ResponsiveImage from '../components/ResponsiveImage';
import { ChevronDown, ArrowRight, CheckCircle2, HelpCircle, FileText, Sparkles } from 'lucide-react';

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'film-media-scoring',
    title: 'Film & Media Scoring',
    category: 'Composition',
    description:
      'Original thematic compositions and bespoke cinematic scores for feature films, episodic television, documentaries, and high-impact media productions. From solo intimate piano leitmotifs to expansive 80-piece orchestral arrangements recorded on historic European scoring stages.',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    deliverables: [
      'Original thematic composition & character leitmotifs',
      'Full orchestral arrangement, engraving & score printing',
      'Hybrid electronic sound design & analog synth programming',
      'Delivery of 5.1 / 7.1.4 Dolby Atmos mixed stems for final re-recording dub',
      'Complete cue sheets and international PRO registration data',
    ],
    requirements: [
      'Locked picture or work-in-progress rough cut with timecode',
      'Director spotting session & creative tone references',
      'Agreed delivery schedule aligned with dubbing stage dates',
    ],
    faqs: [
      {
        question: 'What is the standard turnaround time for a feature film score?',
        answer: 'Typical feature film scoring schedules range from 6 to 10 weeks from picture lock to final dub delivery. Expedited schedules for festivals or urgent releases can be accommodated upon request.',
      },
      {
        question: 'Do you provide live orchestra recording sessions?',
        answer: 'Yes. We coordinate complete recording sessions with top-tier European symphony orchestras and chamber ensembles, managing contractor bookings, conductor duties, and studio logistics.',
      },
      {
        question: 'How are publishing and master rights structured?',
        answer: 'Scoring agreements are tailored to the production model (Work-for-Hire or co-publishing structures), ensuring full commercial synchronization clearances for worldwide theatrical and streaming distribution.',
      },
    ],
    seoTitle: 'Film & Media Scoring Services | Michael Bakare',
    seoDescription: 'Bespoke cinematic scoring and thematic composition by Michael Bakare.',
    status: 'active',
  },
  {
    id: 'orchestral-arranging-direction',
    title: 'Orchestral Arranging & Musical Direction',
    category: 'Arranging & Direction',
    description:
      'Transformative arrangement and baton direction for live symphony orchestras, studio recording sessions, and prestigious theatrical productions. Every score is meticulously prepared with industry-standard Dorico and Sibelius engraving.',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    deliverables: [
      'Complete master conductor scores and engraved player parts (A3/A4 formats)',
      'Live ensemble rehearsal supervision & podium direction',
      'Orchestral adaptations of contemporary songs, albums, and theater works',
      'Acoustic space calibration & balance consulting for live concert halls',
    ],
    requirements: [
      'Original audio demo, MIDI mockups, or lead sheets',
      'Target instrumentation roster (e.g. 50-piece symphony, chamber strings, or brass choir)',
      'Performance or recording session dates and venue acoustic specifications',
    ],
    faqs: [
      {
        question: 'Can you arrange modern commercial songs for symphony orchestra?',
        answer: 'Yes. We specialize in sophisticated orchestral adaptations that honor the spirit of modern pop, jazz, or electronic compositions while maximizing the timbral palette of live symphonic players.',
      },
      {
        question: 'Are parts formatted and ready for immediate printing?',
        answer: 'All scores and individual instrumental parts are engraved to strict professional publishing standards, including rehearsal letters, page turns, cue notes, and dynamic markings.',
      },
    ],
    seoTitle: 'Orchestral Arranging & Musical Direction | Michael Bakare',
    seoDescription: 'Professional orchestral arrangement and podium direction by Michael Bakare.',
    status: 'active',
  },
  {
    id: 'masterclasses-creative-consulting',
    title: 'Masterclasses & Institutional Lectures',
    category: 'Academic & Mentorship',
    description:
      'Exclusive masterclasses, conservatory residencies, and strategic creative workshops for universities, educational institutions, and emerging professionals seeking mastery in harmonic voice leading, score architecture, and music industry strategy.',
    coverImageUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1000',
    deliverables: [
      'Intensive multi-day masterclass curricula with interactive workshops',
      'Direct harmonic, thematic, and structural portfolio critiques for participants',
      'Live masterclass lectures with live grand piano demonstrations',
      'Digital reference workbooks, score excerpts, and resource documentation',
    ],
    requirements: [
      'Auditorium or lecture hall with acoustic grand piano and AV projection',
      'Participant enrollment list and prior submitted score portfolios for review',
    ],
    faqs: [
      {
        question: 'Can masterclasses be conducted remotely via high-definition video?',
        answer: 'Yes. We offer interactive virtual masterclasses equipped with dual-camera piano feeds and multi-channel high-fidelity audio streams for global institutions.',
      },
      {
        question: 'What skill level is recommended for workshop participants?',
        answer: 'Curricula are tailored for university undergraduate, postgraduate, and early-career professional composers and producers.',
      },
    ],
    seoTitle: 'Masterclasses & Academic Lectures | Michael Bakare',
    seoDescription: 'Masterclasses in harmonic architecture and composition by Michael Bakare.',
    status: 'active',
  },
  {
    id: 'executive-sound-direction',
    title: 'Executive Audio Branding & Sound Architecture',
    category: 'Creative Direction',
    description:
      'Holistic sonic identity development for global luxury brands, architectural spaces, interactive digital platforms, and private commissions. Crafting an unmistakable acoustic aesthetic that resonates across all sensory touchpoints.',
    coverImageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    deliverables: [
      'Comprehensive Sonic Brand Identity Guidelines and audio stylebooks',
      'Custom acoustic mnemonic logos, signature motifs, and spatial soundscapes',
      'Acoustic environment design for flagship spaces and galleries',
      'Master file packages calibrated for digital, broadcast, and experiential media',
    ],
    requirements: [
      'Brand strategy brief and architectural floorplans / user experience maps',
      'Target demographic profiles and acoustic environmental constraints',
    ],
    faqs: [
      {
        question: 'What is sonic architecture for spaces?',
        answer: 'We design bespoke background acoustic environments and spatialized sonic layers that adapt to time of day, pedestrian traffic, and interior design to create an elevated brand atmosphere.',
      },
    ],
    seoTitle: 'Executive Audio Branding & Direction | Michael Bakare',
    seoDescription: 'Sonic identity and spatial audio architecture by Michael Bakare.',
    status: 'active',
  },
];

export default function Services() {
  const easeCurve = [0.22, 1, 0.36, 1];
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  // Subscribe to real-time updates from Admin uploads in Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        const liveServices = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            const statusStr = String(d.status || '').toLowerCase();
            return {
              id: doc.id,
              title: d.title || '',
              description: d.description || '',
              category: d.category || 'Consulting',
              coverImageUrl: d.coverImageUrl || '',
              deliverables: d.deliverables || [],
              requirements: d.requirements || [],
              faqs: d.faqs || [],
              seoTitle: d.seoTitle || '',
              seoDescription: d.seoDescription || '',
              status: (statusStr === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
            } as Service;
          })
          .filter((s) => s.status === 'active');

        if (liveServices.length > 0) {
          setServices(liveServices);
        } else {
          setServices(DEFAULT_SERVICES);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching live services:', error);
        setServices(DEFAULT_SERVICES);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const toggleFaq = (key: string) => {
    setExpandedFaqs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full pb-32">
      <SEO
        title="Professional Services | Michael Bakare"
        description="Engage Michael Bakare for professional services including film scoring, orchestral arranging, masterclasses, and executive sonic direction."
        url="/services"
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeCurve }}
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 block">
              Professional Engagements
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight text-ink mb-8">
              Bespoke musical direction & commissions.
            </h1>
            <p className="text-lg md:text-xl text-ink-muted mb-12 max-w-2xl leading-relaxed font-light">
              A disciplined, high-touch approach to musical composition, orchestral direction, and executive
              sound design. Review our core service offerings and initiate a confidential consultation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-32">
        <div className="border-t border-border-subtle">
          {isLoading ? (
            <div className="py-32 text-center text-ink-muted font-light">Loading services catalogue...</div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: easeCurve }}
                className="grid md:grid-cols-12 gap-8 py-20 border-b border-border-subtle items-start"
              >
                {/* Column 1: Number, Category, Title, Image */}
                <div className="md:col-span-4">
                  <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-3 block">
                    0{index + 1} &mdash; {service.category}
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
                    {service.title}
                  </h2>
                  {service.coverImageUrl && (
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 hidden md:block border border-border-subtle shadow-sm">
                      <ResponsiveImage
                        loading="lazy"
                        src={service.coverImageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Column 2: Description, Deliverables, Requirements, FAQs */}
                <div className="md:col-span-8 md:pl-8 lg:pl-16">
                  {service.coverImageUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 mb-8 md:hidden border border-border-subtle shadow-sm">
                      <ResponsiveImage
                        loading="lazy"
                        src={service.coverImageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="prose prose-zinc max-w-2xl font-light leading-relaxed text-ink-muted mb-10 text-base md:text-lg">
                    {service.description ? (
                      service.description.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))
                    ) : null}
                  </div>

                  {/* Core Deliverables */}
                  {service.deliverables && service.deliverables.length > 0 && (
                    <div className="mb-10 bg-surface/70 border border-border-subtle p-6 sm:p-8 rounded-2xl">
                      <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-ink" />
                        Core Deliverables
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-3.5">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex gap-2.5 text-ink-muted font-light text-sm leading-relaxed">
                            <span className="text-ink font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Project Prerequisites */}
                  {service.requirements && service.requirements.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-3 flex items-center gap-2">
                        <FileText size={14} className="text-ink-muted" />
                        Client Prerequisites & Input
                      </h3>
                      <ul className="space-y-2">
                        {service.requirements.map((req, idx) => (
                          <li key={idx} className="text-xs text-ink-muted font-light flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Service Specific FAQs */}
                  {service.faqs && service.faqs.length > 0 && (
                    <div className="mb-10 border-t border-border-subtle pt-6">
                      <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 flex items-center gap-2">
                        <HelpCircle size={14} className="text-ink-muted" />
                        Frequently Asked Questions
                      </h3>
                      <div className="space-y-3">
                        {service.faqs.map((faq, fIdx) => {
                          const key = `${service.id}-${fIdx}`;
                          const isExpanded = expandedFaqs[key];
                          return (
                            <div key={fIdx} className="border border-border-subtle rounded-xl overflow-hidden bg-surface">
                              <button
                                onClick={() => toggleFaq(key)}
                                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
                              >
                                <span className="font-serif text-sm md:text-base text-ink font-medium">
                                  {faq.question}
                                </span>
                                <ChevronDown
                                  size={16}
                                  className={`text-ink-muted transition-transform duration-300 flex-shrink-0 ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-4 pb-4 text-xs md:text-sm text-ink-muted font-light leading-relaxed border-t border-border-subtle bg-white"
                                  >
                                    <p className="pt-3">{faq.answer}</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border-subtle">
                    <button
                      onClick={() =>
                        navigate('/contact', { state: { selectedService: service.title } })
                      }
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold bg-ink text-canvas px-7 py-4 rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      Request a Proposal
                      <ArrowRight size={14} />
                    </button>
                    <Link
                      to="/works"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-ink border border-border-subtle px-6 py-4 rounded-full hover:border-ink transition-colors"
                    >
                      View Related Repertoire
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Engagement Process */}
      <section className="bg-ink text-canvas py-32 rounded-3xl mx-4 sm:mx-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mb-24">
            <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-4 block">
              Methodology & Workflow
            </span>
            <h3 className="font-serif text-3xl md:text-5xl leading-tight">
              The Commissioning & Production Pipeline
            </h3>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <StaggerItem className="border-t border-zinc-800 pt-8">
              <span className="font-serif text-4xl text-zinc-600 block mb-6">I.</span>
              <h4 className="text-xl font-medium mb-3 text-canvas">Discovery & Spotting</h4>
              <p className="text-zinc-400 font-light leading-relaxed text-sm">
                We review your creative brief, screen rough cuts, or discuss institutional parameters.
                We establish emotional tone, tempo maps, and delivery timelines before providing a formal quotation.
              </p>
            </StaggerItem>
            <StaggerItem className="border-t border-zinc-800 pt-8">
              <span className="font-serif text-4xl text-zinc-600 block mb-6">II.</span>
              <h4 className="text-xl font-medium mb-3 text-canvas">Harmonic Architecture & Mockups</h4>
              <p className="text-zinc-400 font-light leading-relaxed text-sm">
                Primary thematic motifs are composed on the grand piano and developed into high-fidelity MIDI mockups,
                giving you a visceral, exact preview of the composition prior to live orchestrations.
              </p>
            </StaggerItem>
            <StaggerItem className="border-t border-zinc-800 pt-8">
              <span className="font-serif text-4xl text-zinc-600 block mb-6">III.</span>
              <h4 className="text-xl font-medium mb-3 text-canvas">Live Recording & Master Delivery</h4>
              <p className="text-zinc-400 font-light leading-relaxed text-sm">
                Ensemble recording sessions take place on acoustic scoring stages with engraved parts. Audio is mixed,
                mastered in surround/Atmos formats, and delivered with full sync clearances.
              </p>
            </StaggerItem>
          </StaggerContainer>

          <div className="mt-20 pt-12 border-t border-zinc-800 text-center">
            <p className="text-zinc-400 text-sm font-light mb-6">
              Ready to discuss an upcoming commission or scoring engagement?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-canvas text-ink px-8 py-4 rounded-full font-medium text-sm hover:bg-zinc-200 transition-colors"
            >
              Start Your Inquiry
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
