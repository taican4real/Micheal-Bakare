const fs = require('fs');

let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

if (!content.includes('import { ScrollReveal')) {
  content = content.replace(
    "import { motion, AnimatePresence } from 'motion/react';",
    "import { motion, AnimatePresence } from 'motion/react';\nimport { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';"
  );
}

// Left column
content = content.replace(
  '<div className="md:col-span-5 lg:col-span-4">\n            <motion.div \n              initial={{ opacity: 0, y: 20 }}\n              animate={{ opacity: 1, y: 0 }}\n              transition={{ duration: 0.8, delay: 0.1, ease: easeCurve }}\n            >',
  '<div className="md:col-span-5 lg:col-span-4">\n            <ScrollReveal delay={0.1}>'
);
content = content.replace(
  '</div>\n            </motion.div>\n          </div>',
  '</div>\n            </ScrollReveal>\n          </div>'
);

// Right column form is already wrapped in motion.form or AnimatePresence, so let's keep it but change initial/animate to whileInView if we wanted. But since AnimatePresence needs layout and initial/exit, we can just leave it as it is.

fs.writeFileSync('src/pages/Contact.tsx', content);
console.log('Contact.tsx updated');

