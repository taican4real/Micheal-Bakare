const fs = require('fs');

let content = fs.readFileSync('src/pages/Services.tsx', 'utf8');

if (!content.includes('import { ScrollReveal')) {
  content = content.replace(
    "import { motion } from 'motion/react';",
    "import { motion } from 'motion/react';\nimport { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';"
  );
}

// Engagement Process
content = content.replace(
  '<div className="grid md:grid-cols-3 gap-12 lg:gap-24">',
  '<StaggerContainer className="grid md:grid-cols-3 gap-12 lg:gap-24">'
);
content = content.replace(
  '<div>\n              <span className="font-serif text-4xl text-zinc-600 block mb-6">I.</span>',
  '<StaggerItem>\n              <span className="font-serif text-4xl text-zinc-600 block mb-6">I.</span>'
);
content = content.replace(
  '</p>\n            </div>\n            <div>\n              <span className="font-serif text-4xl text-zinc-600 block mb-6">II.</span>',
  '</p>\n            </StaggerItem>\n            <StaggerItem>\n              <span className="font-serif text-4xl text-zinc-600 block mb-6">II.</span>'
);
content = content.replace(
  '</p>\n            </div>\n            <div>\n              <span className="font-serif text-4xl text-zinc-600 block mb-6">III.</span>',
  '</p>\n            </StaggerItem>\n            <StaggerItem>\n              <span className="font-serif text-4xl text-zinc-600 block mb-6">III.</span>'
);
content = content.replace(
  '</p>\n            </div>\n          </div>',
  '</p>\n            </StaggerItem>\n          </StaggerContainer>'
);

fs.writeFileSync('src/pages/Services.tsx', content);
console.log('Services.tsx updated');

