const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');
content = content.replace(
  "collection(db, 'works')",
  "collection(db, 'portfolio')"
);
fs.writeFileSync('src/pages/Home.tsx', content);
