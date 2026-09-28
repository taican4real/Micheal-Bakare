const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = `      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">`;

const replacementStr = `      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-canvas/85 backdrop-blur-sm z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply"
          >
            {/* Elegant abstract fluid motion placeholder */}
            <source src="https://cdn.pixabay.com/video/2020/05/25/40141-424881062_large.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">`;

if (home.includes(targetStr)) {
  home = home.replace(targetStr, replacementStr);
  fs.writeFileSync('src/pages/Home.tsx', home);
  console.log('Home.tsx patched successfully');
} else {
  console.log('Target string not found');
}
