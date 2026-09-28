const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');
content = content.replace("import SEO from '../components/SEO';", "import SEO from '../components/SEO';\nimport ResponsiveImage from '../components/ResponsiveImage';");

const oldImg = `<img 
               src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop" 
               alt="Piano performance"
               className="object-cover w-full h-full grayscale mix-blend-multiply opacity-80"
             />`;

const newImg = `<ResponsiveImage 
               src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop" 
               alt="Piano performance"
               className="object-cover w-full h-full grayscale mix-blend-multiply opacity-80"
               forceEager={true}
             />`;
content = content.replace(oldImg, newImg);
fs.writeFileSync('src/pages/Home.tsx', content);
