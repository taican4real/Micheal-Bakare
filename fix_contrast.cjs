const fs = require('fs');

const updateContrast = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/text-zinc-400/g, 'text-zinc-300');
    content = content.replace(/text-zinc-500/g, 'text-zinc-400');
    fs.writeFileSync(file, content);
  }
}

updateContrast('src/pages/Home.tsx');
updateContrast('src/pages/About.tsx');
updateContrast('src/pages/Store.tsx');

