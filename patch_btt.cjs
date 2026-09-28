const fs = require('fs');
let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

if (!layout.includes('BackToTop')) {
  layout = layout.replace(
    "import WhatsAppWidget from '../components/WhatsAppWidget';",
    "import WhatsAppWidget from '../components/WhatsAppWidget';\nimport BackToTop from '../components/BackToTop';"
  );
  
  layout = layout.replace(
    '<WhatsAppWidget />',
    '<BackToTop />\n      <WhatsAppWidget />'
  );
  
  fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
  console.log('RootLayout patched with BackToTop');
}
