const fs = require('fs');

let content = fs.readFileSync('src/pages/Media.tsx', 'utf8');

if (!content.includes('import { ScrollReveal')) {
  content = content.replace(
    "import { motion } from 'motion/react';",
    "import { motion } from 'motion/react';\nimport { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';"
  );
}

// Press Kit Section
content = content.replace(
  '<div className="max-w-7xl mx-auto px-6 sm:px-12 grid md:grid-cols-2 gap-16 items-center">',
  '<StaggerContainer className="max-w-7xl mx-auto px-6 sm:px-12 grid md:grid-cols-2 gap-16 items-center">'
);
content = content.replace(
  '<div>\n            <h2 className="font-serif text-3xl md:text-4xl mb-6">',
  '<StaggerItem>\n            <h2 className="font-serif text-3xl md:text-4xl mb-6">'
);
content = content.replace(
  '</button>\n          </div>\n          <div className="aspect-[4/3] bg-zinc-100 rounded-2xl flex items-center justify-center border border-border-subtle relative">',
  '</button>\n          </StaggerItem>\n          <StaggerItem delay={0.2}>\n          <div className="aspect-[4/3] bg-zinc-100 rounded-2xl flex items-center justify-center border border-border-subtle relative">'
);
content = content.replace(
  '</div>\n          </div>\n        </div>\n      </section>',
  '</div>\n          </div>\n          </StaggerItem>\n        </StaggerContainer>\n      </section>'
);

fs.writeFileSync('src/pages/Media.tsx', content);
console.log('Media.tsx updated');

