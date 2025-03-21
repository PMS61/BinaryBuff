"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function VideoPreview({ src, poster, aspectRatio = "16/9", controls = true }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const isYoutubeVideo = src?.includes('youtube.com/embed/') || src?.includes('youtu.be/');

  useEffect(() => {
    if (isYoutubeVideo) return; // Skip for YouTube videos
    
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnd = () => setIsPlaying(false);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnd);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnd);
    };
  }, [isYoutubeVideo]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (isYoutubeVideo) return; // Skip for YouTube videos
    
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    if (isYoutubeVideo) return; // Skip for YouTube videos
    
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleSeek = (e) => {
    if (isYoutubeVideo) return; // Skip for YouTube videos
    
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  // If it's a YouTube video, render an iframe instead
  if (isYoutubeVideo) {
    return (
      <div 
        className="relative rounded-lg overflow-hidden"
        style={{ aspectRatio }}
      >
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        />
      </div>
    );
  }

  return (
    <div 
      className="relative group rounded-lg overflow-hidden"
      style={{ aspectRatio }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        onClick={togglePlay}
      />
      
      {/* Play/Pause overlay button */}
      <div className={`absolute inset-0 flex items-center justify-center ${isPlaying ? 'opacity-0' : 'opacity-100'} transition-opacity group-hover:opacity-100`}>
        <Button 
          variant="outline" 
          className="rounded-full w-12 h-12 p-0 text-white bg-black/50 border-white/30 hover:bg-black/70"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </Button>
      </div>
      
      {/* Video controls */}
      {controls && !isYoutubeVideo && (
        <div className={`absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-white">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 rounded-full bg-white/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <span className="text-xs text-white">{formatTime(duration)}</span>
          </div>
          
          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </Button>
              
              {/* Volume control */}
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={() => setVolume(volume === 0 ? 1 : 0)}
                >
                  {volume === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>
            
            {/* Full screen button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={() => videoRef.current?.requestFullscreen()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
