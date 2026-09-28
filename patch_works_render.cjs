const fs = require('fs');

let works = fs.readFileSync('src/pages/Works.tsx', 'utf8');

const oldDesc1 = `{item.description && (
                          <p className="text-ink-muted font-light line-clamp-2 leading-relaxed text-sm">{item.description}</p>
                        )}`;

const newDesc1 = `{item.description && (
                          <div className="text-ink-muted font-light line-clamp-2 leading-relaxed text-sm prose-p:mb-0 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.description }} />
                        )}`;

works = works.replace(oldDesc1, newDesc1);
fs.writeFileSync('src/pages/Works.tsx', works);
console.log('Works.tsx patched for render');
