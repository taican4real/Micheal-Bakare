const fs = require('fs');
let content = fs.readFileSync('src/components/ScrollReveal.tsx', 'utf8');

content = content.replace(
  "export function StaggerItem({ \n  children, \n  className = \"\", \n  yOffset = 40 \n}: { \n  children: React.ReactNode, \n  className?: string, \n  yOffset?: number \n}) {",
  "export function StaggerItem({ \n  children, \n  className = \"\", \n  yOffset = 40, \n  delay \n}: { \n  children: React.ReactNode, \n  className?: string, \n  yOffset?: number,\n  delay?: number\n}) {"
);

fs.writeFileSync('src/components/ScrollReveal.tsx', content);
