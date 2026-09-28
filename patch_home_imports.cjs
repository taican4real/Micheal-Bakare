const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes("import { ScrollReveal")) {
  content = content.replace(
    "import { motion } from 'motion/react';",
    "import { motion } from 'motion/react';\nimport { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';"
  );
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log('Imports added to Home.tsx');
}
