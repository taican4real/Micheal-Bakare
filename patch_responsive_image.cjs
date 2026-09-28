const fs = require('fs');
let content = fs.readFileSync('src/components/ResponsiveImage.tsx', 'utf8');

content = content.replace(
  "interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {",
  "interface ResponsiveImageProps extends React.ComponentProps<'img'> {\n  className?: string;\n  loading?: 'lazy' | 'eager';"
);
fs.writeFileSync('src/components/ResponsiveImage.tsx', content);
