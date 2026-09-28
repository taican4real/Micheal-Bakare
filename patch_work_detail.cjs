const fs = require('fs');

let detail = fs.readFileSync('src/pages/WorkDetail.tsx', 'utf8');

const oldDesc = `{work.description ? (
                work.description.split('\\n').map((paragraph, idx) => (
                  <p key={idx} className="text-lg md:text-xl text-ink-muted leading-relaxed font-light mb-6">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-lg md:text-xl text-ink-muted leading-relaxed font-light mb-6 italic">
                  No additional information provided.
                </p>
              )}`;

const newDesc = `{work.description ? (
                <div 
                  className="prose prose-zinc prose-p:text-lg md:prose-p:text-xl prose-p:text-ink-muted prose-p:leading-relaxed prose-p:font-light prose-headings:font-serif prose-headings:text-ink prose-a:text-ink max-w-none mb-12"
                  dangerouslySetInnerHTML={{ __html: work.description }}
                />
              ) : (
                <p className="text-lg md:text-xl text-ink-muted leading-relaxed font-light mb-6 italic">
                  No additional information provided.
                </p>
              )}`;

detail = detail.replace(oldDesc, newDesc);
fs.writeFileSync('src/pages/WorkDetail.tsx', detail);
console.log('WorkDetail.tsx patched');
