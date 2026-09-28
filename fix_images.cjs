const fs = require('fs');

const updateImg = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Ensure lazy loading is added to images if not already there, except maybe if it has priority.
    // In React, it's loading="lazy"
    content = content.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy"');
    fs.writeFileSync(file, content);
  }
}

// Just apply to a bunch of them
const files = [
  'src/pages/Works.tsx',
  'src/pages/Store.tsx',
  'src/pages/WorkDetail.tsx',
  'src/pages/ProductDetail.tsx',
  'src/pages/Services.tsx',
  'src/pages/admin/AdminStore.tsx',
  'src/pages/admin/AdminServices.tsx',
  'src/pages/Cart.tsx'
];

files.forEach(updateImg);

