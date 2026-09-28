const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

if (!css.includes('focus-visible')) {
  css = css.replace(
    `  body {
    @apply bg-canvas text-ink antialiased selection:bg-zinc-200;
  }`,
    `  body {
    @apply bg-canvas text-ink antialiased selection:bg-zinc-200;
  }
  
  /* Global Accessibility Focus States */
  a, button, input, textarea, select {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas;
  }`
  );
  
  fs.writeFileSync('src/index.css', css);
  console.log('CSS updated with focus states');
}
