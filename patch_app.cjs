const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('GlobalSkeleton')) {
  app = app.replace(
    "import AdminLayout from './layouts/AdminLayout';",
    "import AdminLayout from './layouts/AdminLayout';\nimport GlobalSkeleton from './components/GlobalSkeleton';"
  );

  app = app.replace(
    '<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-ink-muted">Loading...</div>}>',
    '<Suspense fallback={<GlobalSkeleton />}>'
  );
  
  fs.writeFileSync('src/App.tsx', app);
  console.log('App patched with GlobalSkeleton');
}
