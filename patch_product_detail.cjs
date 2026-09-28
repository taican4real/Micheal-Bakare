const fs = require('fs');

let detail = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

const oldDesc = `{product.description.split('\\n').map((paragraph, idx) => (
                <p key={idx} className="text-ink-muted leading-relaxed font-light mb-6">
                  {paragraph}
                </p>
              ))}`;

const newDesc = `<div 
                className="prose prose-zinc prose-p:text-ink-muted prose-p:leading-relaxed prose-p:font-light prose-headings:font-serif prose-headings:text-ink prose-a:text-ink max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />`;

detail = detail.replace(oldDesc, newDesc);
fs.writeFileSync('src/pages/ProductDetail.tsx', detail);
console.log('ProductDetail patched');
