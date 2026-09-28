const fs = require('fs');

let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

if (!layout.includes('import NavigationProgress')) {
  layout = layout.replace(
    "import Breadcrumbs from '../components/Breadcrumbs';",
    "import Breadcrumbs from '../components/Breadcrumbs';\nimport NavigationProgress from '../components/NavigationProgress';"
  );
  
  layout = layout.replace(
    '<div className="min-h-screen bg-canvas text-ink font-sans selection:bg-zinc-200 flex flex-col">',
    '<div className="min-h-screen bg-canvas text-ink font-sans selection:bg-zinc-200 flex flex-col">\n      <NavigationProgress />'
  );
  
  fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
  console.log('RootLayout patched with NavigationProgress');
}

let adminLayout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');
if (!adminLayout.includes('import NavigationProgress')) {
  adminLayout = adminLayout.replace(
    "import { motion } from 'motion/react';",
    "import { motion } from 'motion/react';\nimport NavigationProgress from '../components/NavigationProgress';"
  );
  
  adminLayout = adminLayout.replace(
    '<div className="min-h-screen bg-zinc-50 flex">',
    '<div className="min-h-screen bg-zinc-50 flex">\n      <NavigationProgress />'
  );
  
  fs.writeFileSync('src/layouts/AdminLayout.tsx', adminLayout);
  console.log('AdminLayout patched with NavigationProgress');
}

