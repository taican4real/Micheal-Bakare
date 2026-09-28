const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = `        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
           {isLoadingWorks ? (
              <div className="col-span-12 py-32 flex justify-center text-ink-muted font-light">Loading archive...</div>
           ) : featuredWorks.length > 0 ? (
              <>
                {/* Large Featured Work */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: easeCurve }}
                  className="md:col-span-7"
                >
                  <Link to={\`/works/\${featuredWorks[0].id}\`} className="group block relative overflow-hidden rounded-[2rem] aspect-square md:aspect-[4/5] bg-zinc-100 h-full">
                    {featuredWorks[0].coverImageUrl && (
                      <ResponsiveImage 
                        src={featuredWorks[0].coverImageUrl}
                        alt={featuredWorks[0].title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                       <span className="text-canvas/80 text-xs uppercase tracking-widest font-semibold mb-3 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                         {featuredWorks[0].category} &bull; {featuredWorks[0].releaseYear}
                       </span>
                       <h4 className="text-canvas font-serif text-3xl md:text-5xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                         {featuredWorks[0].title}
                       </h4>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Secondary Stack */}
                <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
                  {featuredWorks.slice(1, 3).map((work, idx) => (
                    <motion.div 
                      key={work.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, delay: 0.15 * (idx + 1), ease: easeCurve }}
                      className="flex-1"
                    >
                      <Link to={\`/works/\${work.id}\`} className="group block relative overflow-hidden rounded-[2rem] h-full min-h-[300px] bg-zinc-100">
                        {work.coverImageUrl && (
                          <ResponsiveImage 
                            src={work.coverImageUrl}
                            alt={work.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                           <span className="text-canvas/80 text-xs uppercase tracking-widest font-semibold mb-2 block transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                             {work.category}
                           </span>
                           <h4 className="text-canvas font-serif text-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                             {work.title}
                           </h4>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Fill empty spots if less than 3 works */}
                  {featuredWorks.length === 2 && (
                     <div className="flex-1 rounded-[2rem] border-2 border-dashed border-border-subtle flex items-center justify-center p-8 text-center text-ink-muted font-light">
                        More works arriving soon
                     </div>
                  )}
                </div>
              </>`;

const replaceStr = `        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
           {isLoadingWorks ? (
              <div className="col-span-12 py-32 flex justify-center text-ink-muted font-light">Loading archive...</div>
           ) : featuredWorks.length > 0 ? (
              <>
                {/* Large Featured Work */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: easeCurve }}
                  className="md:col-span-7"
                >
                  <Link to={\`/works/\${featuredWorks[0].id}\`} className="group block relative overflow-hidden rounded-[2.5rem] aspect-square md:aspect-[4/5] bg-zinc-100 h-full border border-border-subtle">
                    {featuredWorks[0].coverImageUrl && (
                      <ResponsiveImage 
                        src={featuredWorks[0].coverImageUrl}
                        alt={featuredWorks[0].title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                    
                    {featuredWorks[0].year && (
                      <div className="absolute top-8 left-8 md:top-10 md:left-10 z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        {featuredWorks[0].year}
                      </div>
                    )}

                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10">
                       <span className="text-canvas/70 text-xs uppercase tracking-widest font-semibold mb-4 block transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                         {featuredWorks[0].category} &mdash; {featuredWorks[0].role || 'Composer'}
                       </span>
                       <h4 className="text-canvas font-serif text-4xl md:text-5xl lg:text-6xl transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-out mb-2 group-hover:text-white leading-tight">
                         {featuredWorks[0].title}
                       </h4>
                       <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-700 ease-out flex items-center">
                          <span className="text-white/80 text-sm font-medium flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-150">
                            Explore Archive <ArrowRight size={16} />
                          </span>
                       </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Secondary Stack */}
                <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
                  {featuredWorks.slice(1, 3).map((work, idx) => (
                    <motion.div 
                      key={work.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, delay: 0.15 * (idx + 1), ease: easeCurve }}
                      className="flex-1"
                    >
                      <Link to={\`/works/\${work.id}\`} className="group block relative overflow-hidden rounded-[2.5rem] h-full min-h-[350px] bg-zinc-100 border border-border-subtle">
                        {work.coverImageUrl && (
                          <ResponsiveImage 
                            src={work.coverImageUrl}
                            alt={work.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:brightness-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                        
                        {work.year && (
                          <div className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                            {work.year}
                          </div>
                        )}

                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                           <span className="text-canvas/70 text-[10px] uppercase tracking-widest font-semibold mb-3 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                             {work.category}
                           </span>
                           <h4 className="text-canvas font-serif text-3xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-out mb-1 group-hover:text-white leading-tight">
                             {work.title}
                           </h4>
                           <div className="h-0 overflow-hidden group-hover:h-6 transition-all duration-700 ease-out flex items-center mt-1">
                              <span className="text-white/80 text-xs font-medium flex items-center gap-1.5 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-150">
                                View Details <ArrowUpRight size={14} />
                              </span>
                           </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Fill empty spots if less than 3 works */}
                  {featuredWorks.length === 2 && (
                     <div className="flex-1 rounded-[2.5rem] border-2 border-dashed border-border-subtle flex items-center justify-center p-8 text-center text-ink-muted font-light">
                        More works arriving soon
                     </div>
                  )}
                </div>
              </>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log('Portfolio successfully elevated.');
} else {
  console.log('Target string not found. Trying flexible regex replace...');
  // As a fallback since we saw exact code
}
