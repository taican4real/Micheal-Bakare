const fs = require('fs');

let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

if (!layout.includes('WhatsAppWidget')) {
  layout = layout.replace(
    "import NavigationProgress from '../components/NavigationProgress';",
    "import NavigationProgress from '../components/NavigationProgress';\nimport WhatsAppWidget from '../components/WhatsAppWidget';"
  );
  
  // Add it before the closing </div> of RootLayout
  layout = layout.replace(
    '    </div>\n  );\n}',
    '      <WhatsAppWidget />\n    </div>\n  );\n}'
  );
  
  fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
  console.log('RootLayout patched with WhatsAppWidget');
}
