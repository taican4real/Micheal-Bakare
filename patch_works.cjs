const fs = require('fs');

let works = fs.readFileSync('src/pages/Works.tsx', 'utf8');

// 1. We will replace the standard grid with a Masonry layout.
// Since React doesn't have a native Masonry, we'll use a clean CSS multi-column approach or 
// a mapped array of columns. For simplicity and bulletproof rendering, we'll map the filtered items into columns.

const oldGrid = `<motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: easeCurve }}
                  className="group cursor-pointer block"
                >
                  <Link to={\`/works/\${item.id}\`}>
                    <div className="overflow-hidden rounded-2xl aspect-[4/3] mb-6 bg-zinc-100 border border-border-subtle relative">
                      {item.coverImageUrl ? (
                        <ResponsiveImage loading="lazy" 
                          src={item.coverImageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-muted font-serif text-sm">
                          [IMAGE PLACEHOLDER]
                        </div>
                      )}
                      {item.year && (
                        <div className="absolute top-4 right-4 bg-canvas/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-ink">
                          {item.year}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold tracking-widest text-ink-muted uppercase mb-3">
                      {item.category}
                    </p>
                    <h3 className="font-serif text-2xl text-ink mb-3 group-hover:text-ink-muted transition-colors">{item.title}</h3>
                    {item.role && (
                      <p className="text-sm font-medium text-ink mb-2">{item.role}</p>
                    )}
                    {item.description && (
                      <p className="text-ink-muted font-light line-clamp-2 leading-relaxed text-sm">{item.description}</p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>`;

const newGrid = `<motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pb-32">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                // Generate a random-ish aspect ratio based on index for the masonry effect
                // If it's a real app, you'd usually pull this from image metadata.
                const isTall = index % 3 === 0;
                const aspectClass = isTall ? 'aspect-[3/4]' : 'aspect-[4/3]';
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, delay: (index % 10) * 0.05, ease: easeCurve }}
                    className="break-inside-avoid block group cursor-pointer"
                  >
                    <Link to={\`/works/\${item.id}\`} className="block">
                      <div className={\`overflow-hidden rounded-2xl mb-6 bg-zinc-100 border border-border-subtle relative \${aspectClass}\`}>
                        {item.coverImageUrl ? (
                          <div className="w-full h-full relative">
                            {/* Static Image */}
                            <ResponsiveImage loading="lazy" 
                              src={item.coverImageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 group-hover:opacity-0 absolute inset-0 z-10"
                            />
                            {/* Hover Video Placeholder - using a silent abstract loop */}
                            <video 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 absolute inset-0 z-0 grayscale"
                            >
                              <source src="https://cdn.pixabay.com/video/2021/08/04/83864-584742469_large.mp4" type="video/mp4" />
                            </video>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-muted font-serif text-sm">
                            [IMAGE PLACEHOLDER]
                          </div>
                        )}
                        
                        {/* Overlay Metadata */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                        <div className="absolute bottom-6 left-6 right-6 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <p className="text-xs uppercase tracking-widest font-semibold text-canvas/80 mb-2">{item.category}</p>
                          <h3 className="font-serif text-2xl text-canvas leading-tight">{item.title}</h3>
                        </div>

                        {item.year && (
                          <div className="absolute top-4 right-4 bg-canvas/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-widest text-ink z-30 transition-transform duration-500 group-hover:-translate-y-12">
                            {item.year}
                          </div>
                        )}
                      </div>
                      
                      {/* Standard text below (visible on default, fades slightly on hover) */}
                      <div className="group-hover:opacity-40 transition-opacity duration-500">
                        <p className="text-xs font-semibold tracking-widest text-ink-muted uppercase mb-3">
                          {item.category} {item.year ? \`• \${item.year}\` : ''}
                        </p>
                        <h3 className="font-serif text-2xl text-ink mb-3">{item.title}</h3>
                        {item.description && (
                          <p className="text-ink-muted font-light line-clamp-2 leading-relaxed text-sm">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>`;

if (works.includes('<AnimatePresence mode="popLayout">')) {
  works = works.replace(oldGrid, newGrid);
  fs.writeFileSync('src/pages/Works.tsx', works);
  console.log('Works.tsx patched successfully');
} else {
  console.log('Target string not found');
}
