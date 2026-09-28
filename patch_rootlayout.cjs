const fs = require('fs');
let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

if (!layout.includes('AudioPlayerProvider')) {
  // 1. Add imports
  layout = layout.replace(
    "import BackToTop from '../components/BackToTop';",
    "import BackToTop from '../components/BackToTop';\nimport { AudioPlayerProvider } from '../context/AudioPlayerContext';\nimport GlobalAudioPlayer from '../components/GlobalAudioPlayer';"
  );
  
  // 2. Wrap root div
  layout = layout.replace(
    '<div className="min-h-screen bg-canvas text-ink font-sans selection:bg-zinc-200 flex flex-col">',
    '<AudioPlayerProvider>\n    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-zinc-200 flex flex-col">'
  );
  
  // 3. Add GlobalAudioPlayer and close Provider
  layout = layout.replace(
    '<WhatsAppWidget />\n    </div>',
    '<WhatsAppWidget />\n      <GlobalAudioPlayer />\n    </div>\n    </AudioPlayerProvider>'
  );
  
  fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
  console.log('RootLayout patched with AudioPlayerProvider');
}
