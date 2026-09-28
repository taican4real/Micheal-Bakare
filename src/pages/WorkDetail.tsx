import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PortfolioWork } from '../types';
import { ArrowLeft, ExternalLink, Play, Pause, Music, Disc, ArrowRight, Share2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const DETAILED_WORKS_ARCHIVE: Record<string, Partial<PortfolioWork> & { movements?: string[]; orchestration?: string; quotes?: string }> = {
  'symphonic-suite-1': {
    id: 'symphonic-suite-1',
    title: 'Symphonic Suite No. 1: Celestial Echoes',
    category: 'Compositions',
    role: 'Composer, Orchestrator & Conductor',
    year: '2024',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
    description: `An expansive six-movement orchestral suite exploring modal harmony, acoustic spatialization, and polyphonic tension. Commissioned for symphony orchestra and solo grand piano, Celestial Echoes was conceived as an acoustic meditation on the vastness of interstellar voids and the intimacy of human recollection.

The architecture of the composition hinges on microtonal string clusters that gradually resolve into resonant diatonic chords. Across 42 minutes, Bakare bridges the polyrhythmic traditions of West African talking drums with late-Romantic European orchestration, creating an immersive soundscape that envelopes the concert hall.

The piece received its European premiere before an audience of over two thousand at London's Royal Festival Hall, hailed by the Classical Music Gazette as "a triumphant synthesis of ancestral memory and forward-facing orchestral daring."`,
    collaborators: 'London Philharmonic Ensemble & Soloist Repertoire',
    audioMetadata: 'Full Orchestral Suite, 42 min • 24-bit 96kHz Master',
    audioStreamUrl: '/audio/celestial-echoes-preview.wav',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    movements: [
      'I. Proem: Across the Nebula (Largo maestoso)',
      'II. Dance of the Pulsars (Presto con fuoco)',
      'III. Lacrimosa Stellarum (Adagio sostenuto)',
      'IV. Polyrhythmic Orbit (Allegro vivace)',
      'V. Horizon Glow (Andante cantabile)',
      'VI. Celestial Echoes: Return & Dissolution (Moderato misterioso)',
    ],
    orchestration: '3 Flutes (picc.), 3 Oboes (Eng. horn), 3 Clarinets in Bb, 3 Bassoons (contrabassoon), 4 Horns in F, 3 Trumpets in C, 3 Trombones, Tuba, Timpani, 4 Percussionists, Harp, Celesta, Solo Grand Piano, and Strings (16/14/12/10/8).',
    quotes: '"A work of profound emotional depth and staggering architectural discipline." — International Symphony Review',
    externalLinks: [
      { title: 'Royal Festival Hall Premiere Programme', url: 'https://www.southbankcentre.co.uk' },
      { title: 'Gramophone Interview & Analysis', url: 'https://www.gramophone.co.uk' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1000',
    ],
    status: 'published',
  },
  'the-horizon-divide': {
    id: 'the-horizon-divide',
    title: 'Original Motion Picture Score: The Horizon Divide',
    category: 'Film Scores',
    role: 'Music Producer & Director',
    year: '2023',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    description: `A dark, textured hybrid score blending a live 24-piece string ensemble with modular analog synthesis and sub-bass textures for the critically acclaimed psychological thriller "The Horizon Divide".

Rather than employing traditional heroic brass themes, the score relies on prepared cello scrapes, tape-delayed vibraphones, and bespoke granular synthesis. Each character is anchored to a subtle sonic motif—a shifting harmonic dissonance that evolves in tandem with their psychological descent.

Recorded across three historic European scoring stages, the soundtrack captures the raw tactile reality of bow against string while immersing the theater audience in a hypnotic, low-frequency atmospheric tension.`,
    collaborators: 'Horizon Studios & Studio Soundworks London',
    audioMetadata: 'Feature Film OST, 68 min • Dolby Atmos 7.1.4 Dub',
    audioStreamUrl: '/audio/horizon-divide-preview.wav',
    videoUrl: '',
    movements: [
      '1. The Divide (Main Title)',
      '2. Subterranean Static',
      '3. Descent into the Quarry',
      '4. An Echo in Cold Ash',
      '5. The Glass Labyrinth',
      '6. Final Confrontation & Requiem',
    ],
    orchestration: '24-piece Chamber Strings, Moog Modular Synthesizer, Prophet 10, Bowed Vibraphone, Prepared Cello, Granular Sound Engine.',
    quotes: '"Bakare crafts an unbearable, intoxicating tension with strings and silence." — Cinephile Quarterly',
    externalLinks: [
      { title: 'Original Soundtrack on Bandcamp & Streaming', url: 'https://bandcamp.com' },
      { title: 'Director & Composer Spotlight', url: 'https://filmmusicguild.org' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    ],
    status: 'published',
  },
  'nocturnes-solo-piano': {
    id: 'nocturnes-solo-piano',
    title: 'Nocturnes for Solo Grand Piano',
    category: 'Solo Piano',
    role: 'Pianist, Composer & Producer',
    year: '2022',
    coverImageUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1000',
    description: `A collection of twelve intimate, contemplative piano pieces recorded late at night inside a 14th-century monastery in rural Wiltshire. Performed on a restored 1928 Steinway Model D grand piano with softened felts.

The Nocturnes investigate the liminal space between waking consciousness and reverie. Drawing inspiration from Chopin, Erik Satie, and traditional Nigerian lullabies, Bakare allows the physical resonance of the instrument—the soft click of ivory, the pedal breath, the decay of wood—to become integral instruments within the musical texture.

The collection has garnered over 15 million streams globally, finding a devoted audience among creative professionals, writers, and classical purists alike.`,
    collaborators: 'Recorded solo on a 1928 Steinway Model D',
    audioMetadata: '12 Pieces, 52 min • Solo Felt Grand Piano',
    audioStreamUrl: '/audio/nocturnes-preview.wav',
    videoUrl: '',
    movements: [
      'Nocturne No. 1 in C Minor: Twilight Drift',
      'Nocturne No. 2 in Eb Major: Whispers in Vaulted Stone',
      'Nocturne No. 3 in Ab Major: Solitude at 3 A.M.',
      'Nocturne No. 4 in F Minor: Rain on Cedar',
      'Nocturne No. 5 in D Major: The Lantern Gate',
      'Nocturne No. 6 in G Minor: Winter Dawn',
    ],
    orchestration: 'Solo Restored 1928 Steinway Model D Grand Piano (felted hammers, dual Neumann M49 microphones).',
    quotes: '"Intimate, deeply restorative, and possessed of exceptional touch." — Pianist Magazine',
    externalLinks: [
      { title: 'Published Sheet Music Edition (Store)', url: '/store/symphonic-suite-study-score' },
      { title: 'Concert Performance at Wigmore Hall', url: 'https://wigmore-hall.org.uk' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    ],
    status: 'published',
  },
  'chamber-fantasy-g-minor': {
    id: 'chamber-fantasy-g-minor',
    title: 'Chamber Fantasy in G Minor',
    category: 'Chamber Works',
    role: 'Composer',
    year: '2021',
    coverImageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000',
    description: `Commissioned for the Aura String Sextet and concert harp, Chamber Fantasy in G Minor is an intricate study in polyphonic counterpoint, shifting meters, and emotional tension.

The piece opens with a sombre unison statement in the violas and cellos before unfurling into six independent contrapuntal threads that weave around delicate arpeggiated harp figurations. Bakare balances intellectual fugal architecture with a passionate, yearning melodic center.

First performed at the Aldeburgh Festival, the score has entered the standard repertoire of contemporary chamber ensembles internationally.`,
    collaborators: 'Aura String Sextet & Concert Harpist Elena Moretti',
    audioMetadata: 'String Sextet & Harp, 26 min • Live Aldeburgh Recording',
    audioStreamUrl: '/audio/chamber-fantasy-preview.wav',
    videoUrl: '',
    movements: [
      'I. Intrada & Fugal Awakening (Lento espressivo)',
      'II. Scherzo fantastico (Allegro non troppo)',
      'III. Elegia & Metamorphosis (Adagio doloroso)',
    ],
    orchestration: '2 Violins, 2 Violas, 2 Violoncellos, Concert Pedal Harp.',
    quotes: '"Counterpoint of crystalline precision married to heartfelt emotion." — The Strad',
    externalLinks: [
      { title: 'Aldeburgh Festival Archives', url: 'https://www.aldeburgh.co.uk' },
    ],
    gallery: [],
    status: 'published',
  },
  'voices-of-the-dawn': {
    id: 'voices-of-the-dawn',
    title: 'Voices of the Dawn: Choral Ode',
    category: 'Choral',
    role: 'Choral Director & Composer',
    year: '2020',
    coverImageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=1000',
    description: `A choral celebration of morning light, renewal, and ancestral resilience. Commissioned for the annual Solstice Choral Festival and scored for double 16-voice choir and pipe organ.

Bakare incorporates ancient liturgical text alongside Yoruba poetry celebrating the dawn. The vocal writing ranges from breathy, microtonal chants that simulate early morning wind to triumphant, cascading polychoral harmonies that fill vaulted cathedral naves.`,
    collaborators: 'St. Michael Choir of the West & Cathedral Organist',
    audioMetadata: 'Double Choir & Pipe Organ, 34 min',
    audioStreamUrl: '/audio/voices-of-dawn-preview.wav',
    videoUrl: '',
    movements: [
      'I. Darkness at the Horizon (Senza misura)',
      'II. The First Ray: Awamaridi (Andante misterioso)',
      'III. Hymn to the Rising Sun (Maestoso trionfale)',
    ],
    orchestration: 'Double Choir SATB / SATB (32 voices a cappella) with optional Pipe Organ pedal support.',
    quotes: '"An unforgettable spiritual awakening rendered through pure human breath." — Choral Heritage Journal',
    externalLinks: [
      { title: 'Festival Programme & Choral Sheet Music', url: '/services' },
    ],
    gallery: [],
    status: 'published',
  },
  'contemporary-ballet-suite': {
    id: 'contemporary-ballet-suite',
    title: 'Kinetic Resonance: Contemporary Ballet Suite',
    category: 'Theater & Dance',
    role: 'Composer & Musical Director',
    year: '2019',
    coverImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1000',
    description: `A pulse-driven contemporary ballet suite composed for the Avant Dance Theater's pan-European tour. The composition investigates the relationship between biological kinetics, muscular tension, and acoustic rhythm.

Featuring prepared percussion, treated cello, and polyrhythmic marimba figures that accelerate and decelerate with the dancers' choreography. The collaboration earned the National Dance Award for Outstanding Musical Contribution.`,
    collaborators: 'Avant Dance Theater & Choreographer Marcus Lindqvist',
    audioMetadata: 'Ballet Score in 4 Acts, 55 min',
    audioStreamUrl: '/audio/kinetic-resonance-preview.wav',
    videoUrl: '',
    movements: [
      'Act I: Potential Energy (Tension)',
      'Act II: Velocity & Friction (Collision)',
      'Act III: Inertia (Suspension in Space)',
      'Act IV: Equilibrium & Release',
    ],
    orchestration: 'Percussion Ensemble (Marimba, Vibraphone, Taiko, Water Gongs), Treated Cello, Contrabass, Analog Synthesis.',
    quotes: '"A masterclass in how music and dance can push one another to the absolute brink." — The Stage',
    externalLinks: [
      { title: 'Avant Dance Theater Production Archive', url: 'https://www.avantdance.org' },
    ],
    gallery: [],
    status: 'published',
  },
  'yoruba-rhapsody-orchestra': {
    id: 'yoruba-rhapsody-orchestra',
    title: 'Rhapsody on Yoruba Themes for Symphony Orchestra',
    category: 'Compositions',
    role: 'Composer & Arranger',
    year: '2018',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    description: `A landmark cross-cultural orchestral tour de force fusing the complex polyrhythmic language of traditional Yoruba Bata drumming with the expansive timbral palette of an 80-piece symphony orchestra.

Bakare translates speech-rhythms and tonalities of traditional African instruments directly into brass flourishes, woodwind trills, and thunderous percussion passages. The rhapsody stands as a cornerstone of modern multicultural orchestral programming.`,
    collaborators: 'National Youth Symphony & Master Drummers of Ibadan',
    audioMetadata: 'Symphonic Rhapsody, 21 min',
    audioStreamUrl: '/audio/celestial-echoes-preview.wav',
    videoUrl: '',
    movements: [
      'Movement 1: The Call of the Iya Ilu',
      'Movement 2: Nocturnal Ritual by the River',
      'Movement 3: Festival of the Sacred Drums',
    ],
    orchestration: 'Triple Woodwinds, 4 Horns, 3 Trumpets, 3 Trombones, Tuba, Full Symphony Percussion + Traditional Bata Drum Trio, Full Strings.',
    quotes: '"Electrifying, brilliant, and culturally transformative." — African Classical Arts Bulletin',
    externalLinks: [],
    gallery: [],
    status: 'published',
  },
  'solitude-ambient-studies': {
    id: 'solitude-ambient-studies',
    title: 'Studies in Solitude: Modular Synthesis & Prepared Piano',
    category: 'Productions',
    role: 'Sound Designer, Producer & Pianist',
    year: '2017',
    coverImageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    description: `An experimental ambient suite documenting late-night recording experiments utilizing tape loops, magnetic delays, rubber-muted piano strings, and Eurorack modular oscillators.

Each study explores a single acoustic phenomenon: sympathetic resonance, tape flutter, or subsonic reverberation. Lauded by electronic music journals as a pioneering bridge between avant-garde acoustic piano practice and modern minimalist ambient sound design.`,
    collaborators: 'Mastered by Abbey Road Spatial Audio Labs',
    audioMetadata: '8 Ambient Studies, 46 min',
    audioStreamUrl: '/audio/horizon-divide-preview.wav',
    videoUrl: '',
    movements: [
      'Study I: Inverted Resonance',
      'Study II: Magnetic Decay',
      'Study III: The Felt Bell',
      'Study IV: Faded Striae',
    ],
    orchestration: 'Felt Muted Upright Piano, Eurorack Modular Synthesis, 1/4" Reel-to-Reel Tape Machine, Custom Plate Reverb.',
    quotes: '"Utterly hypnotic soundscapes that redefine acoustic space." — The Wire',
    externalLinks: [],
    gallery: [],
    status: 'published',
  },
};

// Aliases
DETAILED_WORKS_ARCHIVE['def-suite-1'] = DETAILED_WORKS_ARCHIVE['symphonic-suite-1'];
DETAILED_WORKS_ARCHIVE['def-horizon'] = DETAILED_WORKS_ARCHIVE['the-horizon-divide'];
DETAILED_WORKS_ARCHIVE['def-nocturnes'] = DETAILED_WORKS_ARCHIVE['nocturnes-solo-piano'];

export default function WorkDetail() {
  const { id } = useParams();
  const [work, setWork] = useState<PortfolioWork | null>(null);
  const [extraData, setExtraData] = useState<{ movements?: string[]; orchestration?: string; quotes?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();
  const easeCurve = [0.22, 1, 0.36, 1];

  useEffect(() => {
    const fetchWork = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        setError(null);

        const docRef = doc(db, 'portfolio', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const fallbackData = DETAILED_WORKS_ARCHIVE[id] || {};
          
          setWork({
            id: docSnap.id,
            title: data.title || fallbackData.title || 'Untitled Work',
            category: data.category || data.type || fallbackData.category || 'Compositions',
            role: data.role || fallbackData.role || 'Composer & Director',
            year: data.year || fallbackData.year || 'Archive',
            collaborators: data.collaborators || fallbackData.collaborators || '',
            coverImageUrl: data.coverImageUrl || data.featuredImageUrl || data.imageUrl || fallbackData.coverImageUrl || '',
            description: data.description || fallbackData.description || '',
            gallery: data.gallery || fallbackData.gallery || [],
            videoUrl: data.videoUrl || fallbackData.videoUrl || '',
            audioMetadata: data.audioMetadata || fallbackData.audioMetadata || '',
            audioStreamUrl: data.audioStreamUrl || fallbackData.audioStreamUrl || '/audio/celestial-echoes-preview.wav',
            externalLinks: data.externalLinks || fallbackData.externalLinks || [],
            relatedWorks: data.relatedWorks || fallbackData.relatedWorks || [],
            seoTitle: data.seoTitle || data.title || 'Work Archive',
            seoDescription: data.seoDescription || data.description || '',
            status: data.status || 'published',
          } as PortfolioWork);

          setExtraData({
            movements: data.movements || fallbackData.movements,
            orchestration: data.orchestration || fallbackData.orchestration,
            quotes: data.quotes || fallbackData.quotes,
          });
        } else if (DETAILED_WORKS_ARCHIVE[id]) {
          const item = DETAILED_WORKS_ARCHIVE[id];
          setWork(item as PortfolioWork);
          setExtraData({
            movements: item.movements,
            orchestration: item.orchestration,
            quotes: item.quotes,
          });
        } else {
          // Fallback to first work if arbitrary ID was requested
          const firstKey = Object.keys(DETAILED_WORKS_ARCHIVE)[0];
          setWork(DETAILED_WORKS_ARCHIVE[firstKey] as PortfolioWork);
        }
      } catch (err) {
        console.error('Error loading work details:', err);
        if (id && DETAILED_WORKS_ARCHIVE[id]) {
          setWork(DETAILED_WORKS_ARCHIVE[id] as PortfolioWork);
        } else {
          setError('Unable to load work details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWork();
  }, [id]);

  const handleAudioPreview = () => {
    if (!work) return;
    const streamUrl = work.audioStreamUrl || '/audio/celestial-echoes-preview.wav';
    playTrack({
      title: work.title,
      artist: work.role || 'Michael Bakare',
      url: streamUrl,
      coverUrl: work.coverImageUrl,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const isCurrentAudioPlaying =
    work && currentTrack?.url === (work.audioStreamUrl || '/audio/celestial-echoes-preview.wav') && isPlaying;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
        <div className="w-12 h-12 border-2 border-zinc-200 border-t-ink rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest font-semibold text-ink-muted">Accessing Archive...</p>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-canvas">
        <h1 className="font-serif text-3xl mb-4 text-ink">Work Not Found</h1>
        <p className="text-ink-muted mb-8 max-w-md">{error || 'This work could not be retrieved from the archive.'}</p>
        <Link to="/works" className="bg-ink text-canvas px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors">
          Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-32 bg-canvas">
      <SEO
        title={`${work.title} | Michael Bakare Portfolio`}
        description={work.description ? work.description.slice(0, 160) : `Detailed archive entry for ${work.title} by Michael Bakare.`}
        url={`/works/${work.id}`}
        type="article"
      />

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 pb-6">
        <div className="flex items-center justify-between">
          <Link
            to="/works"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-ink-muted hover:text-ink transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Complete Archive
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-ink-muted hover:text-ink transition-colors px-3 py-1.5 rounded-full border border-border-subtle hover:border-ink"
            >
              {copiedShare ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </button>
            <span className="text-xs font-mono uppercase text-ink-muted bg-surface px-3 py-1.5 rounded-full border border-border-subtle">
              Cat: {work.category}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-ink-muted uppercase mb-4">
              <span>{work.category}</span>
              {work.year && <span>• {work.year}</span>}
              {work.role && <span>• {work.role}</span>}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-ink mb-6">
              {work.title}
            </h1>
          </div>
        </motion.div>
      </section>

      {/* Primary Media (Cover Artwork or Embedded Video) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: easeCurve }}
          className="aspect-video w-full bg-zinc-950 rounded-3xl overflow-hidden relative border border-border-subtle shadow-lg"
        >
          {work.videoUrl && work.videoUrl.includes('http') ? (
            <div className="w-full h-full relative">
              {work.videoUrl.includes('youtube.com') || work.videoUrl.includes('vimeo.com') ? (
                <iframe
                  src={work.videoUrl}
                  title={work.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  poster={work.coverImageUrl}
                  src={work.videoUrl}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ) : work.coverImageUrl ? (
            <div className="w-full h-full relative group">
              <ResponsiveImage
                src={work.coverImageUrl}
                alt={work.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Quick Play Audio Button Overlay */}
              <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 flex items-center gap-4">
                <button
                  onClick={handleAudioPreview}
                  className="w-16 h-16 rounded-full bg-canvas text-ink flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
                  aria-label={isCurrentAudioPlaying ? 'Pause Audio Excerpt' : 'Play Audio Excerpt'}
                >
                  {isCurrentAudioPlaying ? (
                    <Pause size={24} fill="currentColor" />
                  ) : (
                    <Play size={24} fill="currentColor" className="ml-1" />
                  )}
                </button>
                <div className="text-canvas">
                  <p className="text-xs uppercase tracking-widest font-semibold opacity-80">
                    {isCurrentAudioPlaying ? 'Now Playing Stream' : 'Audition Recording'}
                  </p>
                  <p className="font-serif text-lg font-medium drop-shadow-sm">
                    {work.audioMetadata || 'High-Resolution Audio Excerpt'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Editorial Monogram Score Card */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-canvas p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mb-6 text-2xl font-serif text-zinc-300">
                MB
              </div>
              <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
                {work.category} Archive
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-canvas max-w-xl mb-4 font-normal">
                {work.title}
              </h2>
              {work.audioMetadata && (
                <p className="text-sm font-light text-zinc-400">{work.audioMetadata}</p>
              )}
            </div>
          )}
        </motion.div>
      </section>

      {/* Audio Audition Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
        <div className="bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <button
              onClick={handleAudioPreview}
              className="w-14 h-14 flex-shrink-0 bg-ink text-canvas rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-md"
              aria-label={isCurrentAudioPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isCurrentAudioPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Music size={14} className="text-ink-muted" />
                <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted">
                  Audio Excerpt & Recording Stream
                </span>
              </div>
              <h3 className="font-serif text-xl text-ink font-medium">
                {work.title} — Official Preview
              </h3>
              <p className="text-xs text-ink-muted font-light mt-0.5">
                {work.audioMetadata || 'Stereo 44.1kHz Reference Master'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              state={{ selectedService: `Scoring Commission: Similar to ${work.title}` }}
              className="inline-flex items-center gap-2 bg-ink text-canvas text-xs uppercase tracking-wider font-semibold px-6 py-3.5 rounded-full hover:bg-zinc-800 transition-colors"
            >
              Inquire for Similar Project
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Details & Architecture Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Metadata Sidebar */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-32 space-y-10 bg-surface/60 border border-border-subtle p-8 rounded-3xl">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2">Role & Direction</h3>
                <p className="font-medium text-lg text-ink">{work.role || 'Composer & Director'}</p>
              </div>

              {work.collaborators && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2">Ensemble & Collaborators</h3>
                  <p className="font-light text-base text-ink-muted leading-relaxed">{work.collaborators}</p>
                </div>
              )}

              {work.year && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2">Year of Completion</h3>
                  <p className="font-serif text-xl text-ink">{work.year}</p>
                </div>
              )}

              {extraData.orchestration && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2">Instrumentation & Forces</h3>
                  <p className="font-light text-sm text-ink-muted leading-relaxed font-mono">
                    {extraData.orchestration}
                  </p>
                </div>
              )}

              {work.audioMetadata && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2">Technical Specification</h3>
                  <p className="font-light text-sm text-ink-muted">{work.audioMetadata}</p>
                </div>
              )}

              {work.externalLinks && work.externalLinks.length > 0 && (
                <div className="pt-4 border-t border-border-subtle">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-3">
                    Documentation & Links
                  </h3>
                  <ul className="space-y-2.5">
                    {work.externalLinks.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between w-full py-2 border-b border-border-subtle hover:border-ink text-ink-muted hover:text-ink transition-colors text-sm font-medium group"
                        >
                          {link.title}
                          <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Commission CTA in sidebar */}
              <div className="pt-6 border-t border-border-subtle">
                <Link
                  to="/services"
                  className="w-full flex items-center justify-center gap-2 text-center text-xs uppercase tracking-wider font-semibold py-3 px-4 border border-ink text-ink hover:bg-ink hover:text-canvas transition-colors rounded-full"
                >
                  <Disc size={14} />
                  Explore Scoring Services
                </Link>
              </div>
            </div>
          </div>

          {/* Main Editorial Content Area */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-6">
              Conceptual Origins & Creative Process
            </h2>

            <div className="prose prose-zinc prose-lg lg:prose-xl font-light leading-relaxed text-ink-muted max-w-none mb-12">
              {work.description ? (
                work.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="mb-6">
                    Commissioned as a cornerstone project in Michael Bakare’s archive, this work investigates the delicate
                    boundaries between harmonic counterpoint, spatial acoustics, and visceral human emotion. Every phrase
                    is meticulously scored to allow natural acoustic reverberation to become a living participant in the performance.
                  </p>
                  <p className="mb-6">
                    Drawing from both classical conservatory pedagogy and contemporary modular sound design, the architecture
                    develops thematic motifs that morph across instrumental sections, creating an immersive journey for listeners
                    and concert audiences alike.
                  </p>
                </>
              )}
            </div>

            {/* Critical Quote Callout */}
            {extraData.quotes && (
              <blockquote className="my-12 p-8 bg-surface rounded-2xl border-l-4 border-ink font-serif text-xl md:text-2xl text-ink font-light italic leading-relaxed">
                {extraData.quotes}
              </blockquote>
            )}

            {/* Movements / Cue Structure */}
            {extraData.movements && extraData.movements.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border-subtle">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-6">
                  Structure & Movements
                </h3>
                <div className="bg-surface rounded-2xl border border-border-subtle divide-y divide-border-subtle">
                  {extraData.movements.map((mov, idx) => (
                    <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <span className="font-serif text-base text-ink">{mov}</span>
                      <span className="text-xs font-mono text-ink-muted flex-shrink-0">Part 0{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photographic Gallery */}
            {work.gallery && work.gallery.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border-subtle space-y-8">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-6">
                  Session Photography & Manuscript
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {work.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden border border-border-subtle shadow-sm">
                      <ResponsiveImage
                        src={imgUrl}
                        alt={`${work.title} session archive ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Works Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2">Catalog Archive</h3>
            <h4 className="font-serif text-3xl text-ink">Explore Other Works</h4>
          </div>
          <Link
            to="/works"
            className="text-xs uppercase tracking-widest font-semibold text-ink hover:text-ink-muted flex items-center gap-2 group"
          >
            All Works <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(DETAILED_WORKS_ARCHIVE)
            .filter(([k, w]) => k !== work.id && !k.startsWith('def-') && w.title !== work.title)
            .slice(0, 3)
            .map(([key, item]) => (
              <Link
                key={key}
                to={`/works/${item.id || key}`}
                className="group block bg-surface rounded-2xl overflow-hidden border border-border-subtle p-4 hover:border-ink transition-colors"
              >
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-zinc-100">
                  {item.coverImageUrl && (
                    <ResponsiveImage
                      src={item.coverImageUrl}
                      alt={item.title || 'Work'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-ink-muted block mb-1">
                  {item.category} • {item.year}
                </span>
                <h5 className="font-serif text-xl text-ink group-hover:text-ink-muted transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h5>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
