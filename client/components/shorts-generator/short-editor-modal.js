"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ShortEditorModal({ short, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("trim");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [title, setTitle] = useState(short?.title || "");
  const [captions, setCaptions] = useState("");
  
  const videoRef = useRef(null);
  const isYoutubeVideo = short?.isYoutubeVideo || short?.videoUrl?.includes('youtube.com/embed/');
  
  // Convert timestamp string "1:30" to seconds (90)
  const timestampToSeconds = (timestamp) => {
    if (!timestamp) return 0;
    const parts = timestamp.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };
  
  // Convert seconds to timestamp string (90 => "1:30")
  const secondsToTimestamp = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // If it's a YouTube video, we can't directly control it
    if (isYoutubeVideo) {
      // Set some default duration for YouTube videos
      setDuration(60);
      setTrimEnd(60);
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setTrimEnd(video.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isYoutubeVideo]);

  useEffect(() => {
    // Set initial trim values from the short's timestamp if available
    if (short && short.timestamp) {
      const timestampSeconds = timestampToSeconds(short.timestamp);
      setTrimStart(timestampSeconds);
      
      // If we have duration info, set trim end
      if (short.duration) {
        const durationSeconds = timestampToSeconds(short.duration);
        setTrimEnd(timestampSeconds + durationSeconds);
      }
    }
  }, [short]);

  const togglePlay = () => {
    if (isYoutubeVideo) return;
    
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      // If at trim end, go back to trim start
      if (currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrimStartChange = (value) => {
    const newStart = value[0];
    if (newStart < trimEnd) {
      setTrimStart(newStart);
      
      // Update video position if playing or if current time is out of bounds
      if (!isYoutubeVideo && videoRef.current) {
        if (currentTime < newStart || isPlaying) {
          videoRef.current.currentTime = newStart;
        }
      }
    }
  };

  const handleTrimEndChange = (value) => {
    const newEnd = value[0];
    if (newEnd > trimStart) {
      setTrimEnd(newEnd);
      
      // If current time is after new end, update position
      if (!isYoutubeVideo && videoRef.current && currentTime > newEnd) {
        videoRef.current.currentTime = newEnd;
      }
    }
  };

  const handleSaveChanges = () => {
    const updatedShort = {
      ...short,
      title,
      captions,
      trimStart,
      trimEnd,
      duration: secondsToTimestamp(trimEnd - trimStart),
      timestamp: secondsToTimestamp(trimStart)
    };
    
    onSave(updatedShort);
    onClose();
  };

  // Preview the trimmed section
  const previewTrim = () => {
    if (isYoutubeVideo) return;
    
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = trimStart;
    video.play();
    setIsPlaying(true);
    
    // Set up a timer to pause at trim end
    const checkTimeInterval = setInterval(() => {
      if (video.currentTime >= trimEnd) {
        video.pause();
        setIsPlaying(false);
        clearInterval(checkTimeInterval);
      }
    }, 100);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-card rounded-lg overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-xl border border-primary/30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/10 via-background to-background">
          <h3 className="font-medium">
            Edit Short: {short.title}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Video preview area */}
          <div className="p-4 border-r border-border md:w-3/5">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border bg-black aspect-[9/16] relative">
              {isYoutubeVideo ? (
                <iframe
                  src={short.videoUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={short.videoUrl}
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                  onClick={togglePlay}
                />
              )}
              
              {!isYoutubeVideo && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>{secondsToTimestamp(currentTime)}</span>
                    <span>{secondsToTimestamp(duration)}</span>
                  </div>
                  <div className="relative h-1 bg-white/30 rounded-full mb-4">
                    <div 
                      className="absolute h-full bg-primary rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute h-6 w-2 bg-primary rounded-full -mt-2.5 transform -translate-x-1/2"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute h-full bg-accent/50 rounded-full"
                      style={{ 
                        left: `${(trimStart / duration) * 100}%`,
                        width: `${((trimEnd - trimStart) / duration) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:bg-white/20"
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={previewTrim}
                    >
                      Preview Trim
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Edit controls area */}
          <div className="p-4 md:flex-1 overflow-y-auto">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="trim">Trim Video</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trim" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Trim Start</h4>
                      <span className="text-xs bg-primary/10 rounded px-2 py-1 text-primary">
                        {secondsToTimestamp(trimStart)}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[trimStart]}
                      max={duration}
                      step={0.1}
                      onValueChange={handleTrimStartChange}
                      className="my-4"
                    />
                    <div className="flex justify-between">
                      <Button size="sm" variant="outline" onClick={() => handleTrimStartChange([Math.max(0, trimStart - 1)])}>-1s</Button>
                      <Button size="sm" variant="outline" onClick={() => handleTrimStartChange([Math.min(trimEnd - 1, trimStart + 1)])}>+1s</Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Trim End</h4>
                      <span className="text-xs bg-primary/10 rounded px-2 py-1 text-primary">
                        {secondsToTimestamp(trimEnd)}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[trimEnd]}
                      max={duration}
                      step={0.1}
                      onValueChange={handleTrimEndChange}
                      className="my-4"
                    />
                    <div className="flex justify-between">
                      <Button size="sm" variant="outline" onClick={() => handleTrimEndChange([Math.max(trimStart + 1, trimEnd - 1)])}>-1s</Button>
                      <Button size="sm" variant="outline" onClick={() => handleTrimEndChange([Math.min(duration, trimEnd + 1)])}>+1s</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="mb-2">
                      <span className="text-sm font-medium">Current Duration: </span>
                      <span className="text-sm font-bold text-primary">{secondsToTimestamp(trimEnd - trimStart)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setTrimStart(0);
                          setTrimEnd(duration);
                        }}
                      >
                        Reset Trim
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={previewTrim}
                        disabled={isYoutubeVideo}
                      >
                        Preview Trim
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Title</label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter a catchy title for your short"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Captions</label>
                  <Textarea
                    value={captions}
                    onChange={(e) => setCaptions(e.target.value)}
                    placeholder="Add captions for your short (optional)"
                    rows={4}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCaptions(short.transcript || "")}
                    disabled={!short.transcript}
                    className="w-full"
                  >
                    Use AI-Generated Transcript
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="p-4 border-t border-border bg-gradient-to-r from-background via-background to-primary/10">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
