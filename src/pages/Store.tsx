import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link, useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { Search, ShoppingBag, Check, BookOpen, Music, Disc, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'art-of-orchestration-handbook',
    title: 'The Art of Orchestration & Modern Scoring Handbook',
    description:
      'A comprehensive 180-page digital manual detailing harmonic modulation, instrument ranges, acoustic balance, and contemporary hybrid orchestration workflows.',
    price: 49.0,
    currency: 'USD',
    category: 'Books',
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    features: [
      '180 Pages of in-depth scoring theory and harmonic analysis',
      'Downloadable orchestral score excerpts & audio examples',
      'Print-ready vector PDF & ePub versions with lifetime updates',
    ],
    previewUrl: '/audio/celestial-echoes-preview.wav',
    status: 'active',
  },
  {
    id: 'symphonic-suite-study-score',
    title: 'Symphonic Suite No. 1: Full Conductor’s Study Score',
    description:
      'The complete master conductor’s study score for Michael Bakare’s acclaimed 6-movement orchestral piece. High-resolution engraving with performance commentary.',
    price: 35.0,
    currency: 'USD',
    category: 'Sheet Music',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    features: [
      'Complete 140-page master conductor score engraved in Dorico',
      'Comprehensive instrumentation notes & rehearsal letters',
      'Instant secure vector PDF download with printing authorization',
    ],
    previewUrl: '/audio/celestial-echoes-preview.wav',
    status: 'active',
  },
  {
    id: 'film-scoring-stems-midi-pack',
    title: 'Cinematic Stems, Textures & MIDI Repertoire Pack',
    description:
      'Exclusive production assets extracted from original studio recordings: orchestral string stems, custom modular synth pulses, analog textures, and unquantized piano MIDI.',
    price: 89.0,
    currency: 'USD',
    category: 'Digital Assets',
    coverImageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000',
    features: [
      'Over 2.4GB of 24-bit 48kHz WAV audio stems',
      'Over 50 unquantized expressive concert grand piano MIDI files',
      'Royalty-free commercial synchronization license included',
    ],
    previewUrl: '/audio/horizon-divide-preview.wav',
    status: 'active',
  },
  {
    id: 'nocturnes-solo-piano-collection',
    title: 'Nocturnes for Solo Grand Piano: Complete 12-Piece Collection',
    description:
      'The definitive published sheet music edition containing all twelve contemplative piano pieces from the acclaimed Nocturnes recording, with pedal markings and fingering.',
    price: 29.0,
    currency: 'USD',
    category: 'Sheet Music',
    coverImageUrl: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?auto=format&fit=crop&q=80&w=1000',
    features: [
      '84 Pages of pristine engraved piano sheet music',
      'Detailed performance notes, pedal guidelines, and fingering by Michael Bakare',
      'Reference MP3 listening tracks included with purchase',
    ],
    previewUrl: '/audio/nocturnes-preview.wav',
    status: 'active',
  },
  {
    id: 'harmonic-architecture-masterclass',
    title: 'Harmonic Architecture Masterclass: 6-Hour Video Course & Project Files',
    description:
      'An exhaustive, master-level video curriculum exploring modal voice leading, orchestral counterpoint, and emotional narrative scoring. Includes DAW project sessions.',
    price: 129.0,
    currency: 'USD',
    category: 'Masterclasses',
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    features: [
      '6 Hours of 4K masterclass video lectures with piano demonstrations',
      'Downloadable Logic Pro & Cubase orchestral template sessions',
      'Full analysis of feature film cues and symphonic sketches',
    ],
    previewUrl: '/audio/chamber-fantasy-preview.wav',
    status: 'active',
  },
  {
    id: 'felt-piano-ambient-sample-library',
    title: 'Bespoke Felt Piano & Ambient Textures Sample Library',
    description:
      'Intimately recorded inside a resonant stone monastery: felt-damped grand piano multisamples, sympathetic string resonances, and custom granular atmospheric soundscapes.',
    price: 65.0,
    currency: 'USD',
    category: 'Digital Assets',
    coverImageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000',
    features: [
      'Decent Sampler & Kontakt 6+ instrument formats',
      '5 Velocity layers and 3 round robins per note',
      'Dedicated pedal noise, key release, and tape flutter controls',
    ],
    previewUrl: '/audio/sample-library-preview.wav',
    status: 'active',
  },
];

