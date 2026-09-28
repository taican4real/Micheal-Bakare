const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Update imports
content = content.replace(
  "import { motion } from 'motion/react';",
  "import { motion, AnimatePresence } from 'motion/react';"
);

content = content.replace(
  "import { ArrowRight, ArrowUpRight, Library } from 'lucide-react';",
  "import { ArrowRight, ArrowUpRight, Library, ChevronLeft, ChevronRight } from 'lucide-react';"
);

// 2. Add state
const stateInsertion = `  const [featuredWorks, setFeaturedWorks] = useState<Work[]>([]);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const TESTIMONIALS = [
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
  ];

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);`;

content = content.replace(
  "  const [featuredWorks, setFeaturedWorks] = useState<Work[]>([]);\n  const [isLoadingWorks, setIsLoadingWorks] = useState(true);",
  stateInsertion
);


// 3. Replace Testimonial Section
const targetStr = `      {/* Testimonials */}
      <section className="bg-canvas border-t border-border-subtle py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <ScrollReveal>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-16 text-center md:text-left">
              Words from Collaborators
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8">
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
          </StaggerContainer>
        </div>
      </section>`;

const replaceStr = `      {/* Testimonials */}
      <section className="bg-canvas border-t border-border-subtle py-32 md:py-48 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <ScrollReveal>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-16">
              Words from Collaborators
            </h2>
          </ScrollReveal>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: easeCurve }}
                className="flex flex-col items-center bg-surface border border-border-subtle p-10 md:p-16 rounded-[2.5rem]"
              >
                <div className="text-ink-muted text-6xl font-serif leading-none mb-8 opacity-20">"</div>
                <p className="text-ink text-2xl md:text-3xl font-light leading-relaxed mb-12 italic">
                  {TESTIMONIALS[currentTestimonial].quote}
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center text-ink font-serif text-xl mb-2">
                    {TESTIMONIALS[currentTestimonial].author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-ink font-semibold tracking-wide text-sm uppercase">{TESTIMONIALS[currentTestimonial].author}</h4>
                    <p className="text-ink-muted text-xs tracking-widest uppercase mt-1">{TESTIMONIALS[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-12">
              <button onClick={prevTestimonial} className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all hover:bg-zinc-50 group">
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentTestimonial(idx)}
                    className={\`h-2 rounded-full transition-all duration-300 \${idx === currentTestimonial ? 'bg-ink w-8' : 'bg-border-subtle hover:bg-ink-muted w-2'}\`}
                    aria-label={\`View testimonial \${idx + 1}\`}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial} className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-all hover:bg-zinc-50 group">
                <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log('Testimonials converted to carousel.');
} else {
  console.log('Target string not found.');
}
