import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { Download, ExternalLink, Play, Image as ImageIcon, FileText, Check, Music, Camera, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import ResponsiveImage from '../components/ResponsiveImage';
import SEO from '../components/SEO';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  caption?: string;
  publisher?: string;
  date?: string;
  status?: string;
  linkUrl?: string;
  category?: string;
}

const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'def-media-1',
    title: 'The Architecture of Modern Cinematic Scoring: An In-Depth Interview',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    caption: 'Discussing the interplay between orchestral instrumentation, acoustic spatialization, and narrative tension with the editor-in-chief.',
    publisher: 'Gramophone & Score Magazine',
    date: 'Autumn 2024',
    category: 'Feature Interview',
    linkUrl: 'https://www.gramophone.co.uk',
  },
  {
    id: 'def-media-2',
    title: 'Bridging West African Polyphony and European Classical Tradition',
    url: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1000',
    caption: 'A deep-dive critical analysis of Michael Bakare\'s cultural synthesis in Symphonic Suite No. 1 and its implications for modern orchestra programming.',
    publisher: 'International Symphony Review',
    date: 'Summer 2024',
    category: 'Critical Essay',
    linkUrl: 'https://www.southbankcentre.co.uk',
  },
  {
    id: 'def-media-3',
    title: 'Masterclass Spotlight: Harmonic Voice Leading for Next-Generation Composers',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    caption: 'Coverage from the intensive London Masterclass series guiding emerging film composers through score engraving and live ensemble conduction.',
    publisher: 'Film Music Guild Journal',
    date: 'Spring 2024',
    category: 'Education Feature',
    linkUrl: 'https://filmmusicguild.org',
  },
  {
    id: 'def-media-4',
    title: 'BBC Radio 3 "Composer in Focus": Michael Bakare on Acoustic Space',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000',
    caption: 'A 45-minute broadcast feature examining how cathedral acoustics and room reverberation become living instruments in Bakare’s solo piano recordings.',
    publisher: 'BBC Radio 3 Broadcast',
    date: 'Winter 2023',
    category: 'Radio & Podcast',
    linkUrl: 'https://www.bbc.co.uk/radio3',
  },
  {
    id: 'def-media-5',
    title: 'The Strad: Contemporary Chamber Voices of the New Decade',
    url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=1000',
    caption: 'Profile on the commissioning of Chamber Fantasy in G Minor for string sextet and harp, celebrating its crystalline polyphony.',
    publisher: 'The Strad Review',
    date: 'Autumn 2022',
    category: 'Chamber Review',
    linkUrl: 'https://www.thestrad.com',
  },
  {
    id: 'def-media-6',
    title: 'Cinephile Quarterly: Transforming Sound into Psychological Truth',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    caption: 'An examination of the unconventional scoring techniques utilized in "The Horizon Divide"—from prepared cello scrapes to modular analog pulses.',
    publisher: 'Cinephile International',
    date: 'Summer 2022',
    category: 'Film Critique',
    linkUrl: 'https://bandcamp.com',
  },
];

const PRESS_PHOTOS = [
  {
    url: 'https://res.cloudinary.com/diiwcoarc/image/upload/v1782327076/ChatGPT_Image_Jun_24_2026_07_50_16_PM_aqbn1u.png',
    caption: 'Official Portrait — Studio Session (London)',
    resolution: '300 DPI • High-Res RGB / CMYK',
  },
  {
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
    caption: 'Concert Podium Rehearsal — Royal Festival Hall',
    resolution: '300 DPI • Concert Photography',
  },
  {
    url: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1200',
    caption: 'Solo Piano Performance — Steinway Model D',
    resolution: '300 DPI • Recital Stage',
  },
  {
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    caption: 'Scoring Stage Session — 24-piece Strings',
    resolution: '300 DPI • Abbey Road Scoring',
  },
];

