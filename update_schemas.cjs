const fs = require('fs');

// Update ProductDetail.tsx
let prod = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');
if (!prod.includes("BreadcrumbList")) {
  prod = prod.replace('"name": "Michael Bakare"\n            }', `"name": "Michael Bakare"\n            }\n          },\n          {\n            "@context": "https://schema.org",\n            "@type": "BreadcrumbList",\n            "itemListElement": [\n              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://michaelbakare.com/" },\n              { "@type": "ListItem", "position": 2, "name": "Store", "item": "https://michaelbakare.com/store" },\n              { "@type": "ListItem", "position": 3, "name": product.name, "item": \`https://michaelbakare.com/store/\${product.id}\` }\n            ]\n          }`);
  fs.writeFileSync('src/pages/ProductDetail.tsx', prod);
}

// Update WorkDetail.tsx
let work = fs.readFileSync('src/pages/WorkDetail.tsx', 'utf8');
if (!work.includes("BreadcrumbList")) {
  work = work.replace('"name": "Michael Bakare"\n            }', `"name": "Michael Bakare"\n            }\n          },\n          {\n            "@context": "https://schema.org",\n            "@type": "BreadcrumbList",\n            "itemListElement": [\n              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://michaelbakare.com/" },\n              { "@type": "ListItem", "position": 2, "name": "Works", "item": "https://michaelbakare.com/works" },\n              { "@type": "ListItem", "position": 3, "name": work.title, "item": \`https://michaelbakare.com/works/\${work.id}\` }\n            ]\n          }`);
  fs.writeFileSync('src/pages/WorkDetail.tsx', work);
}
