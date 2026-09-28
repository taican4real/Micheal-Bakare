const fs = require('fs');
let works = fs.readFileSync('src/pages/Works.tsx', 'utf8');

if (!works.includes('useAudioPlayer')) {
  // 1. Add import
  works = works.replace(
    "import { motion, AnimatePresence } from 'motion/react';",
    "import { motion, AnimatePresence } from 'motion/react';\nimport { Play, Pause } from 'lucide-react';\nimport { useAudioPlayer } from '../context/AudioPlayerContext';"
  );
  
  // 2. Add hook call
  works = works.replace(
    "const [searchQuery, setSearchQuery] = useState('');",
    "const [searchQuery, setSearchQuery] = useState('');\n  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();"
  );
  
  // 3. Add play button to Masonry card
  const overlayMetadataStr = `{/* Overlay Metadata */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />`;
  
  const playButtonStr = `{/* Overlay Metadata */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                        
                        {/* Audio Play Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            playTrack({
                              title: item.title,
                              artist: item.role || 'Michael Bakare',
                              url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_40df06a3e5.mp3', // Placeholder piano track
                              coverUrl: item.coverImageUrl
                            });
                          }}
                          className="absolute bottom-6 right-6 z-40 w-12 h-12 bg-canvas text-ink rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150 hover:scale-105 shadow-xl"
                        >
                          {currentTrack?.title === item.title && isPlaying ? (
                            <Pause size={20} fill="currentColor" />
                          ) : (
                            <Play size={20} fill="currentColor" className="ml-1" />
                          )}
                        </button>`;
                        
  works = works.replace(overlayMetadataStr, playButtonStr);
  
  fs.writeFileSync('src/pages/Works.tsx', works);
  console.log('Works patched with Play button');
}