export default function Store() {
  const easeCurve = [0.22, 1, 0.36, 1];
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderSuccessId = searchParams.get('orderSuccess');

  const { addToCart, items } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Real-time listener for Store products uploaded in Admin
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const liveProducts = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            const statusStr = String(d.status || '').toLowerCase();
            return {
              id: doc.id,
              ...d,
              status: (statusStr === 'draft' ? 'draft' : 'active') as 'active' | 'draft',
            } as Product;
          })
          .filter((p) => p.status !== 'draft');

        if (liveProducts.length > 0) {
          setProducts(liveProducts);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching live products:', error);
        setProducts(DEFAULT_PRODUCTS);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    return ['All', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      return 0;
    });

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id!]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id!]: false }));
    }, 2000);
  };

  return (
    <div className="w-full pb-32">
      <SEO
        title="Store & Publications | Michael Bakare"
        description="Acquire published scores, masterclasses, books, and exclusive audio production assets by Michael Bakare."
        url="/store"
      />

      {/* Order Success Banner if returned from Selar checkout */}
      {orderSuccessId && (
        <div className="bg-emerald-950 text-emerald-200 px-6 py-4 text-center text-sm font-medium border-b border-emerald-800">
          Payment confirmed! Your order reference is <span className="font-mono text-white">{orderSuccessId}</span>. Check your email for secure digital downloads.
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeCurve }}
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 block">
              Digital Publishing & Store
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight text-ink mb-8">
              Scores, treatises & digital assets.
            </h1>
            <p className="text-lg md:text-xl text-ink-muted mb-12 max-w-2xl leading-relaxed font-light">
              Acquire archival conductor scores, masterclass video courses, scoring handbooks, and bespoke
              production sound libraries directly from Michael Bakare’s publishing studio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls & Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border-subtle">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-ink text-canvas shadow-sm'
                    : 'bg-surface text-ink-muted hover:text-ink hover:bg-zinc-100 border border-border-subtle'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publications..."
                className="w-full bg-surface border border-border-subtle rounded-full pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-ink transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface border border-border-subtle rounded-full px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-ink outline-none cursor-pointer"
            >
              <option value="newest">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-zinc-200 aspect-[4/3] rounded-2xl mb-6"></div>
                <div className="h-6 bg-zinc-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-border-subtle rounded-2xl bg-canvas">
            <h3 className="font-serif text-2xl mb-4 text-ink">No products found</h3>
            <p className="text-ink-muted font-light mb-6">There are no store publications matching your criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="text-xs uppercase tracking-widest font-semibold pb-1 border-b border-ink text-ink hover:text-ink-muted transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product) => {
              const isAdded = addedIds[product.id!];
              const isInCart = items.some((i) => i.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-surface rounded-3xl p-5 border border-border-subtle hover:border-ink/40 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Thumbnail */}
                    <Link to={`/store/${product.id}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 mb-5 border border-border-subtle">
                      {product.coverImageUrl ? (
                        <ResponsiveImage
                          loading="lazy"
                          src={product.coverImageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted font-serif text-sm bg-gradient-to-br from-zinc-100 to-zinc-200">
                          <BookOpen size={28} className="opacity-40 mb-2" />
                          <span>{product.title}</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-canvas/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-border-subtle text-ink shadow-sm">
                        {product.category}
                      </div>
                    </Link>

                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <Link to={`/store/${product.id}`} className="hover:underline flex-1">
                        <h2 className="font-serif text-2xl text-ink leading-snug">
                          {product.title}
                        </h2>
                      </Link>
                      <span className="font-serif text-xl text-ink font-semibold flex-shrink-0">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {product.description && (
                      <p className="text-xs text-ink-muted font-light leading-relaxed line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    )}

                    {/* Features Snippet */}
                    {product.features && product.features.length > 0 && (
                      <ul className="space-y-1 mb-5 pt-3 border-t border-border-subtle">
                        {product.features.slice(0, 2).map((feat, fIdx) => (
                          <li key={fIdx} className="text-[11px] text-ink-muted font-light flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-ink flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border-subtle flex items-center gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-ink text-canvas hover:bg-zinc-800'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Add to Cart
                        </>
                      )}
                    </button>
                    <Link
                      to={`/store/${product.id}`}
                      className="px-4 py-3 rounded-full border border-border-subtle text-xs uppercase tracking-wider font-semibold text-ink hover:border-ink transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Assurance / Secure Delivery Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mt-28">
        <div className="bg-ink text-canvas rounded-3xl p-8 sm:p-12 grid sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-medium text-canvas">Instant Digital Delivery</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Upon verified payment through Selar, receive automated encrypted download links directly to your inbox.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-medium text-canvas">Multi-Currency Global Checkout</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Seamlessly settle orders in USD, GBP, EUR, or NGN with major credit cards, Apple Pay, and bank transfer.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-medium text-canvas">Archival Print Quality</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              All sheet music and conductor study scores are vector-engraved and authorized for high-resolution printing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
