const fs = require('fs');

let content = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');
content = content.replace(
  'accessKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),',
  'accessKey: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)),'
);
fs.writeFileSync('src/pages/Checkout.tsx', content);
