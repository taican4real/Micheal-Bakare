const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('<img')) return;
  
  if (!content.includes('ResponsiveImage')) {
    // Find the last import and add ResponsiveImage right after
    const imports = content.match(/import .* from .*/g);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const relativePath = file.startsWith('src/pages/admin/') ? '../../components/ResponsiveImage' : '../components/ResponsiveImage';
      content = content.replace(lastImport, `${lastImport}\nimport ResponsiveImage from '${relativePath}';`);
    }
  }

  // Replace <img with <ResponsiveImage
  content = content.replace(/<img /g, '<ResponsiveImage ');
  // Handle case where we had loading="lazy" already on the <img> tag
  // We can just keep it or let ResponsiveImage override it/use it
  fs.writeFileSync(file, content);
}

const files = [
  'src/pages/Services.tsx',
  'src/pages/Works.tsx',
  'src/pages/admin/AdminStore.tsx',
  'src/pages/admin/AdminServices.tsx',
  'src/pages/WorkDetail.tsx',
  'src/pages/ProductDetail.tsx',
  'src/pages/Cart.tsx',
  'src/pages/Store.tsx'
];

files.forEach(updateFile);
