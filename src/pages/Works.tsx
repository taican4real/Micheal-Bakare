import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Search, ArrowUpRight, Music } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { PortfolioWork } from '../types';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';

const DEFAULT_WORKS: PortfolioWork[] = [
  {
    id: 'symphonic-suite-1',
    title: 'Symphonic Suite No. 1: Celestial Echoes',
    category: 'Compositions',
    role: 'Composer & Orchestrator',
    year: '2024',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
    description: 'An expansive six-movement orchestral suite exploring modal harmony and acoustic spatialization. Premiered at Royal Festival Hall.',
    collaborators: 'London Philharmonic Ensemble',
    gallery: [],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioMetadata: 'Orchestral Suite, 42 min',
    audioStreamUrl: '/audio/celestial-echoes-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Symphonic Suite No. 1',
    seoDescription: 'Composition by Michael Bakare',
    status: 'published',
  },
  {
    id: 'the-horizon-divide',
    title: 'Original Motion Picture Score: The Horizon Divide',
    category: 'Film Scores',
    role: 'Music Producer & Director',
    year: '2023',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    description: 'A textured hybrid score blending live string quartet with modular synthesis and choir for the feature thriller.',
    collaborators: 'Horizon Pictures & Studio Soundworks',
    gallery: [],
    videoUrl: '',
    audioMetadata: 'Feature Film OST, 68 min',
    audioStreamUrl: '/audio/horizon-divide-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'The Horizon Divide Score',
    seoDescription: 'Film score by Michael Bakare',
    status: 'published',
  },
  {
    id: 'nocturnes-solo-piano',
    title: 'Nocturnes for Solo Grand Piano',
    category: 'Solo Piano',
    role: 'Pianist & Arranger',
    year: '2022',
    coverImageUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1000',
    description: 'A collection of twelve contemplative piano pieces recorded in an intimate cathedral acoustic on a 1928 Steinway Model D.',
    collaborators: 'Recorded solo in Wiltshire',
    gallery: [],
    videoUrl: '',
    audioMetadata: 'Solo Grand Piano, 52 min',
    audioStreamUrl: '/audio/nocturnes-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Nocturnes for Solo Grand Piano',
    seoDescription: 'Piano works by Michael Bakare',
    status: 'published',
  },
  {
    id: 'chamber-fantasy-g-minor',
    title: 'Chamber Fantasy in G Minor',
    category: 'Chamber Works',
    role: 'Composer',
    year: '2021',
    coverImageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000',
    description: 'Written for string sextet and concert harp, exploring polyphonic counterpoint, shifting meters, and emotional tension.',
    collaborators: 'Aura String Sextet',
    gallery: [],
    videoUrl: '',
    audioMetadata: 'String Sextet & Harp, 26 min',
    audioStreamUrl: '/audio/chamber-fantasy-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Chamber Fantasy in G Minor',
    seoDescription: 'Chamber work by Michael Bakare',
    status: 'published',
  },
  {
    id: 'voices-of-the-dawn',
    title: 'Voices of the Dawn: Choral Ode',
    category: 'Choral',
    role: 'Choral Director & Composer',
    year: '2020',
    coverImageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=1000',
    description: 'A choral celebration of morning light, renewal, and ancestral resilience. Commissioned for the annual Solstice Festival.',
    collaborators: 'St. Michael Choir of the West',
    gallery: [],
    videoUrl: '',
    audioMetadata: 'Double Choir & Pipe Organ, 34 min',
    audioStreamUrl: '/audio/voices-of-dawn-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Voices of the Dawn',
    seoDescription: 'Choral composition by Michael Bakare',
    status: 'published',
  },
  {
    id: 'contemporary-ballet-suite',
    title: 'Kinetic Resonance: Contemporary Ballet Suite',
    category: 'Theater & Dance',
    role: 'Composer & Musical Director',
    year: '2019',
    coverImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1000',
    description: 'Pulse-driven modern dance suite performed across European contemporary dance stages with prepared percussion and cello.',
    collaborators: 'Avant Dance Theater',
    gallery: [],
    videoUrl: '',
    audioMetadata: 'Ballet Score, 55 min',
    audioStreamUrl: '/audio/kinetic-resonance-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Kinetic Resonance Ballet Suite',
    seoDescription: 'Ballet score by Michael Bakare',
    status: 'published',
  },
  {
    id: 'yoruba-rhapsody-orchestra',
    title: 'Rhapsody on Yoruba Themes for Symphony Orchestra',
    category: 'Compositions',
    role: 'Composer & Arranger',
    year: '2018',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    description: 'A landmark cross-cultural orchestral tour de force fusing the polyrhythmic language of Yoruba Bata drumming with full symphony orchestra.',
    collaborators: 'National Youth Symphony & Master Drummers of Ibadan',
    gallery: [],
    videoUrl: '',
    audioMetadata: 'Symphonic Rhapsody, 21 min',
    audioStreamUrl: '/audio/celestial-echoes-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Rhapsody on Yoruba Themes',
    seoDescription: 'Orchestral rhapsody by Michael Bakare',
    status: 'published',
  },
  {
    id: 'solitude-ambient-studies',
    title: 'Studies in Solitude: Modular Synthesis & Prepared Piano',
    category: 'Productions',
    role: 'Sound Designer, Producer & Pianist',
    year: '2017',
    coverImageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    description: 'An experimental ambient suite documenting late-night recording experiments with tape loops, rubber-muted piano strings, and Eurorack modular oscillators.',
    collaborators: 'Abbey Road Spatial Audio Labs',
    gallery: [],
    videoUrl: '',
    audioMetadata: '8 Ambient Studies, 46 min',
    audioStreamUrl: '/audio/horizon-divide-preview.wav',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Studies in Solitude',
    seoDescription: 'Ambient production by Michael Bakare',
    status: 'published',
  },
];

