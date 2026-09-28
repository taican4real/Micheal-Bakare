const fs = require('fs');

let content = fs.readFileSync('src/pages/About.tsx', 'utf8');

if (!content.includes('import ResponsiveImage')) {
  content = content.replace("import SEO from '../components/SEO';", "import SEO from '../components/SEO';\nimport ResponsiveImage from '../components/ResponsiveImage';");
}

const oldStr = `<div className="absolute inset-0 flex items-center justify-center text-ink-muted font-serif text-sm">
                [IMAGE PLACEHOLDER: Michael Bakare Portrait]
              </div>`;

const newStr = `<ResponsiveImage 
                src="https://res.cloudinary.com/diiwcoarc/image/upload/v1782327076/ChatGPT_Image_Jun_24_2026_07_50_16_PM_aqbn1u.png"
                alt="Michael Bakare Portrait"
                className="w-full h-full object-cover"
              />`;

content = content.replace(oldStr, newStr);

fs.writeFileSync('src/pages/About.tsx', content);
