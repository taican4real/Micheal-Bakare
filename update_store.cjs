const fs = require('fs');
let code = fs.readFileSync('src/pages/Store.tsx', 'utf8');

if (!code.includes("import SEO")) {
  code = code.replace("import { Search } from 'lucide-react';", "import { Search } from 'lucide-react';\nimport SEO from '../components/SEO';");
  
  const seoTag = `
      <SEO 
        title="Digital Store & Publications | Michael Bakare"
        description="Purchase premium digital assets, scores, masterclasses, and E-Books by Michael Bakare."
        url="/store"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Digital Store & Publications | Michael Bakare"
        }}
      />
  `;
  
  code = code.replace("<div className=\"w-full pb-32 bg-zinc-50 min-h-screen\">", "<div className=\"w-full pb-32 bg-zinc-50 min-h-screen\">\n" + seoTag);
  fs.writeFileSync('src/pages/Store.tsx', code);
}
