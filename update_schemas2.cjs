const fs = require('fs');

// Update WorkDetail.tsx to support MusicComposition
let work = fs.readFileSync('src/pages/WorkDetail.tsx', 'utf8');
work = work.replace('"@type": "CreativeWork"', '"@type": work.category === "Compositions" ? "MusicComposition" : "CreativeWork"');
fs.writeFileSync('src/pages/WorkDetail.tsx', work);

// Update ProductDetail.tsx to support Book
let prod = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');
prod = prod.replace('"@type": "Product"', '"@type": product.category === "E-Books" || product.category === "Books" ? "Book" : "Product"');
fs.writeFileSync('src/pages/ProductDetail.tsx', prod);
