import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Product } from '../types';
import { ArrowLeft, Check, ShoppingBag, Play, Pause, FileText, BookOpen, ShieldCheck, Download, Music } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import ResponsiveImage from '../components/ResponsiveImage';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const DEFAULT_PRODUCTS_MAP: Record<string, Partial<Product>> = {
  'art-of-orchestration-handbook': {
    id: 'art-of-orchestration-handbook',
    title: 'The Art of Orchestration & Modern Scoring Handbook',
    description: `A comprehensive 180-page digital manual detailing harmonic modulation, instrument ranges, acoustic balance, and contemporary hybrid orchestration workflows.

Authored over four years of professional symphonic and cinematic scoring commissions, this treatise provides an uncompromising, practical blueprint for composers, orchestrators, and producers.

Includes detailed score excerpts from Bakare's Symphonic Suites, counterpoint exercises, dynamic balance charts, and specific guidelines for recording acoustic strings alongside analog synthesis.`,
    price: 49.0,
    currency: 'USD',
    category: 'Books',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    features: [
      '180 Pages of in-depth scoring theory, voice leading & harmonic analysis',
      'Downloadable high-resolution orchestral score excerpts & audio examples',
      'Print-ready vector PDF & ePub versions with lifetime free revisions',
      'Full orchestration frequency distribution and acoustic balance cheat-sheets',
    ],
    metadata: {
      'Format': 'Vector PDF & ePub (Interactive)',
      'Page Count': '180 Pages',
      'Language': 'English',
      'License': 'Personal & Educational Single-User License',
      'Delivery': 'Instant Encrypted Download Link via Email',
    },
    previewUrl: '/audio/celestial-echoes-preview.wav',
    status: 'active',
  },
  'symphonic-suite-study-score': {
    id: 'symphonic-suite-study-score',
    title: 'Symphonic Suite No. 1: Full Conductor’s Study Score',
    description: `The complete master conductor’s study score for Michael Bakare’s acclaimed 6-movement orchestral work "Celestial Echoes".

Engraved to the highest international publishing standards with rehearsal letters, metronome indications, comprehensive instrumentation lists, and historical performance commentary.

Authorized for individual study, conservatory analysis, and archival reference.`,
    price: 35.0,
    currency: 'USD',
    category: 'Sheet Music',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    features: [
      'Complete 140-page master conductor score engraved in Dorico',
      'Comprehensive instrumentation notes, bar numbers & rehearsal letters',
      'Instant secure vector PDF download with personal study printing rights',
      'High-resolution full orchestral layout (3 Flutes to Strings 16/14/12/10/8)',
    ],
    metadata: {
      'Format': 'Archival Vector PDF (A3 / Tabloid optimized)',
      'Page Count': '140 Pages',
      'Engraving': 'Dorico Pro 5 Vector',
      'License': 'Single-User Study & Analysis License',
      'Delivery': 'Instant Download',
    },
    previewUrl: '/audio/celestial-echoes-preview.wav',
    status: 'active',
  },
  'film-scoring-stems-midi-pack': {
    id: 'film-scoring-stems-midi-pack',
    title: 'Cinematic Stems, Textures & MIDI Repertoire Pack',
    description: `Exclusive production assets extracted from original studio scoring sessions: orchestral string stems, custom modular synth pulses, analog textures, and unquantized concert grand piano MIDI.

Created specifically for media composers, electronic music producers, and game audio directors seeking genuine acoustic depth paired with cutting-edge sound design.`,
    price: 89.0,
    currency: 'USD',
    category: 'Digital Assets',
    coverImageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    features: [
      'Over 2.4GB of uncompressed 24-bit 48kHz WAV audio stems',
      'Over 50 unquantized expressive concert grand piano MIDI performance files',
      '100% Royalty-Free commercial synchronization license included for film, TV & games',
      'Custom modular synth drones, granular sweeps, and sub-bass impacts',
    ],
    metadata: {
      'Audio Format': '24-bit / 48kHz Stereo WAV',
      'File Size': '2.4 GB (Delivered as high-speed ZIP archive)',
      'Compatibility': 'Logic, Cubase, Pro Tools, Ableton, FL Studio, Reaper',
      'License': 'Commercial Sync & Derivative Production License (Royalty-Free)',
    },
    previewUrl: '/audio/horizon-divide-preview.wav',
    status: 'active',
  },
  'nocturnes-solo-piano-collection': {
    id: 'nocturnes-solo-piano-collection',
    title: 'Nocturnes for Solo Grand Piano: Complete 12-Piece Collection',
    description: `The definitive published sheet music edition containing all twelve contemplative piano pieces from Michael Bakare’s celebrated Nocturnes recordings.

Includes pedal markings, dynamic subtleties, fingering suggestions, and poetic preface notes for each movement. Suitable for intermediate to advanced concert pianists.`,
    price: 29.0,
    currency: 'USD',
    category: 'Sheet Music',
    coverImageUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1000',
    features: [
      '84 Pages of pristine engraved piano sheet music',
      'Detailed performance notes, pedal guidelines, and fingering by Michael Bakare',
      'Reference audio tracks included for phrasing and rubato study',
    ],
    metadata: {
      'Format': 'Vector Sheet Music PDF',
      'Page Count': '84 Pages',
      'Difficulty': 'Intermediate to Advanced',
      'License': 'Personal Performance & Repertoire Study License',
    },
    previewUrl: '/audio/nocturnes-preview.wav',
    status: 'active',
  },
  'harmonic-architecture-masterclass': {
    id: 'harmonic-architecture-masterclass',
    title: 'Harmonic Architecture Masterclass: 6-Hour Video Course & Project Files',
    description: `An exhaustive, master-level video curriculum exploring modal voice leading, orchestral counterpoint, and emotional narrative scoring.

Michael Bakare walks through his exact composition methodology step-by-step at the grand piano and inside modern digital audio workstations, breaking down cues from feature film soundtracks and symphonic commissions.`,
    price: 129.0,
    currency: 'USD',
    category: 'Masterclasses',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    features: [
      '6 Hours of 4K masterclass video lectures with live grand piano demonstrations',
      'Downloadable Logic Pro & Cubase orchestral template sessions with track routing',
      'Full analysis of feature film cues and symphonic sketches',
      'Lifetime streaming access and downloadable offline video lessons',
    ],
    metadata: {
      'Video Format': '4K UHD Streaming + 1080p Offline Downloads',
      'Duration': '6 Hours, 14 Modules',
      'Includes': 'DAW Session Templates, MIDI Files, Score Workbooks',
      'Access': 'Lifetime Unlimited Access',
    },
    previewUrl: '/audio/chamber-fantasy-preview.wav',
    status: 'active',
  },
  'felt-piano-ambient-sample-library': {
    id: 'felt-piano-ambient-sample-library',
    title: 'Bespoke Felt Piano & Ambient Textures Sample Library',
    description: `Intimately recorded inside a resonant stone monastery: felt-damped grand piano multisamples, sympathetic string resonances, and custom granular atmospheric soundscapes.

Designed for composers who require an immediate, tactile, emotional piano tone that sits effortlessly underneath cinematic dialogue or intimate acoustic records.`,
    price: 65.0,
    currency: 'USD',
    category: 'Digital Assets',
    coverImageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000',
    features: [
      'Decent Sampler & Kontakt 6+ native instrument formats included',
      '5 Velocity layers and 3 round robins per note across full 88-key range',
      'Dedicated pedal noise, key release, tape flutter, and monastery room mic controls',
      'Royalty-free for all commercial music and media releases',
    ],
    metadata: {
      'Sampler Formats': 'Decent Sampler (Free Player) & Native Instruments Kontakt 6+',
      'Sample Specs': '24-bit / 48kHz NCW / WAV Samples (1.8 GB)',
      'Microphones': 'Dual Neumann M49 Close + Coles 4038 Stereo Room Pair',
      'License': 'Commercial Music Production License',
    },
    previewUrl: '/audio/sample-library-preview.wav',
    status: 'active',
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const easeCurve = [0.22, 1, 0.36, 1];
  const { addToCart, items } = useCart();
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        setError(null);

        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(prodData);

          // Related by category
          try {
            const q = query(
              collection(db, 'products'),
              where('category', '==', prodData.category),
              limit(4)
            );
            const relatedSnap = await getDocs(q);
            const relatedData = relatedSnap.docs
              .map((d) => ({ id: d.id, ...d.data() } as Product))
              .filter((d) => d.id !== prodData.id)
              .slice(0, 3);
            setRelatedProducts(relatedData);
          } catch (relErr) {
            console.error('Error fetching related products:', relErr);
          }
        } else if (DEFAULT_PRODUCTS_MAP[id]) {
          const item = DEFAULT_PRODUCTS_MAP[id] as Product;
          setProduct(item);

          const others = Object.values(DEFAULT_PRODUCTS_MAP)
            .filter((p) => p.id !== id)
            .slice(0, 3) as Product[];
          setRelatedProducts(others);
        } else {
          // Fallback to first product
          const firstKey = Object.keys(DEFAULT_PRODUCTS_MAP)[0];
          setProduct(DEFAULT_PRODUCTS_MAP[firstKey] as Product);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        if (id && DEFAULT_PRODUCTS_MAP[id]) {
          setProduct(DEFAULT_PRODUCTS_MAP[id] as Product);
        } else {
          setError('Product details currently unavailable.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAudioPreview = () => {
    if (!product) return;
    const stream = product.previewUrl || '/audio/celestial-echoes-preview.wav';
    playTrack({
      title: product.title,
      artist: 'Michael Bakare Publications',
      url: stream,
      coverUrl: product.coverImageUrl,
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
        <div className="w-12 h-12 border-2 border-zinc-200 border-t-ink rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest font-semibold text-ink-muted">Accessing Store Item...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-canvas">
        <h1 className="font-serif text-3xl mb-4 text-ink">Publication Unavailable</h1>
        <p className="text-ink-muted mb-8 max-w-md">{error || 'This store publication is not available.'}</p>
        <Link to="/store" className="bg-ink text-canvas px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors">
          Return to Store
        </Link>
      </div>
    );
  }

  const currencySymbol = product.currency === 'USD' ? '$' : product.currency === 'GBP' ? '£' : product.currency === 'EUR' ? '€' : '₦';
  const cartItem = items.find((item) => item.product.id === product.id);
  const isThisAudioPlaying = product.previewUrl && currentTrack?.url === product.previewUrl && isPlaying;

  return (
    <div className="w-full pb-32 bg-canvas">
      <SEO
        title={`${product.title} | Michael Bakare Store`}
        description={product.description ? product.description.slice(0, 160) : `Official publication by Michael Bakare.`}
        url={`/store/${product.id}`}
        type="product"
      />

      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 pb-6">
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-ink-muted hover:text-ink transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Store Catalogue
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-4">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Product Cover Artwork & Audio Audition */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: easeCurve }}
          >
            <div className="aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden border border-border-subtle sticky top-32 shadow-lg relative group">
              {product.coverImageUrl ? (
                <ResponsiveImage
                  src={product.coverImageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted font-serif p-8 text-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                  <BookOpen size={48} className="opacity-30 mb-4" />
                  <h3 className="font-serif text-2xl text-ink font-normal">{product.title}</h3>
                </div>
              )}

              {/* Category Floating Tag */}
              <div className="absolute top-4 left-4 bg-canvas/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-border-subtle text-ink shadow-sm">
                {product.category}
              </div>

              {/* Audio Audition Quick Bar */}
              {product.previewUrl && (
                <div className="absolute bottom-6 left-6 right-6 bg-canvas/95 backdrop-blur-md border border-border-subtle p-4 rounded-2xl flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAudioPreview}
                      className="w-12 h-12 rounded-full bg-ink text-canvas flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      aria-label={isThisAudioPlaying ? 'Pause Audio Preview' : 'Play Audio Preview'}
                    >
                      {isThisAudioPlaying ? (
                        <Pause size={18} fill="currentColor" />
                      ) : (
                        <Play size={18} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">
                        {isThisAudioPlaying ? 'Playing Audio Excerpt' : 'Audition Audio Sample'}
                      </p>
                      <p className="font-serif text-sm text-ink font-medium truncate max-w-[170px]">
                        Reference Preview
                      </p>
                    </div>
                  </div>
                  <Music size={16} className="text-ink-muted hidden sm:block" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Overview & Purchase */}
          <motion.div
            className="lg:col-span-7 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeCurve }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted">
                {product.category}
              </span>
              <span className="text-xs text-ink-muted">•</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> Official Studio Release
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-ink mb-6">
              {product.title}
            </h1>

            {/* Price Header */}
            <div className="flex items-baseline gap-4 mb-8 pb-6 border-b border-border-subtle">
              <span className="font-serif text-4xl text-ink font-medium">
                {currencySymbol}{product.price.toFixed(2)}
              </span>
              <span className="text-xs text-ink-muted uppercase tracking-wider font-semibold">
                USD / Multi-Currency Supported
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-zinc prose-lg font-light leading-relaxed text-ink-muted max-w-none mb-10">
              {product.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {/* What's Included Feature List */}
            {product.features && product.features.length > 0 && (
              <div className="mb-10 p-6 sm:p-8 bg-surface rounded-3xl border border-border-subtle">
                <h3 className="font-serif text-xl text-ink mb-5 flex items-center gap-2 font-medium">
                  <Check size={18} className="text-emerald-700" /> What's Included in this Edition
                </h3>
                <ul className="space-y-3.5">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-ink-muted font-light leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications Table */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div className="mb-10 bg-surface/50 border border-border-subtle rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key} className="flex flex-col border-b border-border-subtle pb-2">
                      <span className="text-ink-muted text-[10px] uppercase tracking-wider font-semibold mb-0.5">{key}</span>
                      <span className="text-ink font-medium font-mono">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart / Checkout Controls */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-medium text-sm uppercase tracking-wider transition-all shadow-md ${
                    justAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-ink text-canvas hover:bg-zinc-800'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={18} /> Added to Shopping Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Cart — {currencySymbol}{product.price.toFixed(2)}
                    </>
                  )}
                </button>

                {cartItem && (
                  <Link
                    to="/cart"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface border border-border-subtle text-ink px-8 py-5 rounded-full font-medium text-sm uppercase tracking-wider hover:border-ink transition-colors"
                  >
                    View Cart ({cartItem.quantity})
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-ink-muted font-light pt-2">
                <span className="flex items-center gap-1.5">
                  <Download size={14} /> Instant automated digital fulfillment
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} /> 256-bit encrypted checkout via Selar
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-border-subtle">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-ink">Related Publications</h2>
              <Link to="/store" className="text-xs uppercase tracking-widest font-semibold text-ink hover:text-ink-muted">
                View All Publications
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/store/${rel.id}`}
                  className="group block bg-surface rounded-2xl overflow-hidden border border-border-subtle p-4 hover:border-ink transition-colors"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-zinc-100">
                    {rel.coverImageUrl && (
                      <ResponsiveImage
                        src={rel.coverImageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-ink-muted block mb-1">
                    {rel.category}
                  </span>
                  <h3 className="font-serif text-lg text-ink group-hover:underline line-clamp-1 mb-1">
                    {rel.title}
                  </h3>
                  <p className="font-serif text-base text-ink font-semibold">
                    ${rel.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
