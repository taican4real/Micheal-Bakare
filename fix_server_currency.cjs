const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  '        if (Math.abs(orderData.totalAmount - Number(amount)) < 0.1) {',
  '        // Strict equality for amount and currency\n        if (Math.abs(orderData.totalAmount - Number(amount)) < 0.1 && orderData.currency === currency) {'
);

fs.writeFileSync('server.ts', server);
