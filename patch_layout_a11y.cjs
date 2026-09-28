const fs = require('fs');
let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

// 1. Add useNavigate and useEffect imports
if (!layout.includes('useNavigate')) {
  layout = layout.replace(
    "import { Outlet, Link, useLocation } from 'react-router-dom';",
    "import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';"
  );
}

if (!layout.includes('useEffect')) {
  layout = layout.replace(
    "import { useState } from 'react';",
    "import { useState, useEffect } from 'react';"
  );
}

// 2. Add keyboard shortcuts hook
if (!layout.includes('handleKeyDown')) {
  layout = layout.replace(
    'const closeMenu = () => setIsMobileMenuOpen(false);',
    `const closeMenu = () => setIsMobileMenuOpen(false);
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
  }, [navigate]);`
  );
}

// 3. Add ARIA labels to Desktop Cart
layout = layout.replace(
  '<Link to="/cart" className="text-ink hover:text-ink-muted transition-colors relative">',
  '<Link to="/cart" className="text-ink hover:text-ink-muted transition-colors relative" aria-label={`Shopping Cart, ${cartCount} items`}>'
);

// 4. Add ARIA labels to Mobile Cart
layout = layout.replace(
  '<Link to="/cart" className="text-ink relative" onClick={closeMenu}>',
  '<Link to="/cart" className="text-ink relative" onClick={closeMenu} aria-label={`Shopping Cart, ${cartCount} items`}>'
);

// 5. Update Footer social links with ARIA labels
layout = layout.replace(
  '<li><a href="#" className="hover:text-ink transition-colors">LinkedIn</a></li>',
  '<li><a href="#" className="hover:text-ink transition-colors" aria-label="Visit LinkedIn profile" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>'
);
layout = layout.replace(
  '<li><a href="#" className="hover:text-ink transition-colors">Twitter</a></li>',
  '<li><a href="#" className="hover:text-ink transition-colors" aria-label="Visit Twitter profile" target="_blank" rel="noopener noreferrer">Twitter</a></li>'
);
layout = layout.replace(
  '<li><a href="#" className="hover:text-ink transition-colors">Instagram</a></li>',
  '<li><a href="#" className="hover:text-ink transition-colors" aria-label="Visit Instagram profile" target="_blank" rel="noopener noreferrer">Instagram</a></li>'
);

fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
console.log('RootLayout patched with accessibility updates');
