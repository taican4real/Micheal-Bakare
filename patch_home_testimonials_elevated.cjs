const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = `<StaggerContainer className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                quote: "Michael's ability to translate complex emotional landscapes into sonic architectures is unparalleled. A true visionary.",
                author: "Sarah Jenkins",
                role: "Director, London Philharmonic"
              },
              {
                quote: "Working with Michael elevated our entire production. His meticulous attention to detail and cinematic scope brought the score to life.",
                author: "David Oyelowo",
                role: "Film Producer"
              },
              {
                quote: "An exceptional talent who understands the delicate balance between technical mastery and profound artistic expression.",
                author: "Elena Rostova",
                role: "Principal Cellist"
              }
            ].map((testimonial, idx) => (
              <StaggerItem key={idx} className="flex flex-col">
                <div className="text-ink text-5xl font-serif leading-none mb-4 opacity-20">"</div>
                <p className="text-ink-muted text-lg md:text-xl font-light leading-relaxed mb-8 flex-1">
                  {testimonial.quote}
                </p>
                <div>
                  <h4 className="text-ink font-semibold tracking-wide text-sm uppercase">{testimonial.author}</h4>
                  <p className="text-ink-muted text-[10px] tracking-widest uppercase mt-1">{testimonial.role}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>`;

const replaceStr = `<StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "Michael's ability to translate complex emotional landscapes into sonic architectures is unparalleled. A true visionary.",
                author: "Sarah Jenkins",
                role: "Director, London Philharmonic"
              },
              {
                quote: "Working with Michael elevated our entire production. His meticulous attention to detail and cinematic scope brought the score to life.",
                author: "David Oyelowo",
                role: "Film Producer"
              },
              {
                quote: "An exceptional talent who understands the delicate balance between technical mastery and profound artistic expression.",
                author: "Elena Rostova",
                role: "Principal Cellist"
              }
            ].map((testimonial, idx) => (
              <StaggerItem key={idx} className="flex flex-col bg-surface border border-border-subtle p-10 lg:p-12 rounded-[2rem] hover:border-ink hover:shadow-xl hover:shadow-ink/5 transition-all duration-500 group">
                <div className="text-ink-muted text-5xl font-serif leading-none mb-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">"</div>
                <p className="text-ink text-lg font-light leading-relaxed mb-12 flex-1">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4 border-t border-border-subtle pt-6 mt-auto">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-ink font-serif text-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-ink font-semibold tracking-wide text-xs uppercase">{testimonial.author}</h4>
                    <p className="text-ink-muted text-[10px] tracking-widest uppercase mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log('Testimonials successfully elevated.');
} else {
  console.log('Target string not found. Need manual check.');
}
