const fs = require('fs');

let detail = fs.readFileSync('src/pages/Services.tsx', 'utf8');

const oldDesc = `{service.description.split('\\n').map((paragraph, idx) => (
                      <p key={idx} className="text-ink-muted leading-relaxed font-light mb-4">
                        {paragraph}
                      </p>
                    ))}`;

const newDesc = `<div 
                      className="prose prose-zinc prose-p:text-ink-muted prose-p:leading-relaxed prose-p:font-light prose-headings:font-serif prose-headings:text-ink prose-a:text-ink max-w-none"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />`;

detail = detail.replace(oldDesc, newDesc);
fs.writeFileSync('src/pages/Services.tsx', detail);
console.log('Services patched');
