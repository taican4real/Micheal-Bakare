const fs = require('fs');
let layout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

if (!layout.includes('AnimatePresence } from')) {
  layout = layout.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';\nimport PageTransition from '../components/PageTransition';"
  );
  fs.writeFileSync('src/layouts/AdminLayout.tsx', layout);
  console.log('AdminLayout patched');
}
