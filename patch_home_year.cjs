const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  "data.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));",
  "data.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));"
);
fs.writeFileSync('src/pages/Home.tsx', content);
