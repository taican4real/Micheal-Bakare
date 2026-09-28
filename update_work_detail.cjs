const fs = require('fs');
let code = fs.readFileSync('src/pages/WorkDetail.tsx', 'utf8');

if (!code.includes("import SEO")) {
  code = code.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport SEO from '../components/SEO';");
  
  const seoTag = `
      {work && (
        <SEO 
          title={\`\${work.title} | Michael Bakare Portfolio\`}
          description={work.description?.substring(0, 160) || "Explore this portfolio piece by Michael Bakare."}
          url={\`/works/\${work.id}\`}
          type="article"
          image={work.coverImageUrl}
          schema={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": work.title,
            "description": work.description,
            "url": \`https://michaelbakare.com/works/\${work.id}\`,
            "creator": {
              "@type": "Person",
              "name": "Michael Bakare"
            }
          }}
        />
      )}
  `;
  
  code = code.replace("<div className=\"w-full pb-32\">", "<div className=\"w-full pb-32\">\n" + seoTag);
  fs.writeFileSync('src/pages/WorkDetail.tsx', code);
}
