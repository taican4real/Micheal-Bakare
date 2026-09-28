const fs = require('fs');
let layoutStr = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

// Add import
layoutStr = layoutStr.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useCart } from '../context/CartContext';");

// Use cart
layoutStr = layoutStr.replace("const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);", "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n  const { cartCount } = useCart();");

// Replace desktop cart icon
const desktopCartTarget = `
              <Link to="/store/cart" className="text-ink hover:text-ink-muted transition-colors relative">
                <ShoppingBag size={20} />
                {/* Badge placeholder */}
                {/* <span className="absolute -top-1 -right-1 bg-ink text-canvas text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span> */}
              </Link>
`;

const desktopCartReplacement = `
              <Link to="/cart" className="text-ink hover:text-ink-muted transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-ink text-canvas text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
`;

layoutStr = layoutStr.replace(desktopCartTarget, desktopCartReplacement);

// Replace mobile cart icon
const mobileCartTarget = `
            <Link to="/store/cart" className="text-ink" onClick={closeMenu}>
              <ShoppingBag size={24} />
            </Link>
`;

const mobileCartReplacement = `
            <Link to="/cart" className="text-ink relative" onClick={closeMenu}>
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-ink text-canvas text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
`;

layoutStr = layoutStr.replace(mobileCartTarget, mobileCartReplacement);

fs.writeFileSync('src/layouts/RootLayout.tsx', layoutStr);
