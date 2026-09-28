const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');

const newRule = `
    match /subscribers/{subscriberId} {
      allow get, list, update, delete: if isAdmin();
      allow create: if incoming().keys().hasAll(['email', 'subscribedAt']) &&
                    incoming().email is string &&
                    incoming().email.size() >= 3 &&
                    incoming().email.size() <= 150 &&
                    incoming().email.matches('^[^@]+@[^@]+\\\\.[^@]+$') &&
                    incoming().subscribedAt == request.time;
    }
`;

// insert before the closing brace of documents match
const lastBraceIndex = rules.lastIndexOf('}');
const secondLastBraceIndex = rules.lastIndexOf('}', lastBraceIndex - 1);

rules = rules.slice(0, secondLastBraceIndex) + newRule + rules.slice(secondLastBraceIndex);

fs.writeFileSync('firestore.rules', rules);
