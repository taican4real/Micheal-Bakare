const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes("import SEO")) {
  code = code.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport SEO from '../components/SEO';");
  
  const seoTag = `
      <SEO 
        title="Michael Bakare | Composer, Music Producer & Director"
        description="The official website of Michael Bakare. Acclaimed Composer, Music Producer, Director, and Pianist. Explore portfolio, masterclasses, and services."
        url="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Michael Bakare Home",
          "description": "The official website of Michael Bakare. Acclaimed Composer, Music Producer, Director, and Pianist."
        }}
      />
  `;
  
  code = code.replace("<div className=\"max-w-5xl mx-auto space-y-32\">", "<div className=\"max-w-5xl mx-auto space-y-32\">\n" + seoTag);
  fs.writeFileSync('src/pages/Home.tsx', code);
}
