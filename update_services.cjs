const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

if (!code.includes("import SEO")) {
  code = code.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport SEO from '../components/SEO';");
  
  const seoTag = `
      <SEO 
        title="Professional Services | Michael Bakare"
        description="Engage Michael Bakare for professional services including composition, music production, musical direction, and performance."
        url="/services"
      />
  `;
  
  code = code.replace("<div className=\"w-full pb-32\">", "<div className=\"w-full pb-32\">\n" + seoTag);
  fs.writeFileSync('src/pages/Services.tsx', code);
}
