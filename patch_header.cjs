const fs = require('fs');

let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

// 1. Add state for scrolling
if (!layout.includes('isScrolled')) {
  layout = layout.replace(
    'const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);',
    `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);`
  );
}

// 2. Update Header class for shrink/blur effect
layout = layout.replace(
  '<header className="fixed top-0 w-full bg-canvas/80 backdrop-blur-md z-50 border-b border-border-subtle transition-colors duration-300">',
  '<header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled ? "bg-canvas/85 backdrop-blur-xl border-b border-border-subtle py-0" : "bg-transparent border-b border-transparent py-3"}`}>'
);

// 3. Update Nav Links with Framer Motion LayoutId for active dot
const oldNavMap = `{navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={\`text-sm tracking-wide transition-colors \${
                    isActive ? 'text-ink font-medium' : 'text-ink-muted hover:text-ink'
                  }\`}
                >
                  {item.name}
                </Link>
              );
            })}`;

const newNavMap = `{navigation.map((item) => {
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
                  <span className={\`transition-colors duration-300 \${isActive ? 'text-ink font-medium' : 'text-ink-muted group-hover:text-ink'}\`}>
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
            })}`;

layout = layout.replace(oldNavMap, newNavMap);

// 4. Update Mobile menu staggered animations
const oldMobileMenu = `<AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-canvas pt-24 px-6 md:hidden flex flex-col"
          >
            <nav className="flex flex-col gap-6 text-center mt-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-3xl font-serif text-ink"
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-8 text-lg font-medium bg-ink text-canvas px-8 py-4 rounded-full mx-auto w-full max-w-sm"
                onClick={closeMenu}
              >
                Request Quote
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>`;

const newMobileMenu = `<AnimatePresence>
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
      </AnimatePresence>`;

layout = layout.replace(oldMobileMenu, newMobileMenu);

fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
console.log('Header successfully upgraded');
