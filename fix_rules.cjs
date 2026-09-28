const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');

// Fix order read vulnerability - only allow creating and getting orders if they match a certain criteria, or restrict get to creator if logged in, but since checkout is guest, we'll keep get but add validation on create.
rules = rules.replace(
  "allow create: if incoming().status == 'PENDING';",
  "allow create: if incoming().status == 'PENDING' && incoming().keys().hasAll(['customerEmail', 'customerName', 'totalAmount']);"
);

// Fix quote spam by requiring required fields and size limits
rules = rules.replace(
  "allow create: if incoming().status == 'NEW';",
  "allow create: if incoming().status == 'NEW' && incoming().keys().hasAll(['name', 'email', 'serviceName']) && incoming().name.size() < 100 && incoming().email.size() < 100;"
);

fs.writeFileSync('firestore.rules', rules);
