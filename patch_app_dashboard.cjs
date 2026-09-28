const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('AdminDashboard')) {
  // Import it
  app = app.replace(
    "import AdminLayout from './layouts/AdminLayout';",
    "import AdminLayout from './layouts/AdminLayout';\nimport AdminDashboard from './pages/admin/AdminDashboard';"
  );
  
  // Replace the old index route
  const oldRoute = `<Route index element={
          <div className="max-w-4xl">
            <h1 className="font-serif text-3xl mb-4 text-ink">Dashboard Overview</h1>
            <p className="text-ink-muted">Welcome to the Michael Bakare administrative dashboard.</p>
          </div>
        } />`;
        
  const newRoute = `<Route index element={<AdminDashboard />} />`;
  
  app = app.replace(oldRoute, newRoute);
  
  fs.writeFileSync('src/App.tsx', app);
  console.log('App.tsx patched for AdminDashboard');
}
