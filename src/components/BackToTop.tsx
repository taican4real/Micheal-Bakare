import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[88px] right-6 z-50"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex items-center justify-center w-[52px] h-[52px] bg-canvas border border-border-subtle text-ink rounded-full shadow-lg hover:bg-zinc-100 transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <ArrowUp size={22} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
