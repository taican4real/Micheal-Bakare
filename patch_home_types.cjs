const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  "import { Work } from '../types';",
  "import { PortfolioWork as Work } from '../types';"
);
fs.writeFileSync('src/pages/Home.tsx', content);
