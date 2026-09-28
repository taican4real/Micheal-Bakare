const fs = require('fs');
let content = fs.readFileSync('src/components/NewsletterForm.tsx', 'utf8');

content = content.replace(
  'placeholder="Enter your email address"',
  'placeholder="Enter your email address"\n                aria-label="Email address for newsletter subscription"'
);

content = content.replace(
  'type="submit"',
  'type="submit"\n                aria-label="Subscribe to newsletter"'
);

fs.writeFileSync('src/components/NewsletterForm.tsx', content);
console.log('NewsletterForm patched');
