const fs = require('fs');

let layout = fs.readFileSync('src/layouts/RootLayout.tsx', 'utf8');

if (!layout.includes('NewsletterForm')) {
  layout = layout.replace(
    "import Breadcrumbs from '../components/Breadcrumbs';",
    "import Breadcrumbs from '../components/Breadcrumbs';\nimport NewsletterForm from '../components/NewsletterForm';"
  );
  
  layout = layout.replace(
    '<footer className="border-t border-border-subtle py-16 mt-auto">',
    `<footer className="border-t border-border-subtle pt-24 pb-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <div className="max-w-2xl">
            <h4 className="font-serif text-3xl md:text-4xl text-ink mb-4">Join the Archive</h4>
            <p className="text-ink-muted mb-8 font-light text-lg">Subscribe to receive exclusive insights, new publication alerts, and priority access to masterclasses.</p>
            <NewsletterForm />
          </div>
        </div>`
  );
  
  fs.writeFileSync('src/layouts/RootLayout.tsx', layout);
  console.log('RootLayout patched');
}
