const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { Suspense')) {
  code = code.replace("import { Routes, Route } from 'react-router-dom';", "import { Suspense, lazy } from 'react';\nimport { Routes, Route } from 'react-router-dom';");
}

// Ensure lazy imports are applied
const pages = [
  'Home', 'About', 'Works', 'WorkDetail', 'Services', 'Store', 'ProductDetail',
  'Media', 'Contact', 'Cart', 'Checkout', 'OrderStatus',
  'admin/AdminWorks', 'admin/AdminWorkForm', 'admin/AdminStore', 'admin/AdminProductForm',
  'admin/AdminOrders', 'admin/AdminServices', 'admin/AdminServiceForm', 'admin/AdminQuotes',
  'admin/AdminQuoteDetail', 'admin/GenericAdminList'
];

for (const page of pages) {
  const compName = page.split('/').pop();
  const importStatement = new RegExp(`import ${compName} from '\\./pages/${page}';`);
  code = code.replace(importStatement, `const ${compName} = lazy(() => import('./pages/${page}'));`);
}

fs.writeFileSync('src/App.tsx', code);
