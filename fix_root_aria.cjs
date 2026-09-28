const fs = require('fs');

const file = 'src/layouts/RootLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<button\n              className="p-2 text-ink"\n              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}',
  '<button\n              className="p-2 text-ink"\n              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}\n              aria-label="Toggle menu"\n              aria-expanded={isMobileMenuOpen}'
);
content = content.replace(
  '<Link to="/cart" className="relative p-2 text-ink">',
  '<Link to="/cart" className="relative p-2 text-ink" aria-label="Shopping Cart">'
);

fs.writeFileSync(file, content);
