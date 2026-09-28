import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import Breadcrumbs from '../components/Breadcrumbs';
import NavigationProgress from '../components/NavigationProgress';
import WhatsAppWidget from '../components/WhatsAppWidget';
import BackToTop from '../components/BackToTop';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';
import NewsletterForm from '../components/NewsletterForm';
import PageTransition from '../components/PageTransition';

export default function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { cartCount } = useCart();
  const location = useLocation();

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Works', href: '/works' },
    { name: 'Services', href: '/services' },
    { name: 'Store', href: '/store' },
    { name: 'Media', href: '/media' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);
  const navigate = useNavigate();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if focusing an input/textarea
      const activeElement = document.activeElement;
      if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
        return;
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'h': e.preventDefault(); navigate('/'); break;
          case 'a': e.preventDefault(); navigate('/about'); break;
          case 'w': e.preventDefault(); navigate('/works'); break;
          case 's': e.preventDefault(); navigate('/services'); break;
          case 't': e.preventDefault(); navigate('/store'); break;
          case 'm': e.preventDefault(); navigate('/media'); break;
          case 'c': e.preventDefault(); navigate('/contact'); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <AudioPlayerProvider>
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-zinc-200 flex flex-col">
      <NavigationProgress />
      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled ? "bg-canvas/85 backdrop-blur-xl border-b border-border-subtle py-0" : "bg-transparent border-b border-transparent py-3"}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-tight font-medium" onClick={closeMenu}>
            Michael Bakare.
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {navigation.map((item) => {
              // Ensure exact match for Home if we added it, but here we just have prefix matches.
              // To avoid /works highlighting on /works/123 if we didn't want to, we'll keep it as is, 
              // but actually let's make it cleaner.
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative group text-sm tracking-wide py-1"
                >
                  <span className={`transition-colors duration-300 ${isActive ? 'text-ink font-medium' : 'text-ink-muted group-hover:text-ink'}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
            <div className="flex items-center gap-4 ml-4">
              <Link to="/cart" className="text-ink hover:text-ink-muted transition-colors relative" aria-label={`Shopping Cart, ${cartCount} items`}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-ink text-canvas text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link
                to="/contact"
                className="text-sm font-medium tracking-wide bg-ink text-canvas px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors"
              >
                Request Quote
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle & Cart */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="text-ink relative" onClick={closeMenu} aria-label={`Shopping Cart, ${cartCount} items`}>
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-ink text-canvas text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-ink"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-canvas/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col"
          >
            <nav className="flex flex-col gap-8 text-center mt-12">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={item.href}
                    className="text-4xl font-serif text-ink tracking-tight"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: navigation.length * 0.05, duration: 0.4 }}
                className="mt-8"
              >
                <Link
                  to="/contact"
                  className="inline-block text-lg font-medium bg-ink text-canvas px-10 py-4 rounded-full shadow-lg"
                  onClick={closeMenu}
                >
                  Request Quote
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 flex-grow">
        <Breadcrumbs />
        <AnimatePresence mode="wait">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle pt-24 pb-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <div className="max-w-2xl">
            <h4 className="font-serif text-3xl md:text-4xl text-ink mb-4">Join the Archive</h4>
            <p className="text-ink-muted mb-8 font-light text-lg">Subscribe to receive exclusive insights, new publication alerts, and priority access to masterclasses.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-2xl tracking-tight font-medium mb-4 block">
              Michael Bakare.
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed font-light">
              Digital publishing, elevated services, and professional works.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-ink">Explore</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li><Link to="/about" className="hover:text-ink transition-colors">About & Legacy</Link></li>
              <li><Link to="/works" className="hover:text-ink transition-colors">Portfolio Hub</Link></li>
              <li><Link to="/services" className="hover:text-ink transition-colors">Professional Services</Link></li>
              <li><Link to="/store" className="hover:text-ink transition-colors">Digital Store</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-ink">Legal</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li><Link to="/legal/terms" className="hover:text-ink transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/refunds" className="hover:text-ink transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-ink">Connect</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li><a href="#" className="hover:text-ink transition-colors" aria-label="Visit LinkedIn profile" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="#" className="hover:text-ink transition-colors" aria-label="Visit Twitter profile" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="#" className="hover:text-ink transition-colors" aria-label="Visit Instagram profile" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-16 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ink-muted text-xs font-light">
            © {new Date().getFullYear()} Michael Bakare. All rights reserved.
          </p>
          <Link to="/admin" className="text-xs text-ink-muted hover:text-ink transition-colors">Admin Portal</Link>
        </div>
      </footer>
      <BackToTop />
      <WhatsAppWidget />
      <GlobalAudioPlayer />
    </div>
    </AudioPlayerProvider>
  );
}
