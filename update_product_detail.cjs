const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

if (!code.includes("import SEO")) {
  code = code.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport SEO from '../components/SEO';");
  
  const seoTag = `
      {product && (
        <SEO 
          title={\`\${product.name} | Michael Bakare Store\`}
          description={product.description?.substring(0, 160) || "Purchase this premium digital asset by Michael Bakare."}
          url={\`/store/\${product.id}\`}
          type="product"
          image={product.imageUrl}
          schema={{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.imageUrl,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "brand": {
              "@type": "Person",
              "name": "Michael Bakare"
            }
          }}
        />
      )}
  `;
  
  code = code.replace("<div className=\"w-full pb-32 bg-zinc-50 min-h-screen\">", "<div className=\"w-full pb-32 bg-zinc-50 min-h-screen\">\n" + seoTag);
  fs.writeFileSync('src/pages/ProductDetail.tsx', code);
}
