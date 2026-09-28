const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// Remove the dangerous fallback
const badFallback = `      // Fallback: If no exact amount match, but there's exactly 1 pending order, use it
      if (!matchedDoc && ordersSnapshot.docs.length === 1) {
        matchedDoc = ordersSnapshot.docs[0];
        matchedOrder = matchedDoc.data();
      }`;

server = server.replace(badFallback, '      // Fallback removed for security to prevent cross-order fulfillment.');

fs.writeFileSync('server.ts', server);
