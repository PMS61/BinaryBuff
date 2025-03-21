"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/ui/video-preview";

export function VideoPreviewModal({ video, onClose, onEdit }) {
  const modalRef = useRef(null);
  const isYoutubeVideo = video?.isYoutubeVideo || video?.videoUrl?.includes('youtube.com/embed/');

  useEffect(() => {
    // Enable pressing escape to close the modal
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleEdit = () => {
    if (onEdit) onEdit(video);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="relative bg-card rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-xl border border-primary/30"
        onClick={handleModalClick}
      >
        <div className="p-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/10 via-background to-background">
          <h3 className="font-medium truncate">
            {video.title || video.name}
            {isYoutubeVideo && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                YouTube
              </span>
            )}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </Button>
        </div>
        
        <div className="p-4">
          <VideoPreview 
            src={video.videoUrl} 
            poster={video.thumbnailUrl} 
            aspectRatio={video.isShort ? "9/16" : "16/9"}
            controls={true}
          />
        </div>
        
        {video.isShort && (
          <div className="p-4 border-t border-border bg-gradient-to-r from-background via-background to-primary/10">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div>
                <p className="text-sm mb-1">Short #{video.id}</p>
                <p className="text-xs text-muted-foreground">Duration: {video.duration}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleEdit}
                  className="flex-1 sm:flex-none"
                >
                  Edit & Trim
                </Button>
                <Button 
                  onClick={() => onClose()} 
                  className="flex-1 sm:flex-none group relative overflow-hidden"
                >
                  <span className="relative z-10">Download Short</span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-chart-1 to-chart-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {video.context && (
          <div className="px-4 pb-4">
            <div className="p-3 bg-accent/10 rounded-md border border-accent/30 text-sm">
              <div className="flex items-start gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mt-0.5 text-accent"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <div>
                  <h4 className="font-medium mb-1">Video Context</h4>
                  <p className="text-xs text-muted-foreground">{video.context?.context || "No additional context provided."}</p>
                  {video.context?.contentType && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-accent/20 text-accent-foreground rounded-full text-xs capitalize">
                        {video.context.contentType}
                      </span>
                      {video.context.targetAudience && (
                        <span className="px-2 py-0.5 bg-secondary/20 text-secondary-foreground rounded-full text-xs">
                          {video.context.targetAudience}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
