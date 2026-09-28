const fs = require('fs');

// Patch RootLayout
let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');
if (!layout.includes('import PageTransition')) {
  layout = layout.replace(
    "import NewsletterForm from '../components/NewsletterForm';",
    "import NewsletterForm from '../components/NewsletterForm';\nimport PageTransition from '../components/PageTransition';\nimport { AnimatePresence } from 'motion/react';"
  );
  
  // Notice there's already AnimatePresence imported on line 5, let's fix that.
  layout = layout.replace("import { AnimatePresence } from 'motion/react';\n", "");

  layout = layout.replace(
    '<Outlet />',
    '<AnimatePresence mode="wait">\n          <PageTransition>\n            <Outlet />\n          </PageTransition>\n        </AnimatePresence>'
  );
  
  fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
  console.log('RootLayout patched with PageTransition');
}

// Patch AdminLayout
let adminLayout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');
if (!adminLayout.includes('import PageTransition')) {
  adminLayout = adminLayout.replace(
    "import NavigationProgress from '../components/NavigationProgress';",
    "import NavigationProgress from '../components/NavigationProgress';\nimport PageTransition from '../components/PageTransition';\nimport { AnimatePresence } from 'motion/react';"
  );

  adminLayout = adminLayout.replace(
    '<Outlet />',
    '<AnimatePresence mode="wait">\n            <PageTransition>\n              <Outlet />\n            </PageTransition>\n          </AnimatePresence>'
  );
  
  fs.writeFileSync('src/layouts/AdminLayout.tsx', adminLayout);
  console.log('AdminLayout patched with PageTransition');
}
