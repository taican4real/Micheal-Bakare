import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Award, Compass, Music, BookOpen, ArrowRight } from 'lucide-react';

interface BiographyItem {
  id: string;
  title?: string;
  content?: string;
  status?: string;
  order?: number;
}

interface CareerItem {
  id: string;
  title: string;
  year?: string;
  description?: string;
  status?: string;
  category?: string;
}

interface AchievementItem {
  id: string;
  title: string;
  organization?: string;
  year?: string;
  status?: string;
}

export default function About() {
  const easeCurve = [0.22, 1, 0.36, 1];

  const [biographyList, setBiographyList] = useState<BiographyItem[]>([]);
  const [careerList, setCareerList] = useState<CareerItem[]>([]);
  const [achievementsList, setAchievementsList] = useState<AchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to real-time updates from Admin uploads in Firestore
  useEffect(() => {
    // 1. Biography collection
    const unsubBio = onSnapshot(
      collection(db, 'biography'),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as BiographyItem))
          .filter(
            (b) =>
              b.status !== 'Inactive' &&
              b.status !== 'Draft' &&
              b.status !== 'inactive' &&
              b.status !== 'draft'
          );
        setBiographyList(items);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching biography:', error);
        setIsLoading(false);
      }
    );

    // 2. Career collection
    const unsubCareer = onSnapshot(
      collection(db, 'career'),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as CareerItem))
          .filter(
            (c) =>
              c.status !== 'Inactive' &&
              c.status !== 'Draft' &&
              c.status !== 'inactive' &&
              c.status !== 'draft'
          );
        items.sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));
        setCareerList(items);
      },
      (error) => {
        console.error('Error fetching career milestones:', error);
      }
    );

    // 3. Achievements collection
    const unsubAchievements = onSnapshot(
      collection(db, 'achievements'),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as AchievementItem))
          .filter(
            (a) =>
              a.status !== 'Inactive' &&
              a.status !== 'Draft' &&
              a.status !== 'inactive' &&
              a.status !== 'draft'
          );
        setAchievementsList(items);
      },
      (error) => {
        console.error('Error fetching achievements:', error);
      }
    );

    return () => {
      unsubBio();
      unsubCareer();
      unsubAchievements();
    };
  }, []);

  // Combined timeline items from career and achievements with rich default milestones
  const timelineItems = careerList.length > 0
    ? careerList.map((c) => ({
        id: c.id,
        year: c.year || 'Current',
        category: c.category || 'Milestone',
        title: c.title,
        description: c.description || '',
      }))
    : achievementsList.length > 0
    ? achievementsList.map((a) => ({
        id: a.id,
        year: a.year || 'Recognition',
        category: a.organization || 'Award',
        title: a.title,
        description: `Conferred by ${a.organization || 'Esteemed Institution'}.`,
      }))
    : [
        {
          id: 'def-1',
          year: '2024',
          category: 'Concert Premiere',
          title: 'Symphonic Suite No. 3 Premiere at Royal Festival Hall',
          description:
            'Commissioned orchestral suite blending traditional polyphonic counterpoint with contemporary West African rhythmic structures, conducted before an audience of over two thousand.',
        },
        {
          id: 'def-2',
          year: '2023',
          category: 'Film Scoring Honor',
          title: 'International Film Music Critics Guild Recognition for "The Horizon Divide"',
          description:
            'Awarded Best Original Thriller Score for crafting a 68-minute textured hybrid composition utilizing a 24-piece chamber orchestra paired with modular synthesis.',
        },
        {
          id: 'def-3',
          year: '2022',
          category: 'Solo Piano Tour',
          title: 'International Pianoforte Recital Tour across European Concert Halls',
          description:
            'A 14-city recital tour through London (Wigmore Hall), Paris, and Vienna performing original Nocturnes and improvised contemporary variations on a 1928 Steinway Model D.',
        },
        {
          id: 'def-4',
          year: '2021',
          category: 'Chamber Commission',
          title: 'Aldeburgh Festival Premiere of Chamber Fantasy in G Minor',
          description:
            'Commissioned for the Aura String Sextet and concert harp, investigating polyphonic voice leading and acoustic microtonality.',
        },
        {
          id: 'def-5',
          year: '2020',
          category: 'Global Masterclasses',
          title: 'Launch of Advanced Harmonic Architecture & Orchestration Workshops',
          description:
            'Established an international masterclass curriculum training over 600 emerging composers, arrangers, and directors across 22 countries.',
        },
        {
          id: 'def-6',
          year: '2018',
          category: 'Choral Premiere',
          title: 'Voices of the Dawn Premiere at St. Michael Solstice Festival',
          description:
            'Scored for double 16-voice choir and historic pipe organ, fusing sacred Latin liturgical textures with traditional Yoruba poetry.',
        },
        {
          id: 'def-7',
          year: '2016',
          category: 'Conservatory Residency',
          title: 'Artistic Fellowship & Debut Piano Concerto Residency',
          description:
            'Named composer-in-residence with the National Contemporary Chamber Ensemble following the acclaimed premiere of Concerto for Piano & Wind Ensemble.',
        },
      ];

  const artisticCreed = [
    {
      icon: Music,
      title: 'Acoustic Authenticity',
      text: 'Prioritizing the tangible reality of physical instruments—the breath of woodwinds, the friction of horsehair on gut strings, and the natural reverberation of room acoustics.',
    },
    {
      icon: Compass,
      title: 'Harmonic Purpose',
      text: 'Rejecting gratuitous complexity in favor of precise emotional architecture. Every modulation and voice leading shift serves a clear narrative intention.',
    },
    {
      icon: BookOpen,
      title: 'Cultural Synthesis',
      text: 'Honoring both the rigor of European contrapuntal heritage and the polyrhythmic genius of West African rhythmic philosophy in equal, reverent measure.',
    },
    {
      icon: Award,
      title: 'Artistic Longevity',
      text: 'Composing with the long arc of musical history in mind, crafting scores, treatises, and masterclasses designed to endure across generations.',
    },
  ];

  return (
    <div className="w-full pb-32">
      <SEO
        title="About Michael Bakare | Composer, Producer & Pianist"
        description="Learn about the biography, artistic philosophy, and career milestones of Michael Bakare, an acclaimed Composer, Music Producer, and Pianist."
        url="/about"
        type="profile"
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
              Biography & Narrative
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight text-ink mb-8">
              A legacy defined by artistic integrity and strategic vision.
            </h1>
            <p className="text-lg md:text-xl text-ink-muted mb-8 max-w-2xl leading-relaxed font-light">
              Michael Bakare is an acclaimed composer, music producer, director, and concert pianist whose work
              bridges classical symphonic architecture, cinematic hybrid scoring, and global musical pedagogy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image & Biography Split */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-32">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 items-start">
          <ScrollReveal className="md:col-span-5 relative">
            <div className="aspect-[3/4] bg-zinc-100 rounded-3xl overflow-hidden relative shadow-lg border border-border-subtle sticky top-32">
              <ResponsiveImage
                src="https://res.cloudinary.com/diiwcoarc/image/upload/v1782327076/ChatGPT_Image_Jun_24_2026_07_50_16_PM_aqbn1u.png"
                alt="Michael Bakare Portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs tracking-wider uppercase font-semibold">
                Michael Bakare &mdash; London, United Kingdom
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="md:col-span-7 pt-4">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-8 pb-4 border-b border-border-subtle">
              Artistic Biography
            </h2>

            {/* Dynamic Biography Content updated via Admin Portal */}
            <div className="prose prose-zinc prose-lg font-light leading-relaxed text-ink-muted max-w-none space-y-10">
              {biographyList.length > 0 ? (
                biographyList.map((item, idx) => (
                  <div key={item.id || idx}>
                    {item.title && item.title.toLowerCase() !== 'biography' && (
                      <h3 className="font-serif text-2xl text-ink font-normal mb-4 not-prose">
                        {item.title}
                      </h3>
                    )}
                    {item.content ? (
                      item.content.split('\n').map((para, pIdx) =>
                        para.trim() ? (
                          <p key={pIdx} className="mb-4 text-ink-muted leading-relaxed">
                            {para}
                          </p>
                        ) : null
                      )
                    ) : null}
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <h3 className="font-serif text-2xl text-ink font-normal mb-4 not-prose">
                      The Formative Foundations & Classical Rigor
                    </h3>
                    <p className="mb-4">
                      Michael Bakare began his musical journey at the keyboard at an early age, displaying an
                      innate gift for acoustic resonance and melodic invention. Formally trained in classical
                      pianoforte and European contrapuntal theory, he absorbed the masterworks of Bach, Chopin,
                      Ravel, and Stravinsky while cultivating a distinctly modern harmonic vocabulary.
                    </p>
                    <p>
                      His early years were marked by rigorous discipline under esteemed conservatory professors,
                      imbuing his touch with exceptional nuance, tonal control, and a profound reverence for
                      polyphonic clarity.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-ink font-normal mb-4 not-prose">
                      Harmonic Architecture & Cultural Synthesis
                    </h3>
                    <p className="mb-4">
                      As his career progressed, Bakare embarked on a deliberate mission to bridge the polyrhythmic
                      traditions of his West African heritage with the majestic orchestral palette of the Western
                      symphonic tradition. Rather than superficial fusion, his compositions weave complex Yoruba
                      talking-drum cadences directly into brass voicings, string divisi, and harmonic ostinatos.
                    </p>
                    <p>
                      This cultural synthesis achieved international acclaim with the premiere of his Symphonic
                      Suites and Chamber Works, establishing Michael as a formidable, distinctive voice on the global
                      classical stage.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-ink font-normal mb-4 not-prose">
                      Cinematic Scoring & Spatial Sound
                    </h3>
                    <p className="mb-4">
                      Expanding beyond traditional concert halls, Michael established himself as a sought-after
                      composer and musical director for international feature films, documentaries, and theater
                      productions. His approach to film scoring treats music as narrative architecture: using custom
                      analog modular synthesizers, acoustic tape delays, and prepared acoustic instruments to evoke
                      unsettling psychological truths.
                    </p>
                    <p>
                      His soundtrack for "The Horizon Divide" garnered praise across film festival circuits for its
                      bold refusal of cinematic clichés and its haunting integration of acoustic space.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-ink font-normal mb-4 not-prose">
                      International Pedagogy & Mentorship
                    </h3>
                    <p>
                      Recognizing the transformative power of education, Michael Bakare is deeply committed to
                      mentoring emerging composers, orchestrators, and directors. Through his published treatises,
                      online masterclass curricula, and university guest lectures, he provides an uncompromising,
                      practical guide to voice leading, score engraving, and creative entrepreneurship.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-border-subtle">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-ink text-canvas px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors"
              >
                Inquire for Collaboration
              </Link>
              <Link
                to="/works"
                className="inline-flex items-center gap-2 text-ink border border-border-subtle hover:border-ink px-8 py-4 rounded-full font-medium transition-colors"
              >
                Explore Works Archive
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Artistic Philosophy */}
      <section className="bg-surface py-28 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 block">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-ink leading-tight">
              Artistic Philosophy & Creative Creed
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artisticCreed.map((creed, idx) => {
              const IconComp = creed.icon;
              return (
                <div
                  key={idx}
                  className="bg-canvas border border-border-subtle rounded-3xl p-8 hover:border-ink transition-colors shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center text-ink mb-6">
                    <IconComp size={22} />
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-3 font-medium">{creed.title}</h3>
                  <p className="text-xs text-ink-muted font-light leading-relaxed">{creed.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline / Legacy Section */}
      <section className="bg-ink text-canvas py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-4">
              Chronology & Legacy
            </h2>
            <h3 className="font-serif text-3xl md:text-5xl leading-tight">
              Career Milestones & Institutional Honors
            </h3>
          </div>

          <StaggerContainer className="border-t border-zinc-800">
            {timelineItems.map((item) => (
              <StaggerItem
                key={item.id}
                className="grid md:grid-cols-12 gap-8 py-10 border-b border-zinc-800"
              >
                <div className="md:col-span-3">
                  <p className="font-serif text-2xl text-zinc-200">{item.year}</p>
                  <p className="text-xs uppercase tracking-widest font-semibold text-zinc-400 mt-2">
                    {item.category}
                  </p>
                </div>
                <div className="md:col-span-9">
                  <h4 className="text-2xl mb-3 font-medium text-canvas">{item.title}</h4>
                  <p className="text-zinc-400 font-light leading-relaxed max-w-3xl text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