export default function Media() {
  const easeCurve = [0.22, 1, 0.36, 1];
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedBio, setCopiedBio] = useState(false);

  // Subscribe to real-time updates from Admin uploads in Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'media'),
      (snapshot) => {
        const liveItems = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              title: d.title || 'Media Feature',
              url: d.url || '',
              caption: d.caption || d.description || '',
              publisher: d.publisher || d.outlet || 'Editorial Press',
              date: d.date || (d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : 'Archive'),
              status: d.status || '',
              linkUrl: d.linkUrl || d.url || '#',
              category: d.category || 'Press Feature',
            } as MediaItem;
          })
          .filter(
            (m) =>
              m.status !== 'Inactive' &&
              m.status !== 'Draft' &&
              m.status !== 'inactive' &&
              m.status !== 'draft'
          );

        if (liveItems.length > 0) {
          setMediaItems(liveItems);
        } else {
          setMediaItems(DEFAULT_MEDIA_ITEMS);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error listening to media items:', error);
        setMediaItems(DEFAULT_MEDIA_ITEMS);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const copyPressBio = () => {
    const pressBioText = `Michael Bakare is an internationally acclaimed composer, music producer, director, and concert pianist. His work encompasses expansive symphonic suites, critically praised cinematic feature film scores, and solo piano literature. Educated in classical counterpoint and orchestration, Bakare is recognized for his landmark synthesis of West African polyphonic rhythm and European classical heritage. He conducts masterclasses globally and publishes definitive scoring treatises. For booking and commissions, contact office@michaelbakare.com.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pressBioText);
      setCopiedBio(true);
      setTimeout(() => setCopiedBio(false), 2500);
    }
  };

  return (
    <div className="w-full pb-32">
      <SEO
        title="Press & Media | Michael Bakare"
        description="Explore articles, interviews, and public features documenting the work and thought leadership of Michael Bakare."
        url="/media"
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeCurve }}
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 block">
              Press, Features & Critical Reviews
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight text-ink mb-8">
              Press, publications & media archive.
            </h1>
            <p className="text-lg md:text-xl text-ink-muted mb-12 max-w-2xl leading-relaxed font-light">
              Explore critical reviews, in-depth interviews, radio broadcasts, and official press kit resources
              documenting the work of Michael Bakare.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-32">
        {isLoading ? (
          <div className="py-24 text-center text-ink-muted font-light">Loading media archive...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mediaItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: easeCurve }}
                className="group flex flex-col justify-between bg-surface rounded-3xl p-5 border border-border-subtle hover:border-ink/40 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="aspect-video bg-zinc-100 rounded-2xl overflow-hidden relative mb-5 border border-border-subtle">
                    {item.url ? (
                      <ResponsiveImage
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-ink-muted font-serif text-sm bg-zinc-100">
                        <ImageIcon size={28} className="opacity-40" />
                      </div>
                    )}

                    {item.category && (
                      <div className="absolute top-3 left-3 bg-canvas/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-border-subtle text-ink shadow-sm">
                        {item.category}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-ink-muted">
                      {item.publisher || 'Editorial'}
                    </span>
                    <span className="text-xs text-ink-muted font-mono">{item.date}</span>
                  </div>

                  <h2 className="font-serif text-2xl text-ink mb-3 group-hover:text-ink-muted transition-colors leading-snug">
                    {item.title}
                  </h2>

                  {item.caption && (
                    <p className="text-xs text-ink-muted font-light leading-relaxed mb-6 line-clamp-3">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border-subtle mt-auto">
                  <a
                    href={item.linkUrl && item.linkUrl !== '#' ? item.linkUrl : 'https://www.gramophone.co.uk'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wider font-semibold flex items-center justify-between text-ink hover:text-ink-muted transition-colors group-hover:translate-x-0.5"
                  >
                    <span>Read Article & Feature</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Curated Photography Gallery */}
      <section className="bg-surface py-28 border-y border-border-subtle mb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 block">
              Visual Archive
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-ink leading-tight">
              Selected Performance & Studio Photography
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRESS_PHOTOS.map((photo, pIdx) => (
              <div
                key={pIdx}
                className="group relative bg-canvas rounded-2xl overflow-hidden border border-border-subtle shadow-sm"
              >
                <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
                  <ResponsiveImage
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-serif text-ink font-medium leading-snug mb-1">
                    {photo.caption}
                  </p>
                  <p className="text-[10px] text-ink-muted uppercase tracking-wider font-mono">
                    {photo.resolution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Press Kit Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="bg-ink text-canvas rounded-3xl p-8 sm:p-14 border border-zinc-800">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400 block">
                Official Media Package
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-canvas">
                Official Press Kit & Curator Resources
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-base max-w-xl">
                Curated for festival directors, conductors, music journalists, and institutional presenters.
                Access approved biographical copy, 300 DPI approved portraits, concert riders, and repertoire catalogues.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={copyPressBio}
                  className="inline-flex items-center gap-2 bg-canvas text-ink px-6 py-3.5 rounded-full font-medium text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  {copiedBio ? <Check size={16} className="text-emerald-700" /> : <FileText size={16} />}
                  {copiedBio ? 'Biography Copied to Clipboard' : 'Copy Official Press Bio'}
                </button>

                <a
                  href="mailto:office@michaelbakare.com?subject=Press%20Kit%20Request%20-%20High%20Res%20Assets"
                  className="inline-flex items-center gap-2 border border-zinc-700 text-canvas px-6 py-3.5 rounded-full font-medium text-xs uppercase tracking-wider hover:border-canvas transition-colors"
                >
                  <Download size={16} />
                  Request Full High-Res ZIP
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-300 pb-2 border-b border-zinc-800">
                Package Contents
              </h3>
              <ul className="space-y-3 text-xs text-zinc-400 font-light">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  <span>Approved 100-word, 250-word, and 500-word official bios</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  <span>Print-ready 300DPI TIFF & JPG color/B&W portraits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  <span>Complete chronological repertoire & commission catalogue</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  <span>Concert grand piano specification & acoustic stage rider</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-400">
                Media inquiries: <a href="mailto:office@michaelbakare.com" className="text-zinc-200 underline">office@michaelbakare.com</a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
