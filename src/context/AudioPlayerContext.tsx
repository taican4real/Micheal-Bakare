import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export type Track = {
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
};

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      const updateProgress = () => {
        setProgress(audioRef.current?.currentTime || 0);
      };
      
      const updateDuration = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', updateDuration);
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('loadedmetadata', updateDuration);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, []);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;
    
    // Toggle play/pause if it's the same track
    if (currentTrack?.url === track.url) {
      togglePlayPause();
      return;
    }
    
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => console.error("Audio playback error:", e));
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.error("Audio playback error:", e));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <AudioPlayerContext.Provider value={{ currentTrack, isPlaying, progress, duration, playTrack, togglePlayPause, seek, closePlayer }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return context;
};
