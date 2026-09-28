import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null; // Don't show breadcrumbs on home page
  }

  // Format breadcrumb text (e.g. "order-status" -> "Order Status", "store" -> "Store")
  const formatText = (text: string) => {
    // If it's a Firestore ID (usually > 15 chars and mixed case), we could display something generic like "Details" 
    // or truncate it, but let's just show "Details" if it's super long.
    if (text.length > 18) return 'Details';
    
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="w-full bg-canvas/80 backdrop-blur-sm border-b border-border-subtle z-40 sticky top-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <Link to="/" className="text-xs font-medium text-ink-muted hover:text-ink transition-colors">
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <motion.div 
              initial={{ opacity: 0, x: -5 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={to} 
              className="flex items-center gap-2"
            >
              <ChevronRight size={14} className="text-zinc-400" />
              {isLast ? (
                <span className="text-xs font-semibold text-ink" aria-current="page">
                  {formatText(value)}
                </span>
              ) : (
                <Link to={to} className="text-xs font-medium text-ink-muted hover:text-ink transition-colors">
                  {formatText(value)}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
