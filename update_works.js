const fs = require('fs');
let code = fs.readFileSync('src/pages/Works.tsx', 'utf8');

if (!code.includes("import SEO")) {
  code = code.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport SEO from '../components/SEO';");
  
  const seoTag = `
      <SEO 
        title="Works & Portfolio | Michael Bakare"
        description="Explore the comprehensive musical portfolio of Michael Bakare, including compositions, arrangements, and productions."
        url="/works"
      />
  `;
  
  code = code.replace("<div className=\"w-full pb-32\">", "<div className=\"w-full pb-32\">\n" + seoTag);
  fs.writeFileSync('src/pages/Works.tsx', code);
}
