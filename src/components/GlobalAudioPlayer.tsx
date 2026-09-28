import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, Music } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export default function GlobalAudioPlayer() {
  const { currentTrack, isPlaying, progress, duration, togglePlayPause, closePlayer, seek } = useAudioPlayer();

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 z-[60] w-[calc(100%-3rem)] max-w-sm sm:max-w-md md:max-w-xl"
        >
          <div className="bg-canvas/85 backdrop-blur-2xl border border-border-subtle p-3 rounded-full shadow-2xl flex items-center gap-4 group">
            {/* Cover Art */}
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-zinc-100 overflow-hidden border border-border-subtle flex items-center justify-center relative">
              {currentTrack.coverUrl ? (
                <img src={currentTrack.coverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <Music size={18} className="text-ink-muted" />
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-0.5">
                  <div className="w-0.5 h-3 bg-white rounded-full animate-[bounce_1s_infinite_ease-in-out_0ms]" />
                  <div className="w-0.5 h-4 bg-white rounded-full animate-[bounce_1s_infinite_ease-in-out_200ms]" />
                  <div className="w-0.5 h-2 bg-white rounded-full animate-[bounce_1s_infinite_ease-in-out_400ms]" />
                </div>
              )}
            </div>

            {/* Info & Progress */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="truncate pr-4">
                  <h4 className="text-[13px] font-semibold text-ink truncate tracking-wide">{currentTrack.title}</h4>
                  <p className="text-[10px] text-ink-muted uppercase tracking-widest truncate mt-0.5">
                    {currentTrack.artist || 'Michael Bakare'}
                  </p>
                </div>
                <div className="text-[10px] text-ink-muted font-mono hidden sm:block tracking-wider">
                  {formatTime(progress)} / {formatTime(duration)}
                </div>
              </div>
              
              {/* Scrubber */}
              <div className="relative w-full h-1 bg-zinc-200 rounded-full overflow-hidden cursor-pointer">
                 <input 
                   type="range" 
                   min={0} 
                   max={duration || 100} 
                   value={progress} 
                   onChange={handleSeek}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 />
                 <div 
                   className="absolute top-0 left-0 h-full bg-ink origin-left transition-all duration-100 ease-linear" 
                   style={{ width: `${(progress / (duration || 1)) * 100}%` }} 
                 />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0 pr-2">
              <button 
                onClick={togglePlayPause}
                className="w-11 h-11 flex items-center justify-center bg-ink text-canvas rounded-full hover:scale-105 active:scale-95 transition-transform"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={closePlayer}
                className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-zinc-100 rounded-full transition-colors hidden sm:flex"
                aria-label="Close Player"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
