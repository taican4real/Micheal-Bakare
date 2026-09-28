const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = `        </div>
      </section>

      {/* Legacy Teaser */}`;

const replaceStr = `        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-canvas border-t border-border-subtle py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <ScrollReveal>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-16 text-center md:text-left">
              Words from Collaborators
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-12 lg:gap-16">
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
          </StaggerContainer>
        </div>
      </section>

      {/* Legacy Teaser */}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log('Testimonials added to Home.tsx');
} else {
  console.log('Target string not found');
}
