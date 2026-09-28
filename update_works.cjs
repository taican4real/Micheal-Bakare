const fs = require('fs');
let code = fs.readFileSync('src/pages/Works.tsx', 'utf8');

code = code.replace("import { Search } from 'lucide-react';", "import { Search } from 'lucide-react';\nimport SEO from '../components/SEO';");

const seoTag = `
      <SEO 
        title="Works & Portfolio | Michael Bakare"
        description="Explore the comprehensive musical portfolio of Michael Bakare, including compositions, arrangements, and productions."
        url="/works"
      />
`;

code = code.replace("<div className=\"w-full pb-32 min-h-screen\">", "<div className=\"w-full pb-32 min-h-screen\">\n" + seoTag);

fs.writeFileSync('src/pages/Works.tsx', code);
