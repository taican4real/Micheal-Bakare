const fs = require('fs');

const updateReads = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if limit is imported from firestore, if not add it
    if (!content.includes('limit') && content.includes('firebase/firestore')) {
      content = content.replace(/import {([^}]+)} from 'firebase\/firestore';/, (match, p1) => {
        return `import {${p1}, limit } from 'firebase/firestore';`;
      });
    }

    // Add limit(50) to the query in Store.tsx
    if (file.includes('Store.tsx')) {
       content = content.replace(/orderBy\('createdAt', 'desc'\)/g, "orderBy('createdAt', 'desc'), limit(50)");
    }
    
    // Add limit(50) to the query in Works.tsx
    if (file.includes('Works.tsx')) {
       content = content.replace(/where\('status', '==', 'published'\)/g, "where('status', '==', 'published'), limit(50)");
    }
    
    // Add limit(50) to GenericAdminList
    if (file.includes('GenericAdminList.tsx')) {
       content = content.replace(/orderBy\('createdAt', 'desc'\)/g, "orderBy('createdAt', 'desc'), limit(100)");
       content = content.replace(/collection\(db, collectionName\)\)/g, "collection(db, collectionName), limit(100))");
    }

    fs.writeFileSync(file, content);
  }
}

updateReads('src/pages/Store.tsx');
updateReads('src/pages/Works.tsx');
updateReads('src/pages/admin/GenericAdminList.tsx');
