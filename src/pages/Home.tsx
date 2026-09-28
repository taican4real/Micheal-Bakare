import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { ArrowRight, ArrowUpRight, Library, ChevronLeft, ChevronRight, Play, Pause, Music, Disc } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioWork as Work } from '../types';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface TestimonialItem {
  id?: string;
  quote: string;
  author: string;
  role: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Michael's ability to translate complex emotional landscapes into sonic architectures is unparalleled. A true visionary.",
    author: "Dame Sarah Jenkins",
    role: "Music Director & Guest Conductor, London Philharmonic",
  },
  {
    quote: "Working with Michael elevated our entire cinematic production. His score brought a haunting, unforgettable dimension to The Horizon Divide.",
    author: "Marcus Vance",
    role: "BAFTA-winning Film Director & Producer",
  },
  {
    quote: "An exceptional talent who understands the delicate balance between technical mastery and profound artistic expression.",
    author: "Elena Rostova",
    role: "Principal Guest Soloist, Royal Symphony",
  },
  {
    quote: "The masterclasses conducted by Michael Bakare transformed our conservatory students' understanding of score architecture and voice leading.",
    author: "Dr. Julian Thorne",
    role: "Head of Contemporary Composition, Guildhall School of Music",
  },
];

const DEFAULT_FEATURED_WORKS: Work[] = [
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
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Symphonic Suite No. 1',
    seoDescription: 'Orchestral composition by Michael Bakare',
    status: 'published',
  },
  {
    id: 'the-horizon-divide',
    title: 'Original Motion Picture Score: The Horizon Divide',
    category: 'Film Scores',
    role: 'Music Producer & Director',
    year: '2023',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    description: 'A textured hybrid score blending live string quartet with modular synthesis and choir for the feature psychological thriller.',
    collaborators: 'Horizon Studios & Soundworks',
    gallery: [],
    videoUrl: '',
    audioMetadata: 'Hybrid Film Score, 68 min',
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
    externalLinks: [],
    relatedWorks: [],
    seoTitle: 'Nocturnes for Solo Grand Piano',
    seoDescription: 'Piano works by Michael Bakare',
    status: 'published',
  },
];

