const fs = require('fs');

function injectImports(content) {
  if (content.includes('import { ScrollReveal')) return content;
  return content.replace(
    "import { motion } from 'motion/react';",
    "import { motion } from 'motion/react';\nimport { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';"
  );
}

// 1. Update About.tsx
let about = fs.readFileSync('src/pages/About.tsx', 'utf8');
about = injectImports(about);

// Wrap Image & Biography Split in ScrollReveal
about = about.replace(
  '<div className="md:col-span-5 relative">',
  '<ScrollReveal className="md:col-span-5 relative">'
);
about = about.replace(
  '</div>\n                    \n                    <div className="md:col-span-7 pt-4">',
  '</ScrollReveal>\n                    \n                    <ScrollReveal delay={0.2} className="md:col-span-7 pt-4">'
);
about = about.replace(
  '</div>\n        </div>\n      </section>',
  '</ScrollReveal>\n        </div>\n      </section>'
);

// Wrap timeline in StaggerContainer and StaggerItem
about = about.replace(
  '<div className="border-t border-zinc-800">',
  '<StaggerContainer className="border-t border-zinc-800">'
);
about = about.replace(
  '{[1, 2, 3, 4].map((item) => (',
  '{[1, 2, 3, 4].map((item) => ('
);
about = about.replace(
  '<div key={item} className="grid md:grid-cols-12 gap-8 py-10 border-b border-zinc-800">',
  '<StaggerItem key={item} className="grid md:grid-cols-12 gap-8 py-10 border-b border-zinc-800">'
);
about = about.replace(
  '</div>\n            ))}',
  '</StaggerItem>\n            ))}'
);
about = about.replace(
  '</div>\n        </div>\n      </section>',
  '</StaggerContainer>\n        </div>\n      </section>'
);
fs.writeFileSync('src/pages/About.tsx', about);
console.log('About.tsx updated');

