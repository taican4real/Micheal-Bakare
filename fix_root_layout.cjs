const fs = require('fs');

let content = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

if (!content.includes('import Breadcrumbs')) {
  content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport Breadcrumbs from '../components/Breadcrumbs';");
  
  content = content.replace(
    '<main className="pt-20 flex-grow">',
    '<main className="pt-20 flex-grow">\n        <Breadcrumbs />'
  );

  fs.writeFileSync('src/layouts/RootLayout.tsx', content);
}