export default function Home() {
  const easeCurve = [0.22, 1, 0.36, 1];
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  const [featuredWorks, setFeaturedWorks] = useState<Work[]>([]);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Subscribe in real-time to both Testimonials and Portfolio uploads
  useEffect(() => {
    // 1. Live Testimonials listener
    const unsubTestimonials = onSnapshot(
      collection(db, 'testimonials'),
      (snapshot) => {
        const liveItems = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              quote: d.quote || d.text || '',
              author: d.author || d.name || 'Collaborator',
              role: d.company || d.role || d.position || '',
              status: d.status || '',
            };
          })
          .filter(
            (t) =>
              t.quote &&
              t.status !== 'Inactive' &&
              t.status !== 'Draft' &&
              t.status !== 'inactive' &&
              t.status !== 'draft'
          );

        if (liveItems.length > 0) {
          setTestimonials(liveItems);
        } else {
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      },
      (error) => {
        console.error('Error fetching live testimonials:', error);
      }
    );

    // 2. Live Portfolio / Works listener
    const unsubPortfolio = onSnapshot(
      collection(db, 'portfolio'),
      (snapshot) => {
        const data = snapshot.docs
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
              externalLinks: d.externalLinks || [],
              relatedWorks: d.relatedWorks || [],
              seoTitle: d.seoTitle || '',
              seoDescription: d.seoDescription || '',
              status: (statusStr === 'draft' ? 'draft' : 'published') as 'published' | 'draft',
            } as Work;
          })
          .filter((w) => w.status !== 'draft');

        // Sort descending by release year or creation date
        data.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

        if (data.length > 0) {
          setFeaturedWorks(data.slice(0, 3));
        } else {
          setFeaturedWorks(DEFAULT_FEATURED_WORKS);
        }
        setIsLoadingWorks(false);
      },
      (error) => {
        console.error('Error fetching live portfolio works:', error);
        setFeaturedWorks(DEFAULT_FEATURED_WORKS);
        setIsLoadingWorks(false);
      }
    );

    return () => {
      unsubTestimonials();
      unsubPortfolio();
    };
  }, []);

  const totalTestimonials = testimonials.length || 1;
  const activeTestimonialIdx = currentTestimonial % totalTestimonials;
  const activeTestimonial = testimonials[activeTestimonialIdx] || DEFAULT_TESTIMONIALS[0];

  const nextTestimonial = () =>
    setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials);
  const prevTestimonial = () =>
    setCurrentTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);

  return (
    <div className="w-full">
      <SEO
        title="Michael Bakare | Composer, Music Producer & Director"
        description="The official website of Michael Bakare. Acclaimed Composer, Music Producer, Director, and Pianist. Explore portfolio, masterclasses, and services."
        url="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Michael Bakare Home",
          description:
            "The official website of Michael Bakare. Acclaimed Composer, Music Producer, Director, and Pianist.",
        }}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-canvas/85 backdrop-blur-sm z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply"
          >
            {/* Elegant abstract fluid motion placeholder */}
            <source
              src="https://cdn.pixabay.com/video/2020/05/25/40141-424881062_large.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 max-w-3xl z-10">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, ease: easeCurve }}
              className="w-16 h-px bg-ink mb-12 origin-left hidden md:block"
            />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="flex flex-col mb-8"
            >
              <motion.h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight text-ink flex flex-col">
                {['Composer,', 'Producer &', 'Director.'].map((line, idx) => (
                  <span key={idx} className="block overflow-hidden pb-2 -mb-2">
                    <motion.span
                      className="block origin-bottom-left"
                      variants={{
                        hidden: { y: '120%', rotateZ: 3, opacity: 0 },
                        visible: {
                          y: 0,
                          rotateZ: 0,
                          opacity: 1,
                          transition: { duration: 1.2, ease: easeCurve },
                        },
                      }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-ink-muted mb-12 max-w-xl leading-relaxed font-light flex flex-wrap"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.02,
                    delayChildren: 0.6,
                  },
                },
              }}
            >
              {'Crafting refined sonic experiences and visionary musical direction. Explore a curated archive of performances, cinematic scores, and premium publications.'
                .split(' ')
                .map((word, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-block mr-[0.25em]"
                    variants={{
                      hidden: { opacity: 0, filter: 'blur(4px)', y: 10 },
                      visible: {
                        opacity: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        transition: { duration: 1, ease: easeCurve },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: easeCurve }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link
                to="/works"
                className="inline-flex items-center justify-center bg-ink text-canvas px-8 py-4 rounded-full font-medium text-sm hover:bg-zinc-800 transition-colors"
              >
                Explore Portfolio
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-ink px-2 py-4 font-medium text-sm hover:text-ink-muted transition-colors group"
              >
                Request a Quote
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 w-full relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: easeCurve }}
              className="aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <ResponsiveImage
                src="https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1200"
                alt="Piano performance"
                className="object-cover w-full h-full grayscale mix-blend-multiply opacity-80"
                forceEager={true}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1, ease: easeCurve }}
              className="absolute bottom-8 right-[calc(100%-2rem)] lg:right-auto lg:-left-12 text-xs font-mono text-ink-muted uppercase tracking-widest rotate-180"
              style={{ writingMode: 'vertical-rl' }}
            >
              Est. &mdash; Professional
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selected Works Gallery */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: easeCurve }}
          >
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4">
              Portfolio
            </h2>
            <h3 className="font-serif text-3xl md:text-5xl text-ink">Selected Works</h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeCurve }}
          >
            <Link
              to="/works"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-ink hover:text-ink-muted transition-colors group"
            >
              View Complete Archive
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {isLoadingWorks ? (
            <div className="col-span-12 py-32 flex justify-center text-ink-muted font-light">
              Loading archive...
            </div>
          ) : featuredWorks.length > 0 ? (
            <>
              {/* Large Featured Work */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease: easeCurve }}
                className="md:col-span-7"
              >
                <Link
                  to={`/works/${featuredWorks[0].id}`}
                  className="group block relative overflow-hidden rounded-[2.5rem] aspect-square md:aspect-[4/5] bg-zinc-100 h-full border border-border-subtle"
                >
                  {featuredWorks[0].coverImageUrl ? (
                    <ResponsiveImage
                      src={featuredWorks[0].coverImageUrl}
                      alt={featuredWorks[0].title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 font-serif">
                      Selected Archive
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

                  {featuredWorks[0].year && (
                    <div className="absolute top-8 left-8 md:top-10 md:left-10 z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                      {featuredWorks[0].year}
                    </div>
                  )}

                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10">
                    <span className="text-canvas/70 text-xs uppercase tracking-widest font-semibold mb-4 block transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                      {featuredWorks[0].category} &mdash; {featuredWorks[0].role || 'Composer'}
                    </span>
                    <h4 className="text-canvas font-serif text-4xl md:text-5xl lg:text-6xl transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-out mb-2 group-hover:text-white leading-tight">
                      {featuredWorks[0].title}
                    </h4>
                    <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-700 ease-out flex items-center">
                      <span className="text-white/80 text-sm font-medium flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-150">
                        Explore Archive <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Secondary Stack */}
              <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
                {featuredWorks.slice(1, 3).map((work, idx) => (
                  <motion.div
                    key={work.id || idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1, delay: 0.15 * (idx + 1), ease: easeCurve }}
                    className="flex-1"
                  >
                    <Link
                      to={`/works/${work.id}`}
                      className="group block relative overflow-hidden rounded-[2.5rem] h-full min-h-[350px] bg-zinc-100 border border-border-subtle"
                    >
                      {work.coverImageUrl ? (
                        <ResponsiveImage
                          src={work.coverImageUrl}
                          alt={work.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

                      {work.year && (
                        <div className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                          {work.year}
                        </div>
                      )}

                      <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                        <span className="text-canvas/70 text-[10px] uppercase tracking-widest font-semibold mb-3 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                          {work.category}
                        </span>
                        <h4 className="text-canvas font-serif text-3xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-out mb-1 group-hover:text-white leading-tight">
                          {work.title}
                        </h4>
                        <div className="h-0 overflow-hidden group-hover:h-6 transition-all duration-700 ease-out flex items-center mt-1">
                          <span className="text-white/80 text-xs font-medium flex items-center gap-1.5 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-150">
                            View Details <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Fill empty spots if less than 3 works */}
                {featuredWorks.length === 2 && (
                  <div className="flex-1 rounded-[2.5rem] border-2 border-dashed border-border-subtle flex items-center justify-center p-8 text-center text-ink-muted font-light">
                    More works arriving soon
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="col-span-12 py-32 text-center text-ink-muted font-light border border-dashed border-border-subtle rounded-3xl">
              Archive is currently being updated.
            </div>
          )}
        </div>
      </section>

      {/* Audio Showcase / Audition Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pb-24">
        <div className="bg-surface border border-border-subtle rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2 flex items-center gap-2">
                <Music size={14} /> Sonic Audition
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-ink">
                Audition Key Repertoire
              </h3>
            </div>
            <Link
              to="/works"
              className="text-xs uppercase tracking-widest font-semibold text-ink hover:text-ink-muted transition-colors flex items-center gap-1.5"
            >
              Browse Complete Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Celestial Echoes',
                genre: 'Symphonic Suite',
                url: '/audio/celestial-echoes-preview.wav',
                cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300',
              },
              {
                title: 'The Horizon Divide',
                genre: 'Hybrid Film OST',
                url: '/audio/horizon-divide-preview.wav',
                cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300',
              },
              {
                title: 'Nocturne in C Minor',
                genre: 'Solo Grand Piano',
                url: '/audio/nocturnes-preview.wav',
                cover: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=300',
              },
              {
                title: 'Chamber Fantasy',
                genre: 'String Sextet & Harp',
                url: '/audio/chamber-fantasy-preview.wav',
                cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=300',
              },
            ].map((track, idx) => {
              const isThisPlaying = currentTrack?.url === track.url && isPlaying;
              return (
                <div
                  key={idx}
                  onClick={() =>
                    playTrack({
                      title: track.title,
                      artist: 'Michael Bakare',
                      url: track.url,
                      coverUrl: track.cover,
                    })
                  }
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group ${
                    isThisPlaying
                      ? 'bg-ink text-canvas border-ink shadow-md'
                      : 'bg-canvas border-border-subtle hover:border-ink/50 text-ink'
                  }`}
                >
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isThisPlaying ? 'bg-canvas text-ink' : 'bg-surface text-ink border border-border-subtle'
                    }`}
                    aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  >
                    {isThisPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-sm font-medium truncate">{track.title}</h4>
                    <p className={`text-[10px] uppercase tracking-wider font-mono truncate mt-0.5 ${isThisPlaying ? 'text-zinc-400' : 'text-ink-muted'}`}>
                      {track.genre}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Areas (Services & Store) */}
      <section className="bg-ink text-canvas py-32 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: easeCurve }}
          >
            <Link to="/services" className="block h-full group">
              <div className="h-full bg-zinc-900/50 border border-zinc-800 p-10 md:p-14 rounded-[2rem] transition-colors duration-500 hover:bg-zinc-800 flex flex-col justify-between items-start">
                <div className="w-14 h-14 bg-canvas text-ink rounded-full flex items-center justify-center mb-16 group-hover:scale-110 transition-transform duration-500">
                  <ArrowUpRight size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 text-canvas group-hover:text-zinc-200 transition-colors">
                    Professional Services
                  </h2>
                  <p className="text-zinc-400 mb-10 leading-relaxed font-light text-lg max-w-md">
                    Bespoke musical direction, composition, and strategic creative consulting tailored
                    for high-level industry engagements.
                  </p>
                  <span className="text-sm uppercase tracking-widest font-semibold pb-1 border-b border-zinc-600 group-hover:border-white transition-colors">
                    Explore Services
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.15, ease: easeCurve }}
          >
            <Link to="/store" className="block h-full group">
              <div className="h-full bg-zinc-900/50 border border-zinc-800 p-10 md:p-14 rounded-[2rem] transition-colors duration-500 hover:bg-zinc-800 flex flex-col justify-between items-start">
                <div className="w-14 h-14 bg-canvas text-ink rounded-full flex items-center justify-center mb-16 group-hover:scale-110 transition-transform duration-500">
                  <Library size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 text-canvas group-hover:text-zinc-200 transition-colors">
                    Store & Publications
                  </h2>
                  <p className="text-zinc-400 mb-10 leading-relaxed font-light text-lg max-w-md">
                    Securely acquire premium masterclasses, published scores, and exclusive digital
                    assets directly from the archive.
                  </p>
                  <span className="text-sm uppercase tracking-widest font-semibold pb-1 border-b border-zinc-600 group-hover:border-white transition-colors">
                    Visit Store
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel - dynamically updated by Admin portal */}
      <section className="bg-canvas border-t border-border-subtle py-32 md:py-48 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <ScrollReveal>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-16">
              Words from Collaborators
            </h2>
          </ScrollReveal>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: easeCurve }}
                className="flex flex-col items-center bg-surface border border-border-subtle p-10 md:p-16 rounded-[2.5rem]"
              >
                <div className="text-ink-muted text-6xl font-serif leading-none mb-8 opacity-20">"</div>
                <p className="text-ink text-2xl md:text-3xl font-light leading-relaxed mb-12 italic">
                  {activeTestimonial.quote}
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center text-ink font-serif text-xl mb-2 font-medium">
                    {activeTestimonial.author ? activeTestimonial.author.charAt(0) : 'M'}
                  </div>
                  <div>
                    <h4 className="text-ink font-semibold tracking-wide text-sm uppercase">
                      {activeTestimonial.author}
                    </h4>
                    {activeTestimonial.role && (
                      <p className="text-ink-muted text-xs tracking-widest uppercase mt-1">
                        {activeTestimonial.role}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-12">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all hover:bg-zinc-50 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft
                  size={20}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeTestimonialIdx
                        ? 'bg-ink w-8'
                        : 'bg-border-subtle hover:bg-ink-muted w-2'
                    }`}
                    aria-label={`View testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all hover:bg-zinc-50 group"
                aria-label="Next testimonial"
              >
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Teaser */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-32 md:py-48 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: easeCurve }}
        >
          <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-8">
            The Legacy
          </h2>
        </motion.div>

        <motion.h3
          className="font-serif text-3xl md:text-5xl max-w-4xl mx-auto leading-tight mb-16 flex flex-wrap justify-center text-ink"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.03,
              },
            },
          }}
        >
          {`"A dedication to clean editorial sophistication, contemporary human-centered design, and refined cultural impact."`
            .split(' ')
            .map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block mx-[0.15em] mb-2"
                variants={{
                  hidden: { opacity: 0, filter: 'blur(4px)', y: 10 },
                  visible: {
                    opacity: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    transition: { duration: 1, ease: easeCurve },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.6, ease: easeCurve }}
        >
          <Link
            to="/about"
            className="inline-flex items-center justify-center bg-ink text-canvas px-10 py-5 rounded-full font-medium text-sm hover:bg-zinc-800 transition-colors group"
          >
            Read Full Biography
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