export default function Works() {
  const easeCurve = [0.22, 1, 0.36, 1];

  const [items, setItems] = useState<PortfolioWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  // Subscribe to real-time updates from Admin uploads in Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'portfolio'),
      (snapshot) => {
        const liveWorks = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            const statusStr = String(d.status || '').toLowerCase();
            return {
              id: doc.id,
              title: d.title || 'Untitled Work',
              description: d.description || '',
              year: d.year || '',
              category: d.category || d.type || 'Compositions',
              role: d.role || '',
              collaborators: d.collaborators || '',
              coverImageUrl: d.coverImageUrl || d.featuredImageUrl || d.imageUrl || '',
              gallery: d.gallery || [],
              videoUrl: d.videoUrl || '',
              audioMetadata: d.audioMetadata || '',
              audioStreamUrl: d.audioStreamUrl || '/audio/celestial-echoes-preview.wav',
              externalLinks: d.externalLinks || [],
              relatedWorks: d.relatedWorks || [],
              seoTitle: d.seoTitle || '',
              seoDescription: d.seoDescription || '',
              status: (statusStr === 'draft' ? 'draft' : 'published') as 'published' | 'draft',
            } as PortfolioWork;
          })
          .filter((w) => w.status !== 'draft');

        // Sort by year descending locally
        liveWorks.sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));

        if (liveWorks.length > 0) {
          setItems(liveWorks);
        } else {
          setItems(DEFAULT_WORKS);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching live works:', error);
        setItems(DEFAULT_WORKS);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Compute unique categories and counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    items.forEach((item) => {
      const cat = item.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [items]);

  const availableCategories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category || 'Other'))).filter(Boolean);
    return ['All', ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeFilter === 'All' || item.category === activeFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        (item.collaborators && item.collaborators.toLowerCase().includes(searchLower)) ||
        (item.role && item.role.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });
  }, [items, activeFilter, searchQuery]);

  const handlePlayAudio = (e: React.MouseEvent, item: PortfolioWork) => {
    e.preventDefault();
    e.stopPropagation();
    const stream = item.audioStreamUrl || '/audio/celestial-echoes-preview.wav';
    playTrack({
      title: item.title,
      artist: item.role || 'Michael Bakare',
      url: stream,
      coverUrl: item.coverImageUrl,
    });
  };

  return (
    <div className="w-full pb-32">
      <SEO
        title="Works & Portfolio | Michael Bakare"
        description="Explore the comprehensive catalogue of original works, professional projects, manuscripts, and collaborations by Michael Bakare."
        url="/works"
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeCurve }}
            className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-ink mb-8"
          >
            Archive & Catalogue.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeCurve }}
            className="text-lg md:text-xl text-ink-muted mb-12 max-w-2xl leading-relaxed font-light"
          >
            A definitive index of commissioned concert pieces, cinematic motion picture scores, solo piano
            manuscripts, and cross-disciplinary productions.
          </motion.p>
        </div>
      </section>

      {/* Controls & Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border-subtle">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableCategories.map((category) => {
              const count = categoryCounts[category] || 0;
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-ink text-canvas shadow-sm'
                      : 'bg-surface text-ink-muted hover:text-ink hover:bg-zinc-100 border border-border-subtle'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] opacity-75 font-mono ${isActive ? 'text-canvas' : 'text-ink-muted'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search works, keywords..."
              className="w-full bg-surface border border-border-subtle rounded-full pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-ink transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-zinc-200 aspect-[4/3] rounded-2xl mb-6"></div>
                <div className="h-6 bg-zinc-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-border-subtle rounded-2xl bg-canvas">
            <h3 className="font-serif text-2xl mb-4 text-ink">No works found</h3>
            <p className="text-ink-muted font-light mb-6">
              There are currently no catalog items matching your filter criteria.
            </p>
            {(activeFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setActiveFilter('All');
                  setSearchQuery('');
                }}
                className="text-xs uppercase tracking-widest font-semibold pb-1 border-b border-ink text-ink hover:text-ink-muted transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const streamUrl = item.audioStreamUrl || '/audio/celestial-echoes-preview.wav';
                const isThisPlaying = currentTrack?.url === streamUrl && isPlaying;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, delay: (index % 6) * 0.06, ease: easeCurve }}
                    className="group flex flex-col justify-between bg-surface rounded-3xl p-4 border border-border-subtle hover:border-ink/40 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Cover Thumbnail with Audio Play Button Overlay */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 mb-5 border border-border-subtle">
                        {item.coverImageUrl ? (
                          <ResponsiveImage
                            loading="lazy"
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted font-serif text-sm bg-gradient-to-br from-zinc-100 to-zinc-200">
                            <Music size={24} className="opacity-40 mb-2" />
                            <span>{item.title}</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Year Badge */}
                        {item.year && (
                          <div className="absolute top-3 left-3 bg-canvas/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-border-subtle text-ink shadow-sm">
                            {item.year}
                          </div>
                        )}

                        {/* Quick Audition Play Button */}
                        <button
                          onClick={(e) => handlePlayAudio(e, item)}
                          className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 z-20 ${
                            isThisPlaying ? 'bg-ink text-canvas ring-2 ring-white' : 'bg-canvas text-ink opacity-90 group-hover:opacity-100'
                          }`}
                          aria-label={isThisPlaying ? `Pause ${item.title}` : `Play excerpt of ${item.title}`}
                        >
                          {isThisPlaying ? (
                            <Pause size={18} fill="currentColor" />
                          ) : (
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Header & Category */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] uppercase tracking-widest font-semibold text-ink-muted">
                          {item.category}
                        </span>
                        {item.audioMetadata && (
                          <span className="text-[10px] text-ink-muted font-mono truncate max-w-[120px]">
                            {item.audioMetadata}
                          </span>
                        )}
                      </div>

                      <Link to={`/works/${item.id}`} className="block group-hover:underline">
                        <h2 className="font-serif text-2xl text-ink leading-snug mb-3">
                          {item.title}
                        </h2>
                      </Link>

                      {item.description && (
                        <p className="text-xs text-ink-muted font-light leading-relaxed line-clamp-2 mb-4">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Metadata & Link */}
                    <div className="pt-4 border-t border-border-subtle flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-ink-muted font-light truncate pr-2">
                        {item.role || 'Composer'}
                        {item.collaborators ? ` • ${item.collaborators}` : ''}
                      </span>
                      <Link
                        to={`/works/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-ink hover:text-ink-muted transition-colors flex-shrink-0"
                      >
                        Explore <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}
