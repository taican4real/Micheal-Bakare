const fs = require('fs');
let content = fs.readFileSync('src/components/ScrollReveal.tsx', 'utf8');

content = content.replace(
  "export function StaggerItem({ \n  children, \n  className = \"\", \n  yOffset = 40, \n  delay \n}: { \n  children: React.ReactNode, \n  className?: string, \n  yOffset?: number,\n  delay?: number\n}) {",
  "export const StaggerItem: React.FC<{ \n  children: React.ReactNode, \n  className?: string, \n  yOffset?: number,\n  delay?: number\n}> = ({ \n  children, \n  className = \"\", \n  yOffset = 40, \n  delay \n}) => {"
);

content = content.replace(
  "export function StaggerContainer({ \n  children, \n  className = \"\", \n  delay = 0,\n  margin = \"-100px\"\n}: { \n  children: React.ReactNode, \n  className?: string,\n  delay?: number,\n  margin?: string\n}) {",
  "export const StaggerContainer: React.FC<{ \n  children: React.ReactNode, \n  className?: string,\n  delay?: number,\n  margin?: string\n}> = ({ \n  children, \n  className = \"\", \n  delay = 0,\n  margin = \"-100px\"\n}) => {"
);

fs.writeFileSync('src/components/ScrollReveal.tsx', content);
