const fs = require('fs');

// 1. Update AdminLayout.tsx
let layout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

const navItemsOriginal = `
    { name: 'Store', path: '/admin/store', icon: <ShoppingBag size={20} /> },
`;

const navItemsReplacement = `
    { name: 'Store', path: '/admin/store', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
`;
layout = layout.replace(navItemsOriginal, navItemsReplacement);
fs.writeFileSync('src/layouts/AdminLayout.tsx', layout);

// 2. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
const imports = "import AdminProductForm from './pages/admin/AdminProductForm';\nimport AdminOrders from './pages/admin/AdminOrders';";
app = app.replace("import AdminProductForm from './pages/admin/AdminProductForm';", imports);

const routes = `
        <Route path="store/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
`;
app = app.replace('<Route path="store/:id/edit" element={<AdminProductForm />} />', routes);
fs.writeFileSync('src/App.tsx', app);

