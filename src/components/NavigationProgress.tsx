import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function NavigationProgress() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset and start loading on route change
    setIsNavigating(true);
    setProgress(30);

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(70), 150);
    const timer2 = setTimeout(() => setProgress(100), 400);
    const timer3 = setTimeout(() => setIsNavigating(false), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-ink z-[9999] origin-left"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: progress / 100, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
}
