const fs = require('fs');

// Fix RootLayout.tsx
const rootFile = 'src/layouts/RootLayout.tsx';
let rootContent = fs.readFileSync(rootFile, 'utf8');
rootContent = rootContent.replace('              aria-expanded={isMobileMenuOpen}\n              aria-label="Toggle menu"', '              aria-expanded={isMobileMenuOpen}');
fs.writeFileSync(rootFile, rootContent);

// Fix GenericAdminList.tsx
const adminFile = 'src/pages/admin/GenericAdminList.tsx';
let adminContent = fs.readFileSync(adminFile, 'utf8');
adminContent = adminContent.replace('const snapshot = await getDocs(collection(db, collectionName), limit(100));', 'const snapshot = await getDocs(query(collection(db, collectionName), limit(100)));');
fs.writeFileSync(adminFile, adminContent);

