"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/ui/video-preview";

export function VideoCard({ short, onEdit, onPreview }) {
  const [downloading, setDownloading] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const isYoutubeVideo = short?.isYoutubeVideo || short?.videoUrl?.includes('youtube.com/embed/');

  const handleDownload = () => {
    setDownloading(true);
    // Simulate download
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    console.log("Edit clicked for short:", short);
    if (onEdit) onEdit({...short, isShort: true});
  };

  const handlePreviewClick = () => {
    if (onPreview) onPreview(short);
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-colors shadow-sm hover:shadow-md hover:shadow-primary/10">
      <div 
        className="relative cursor-pointer" 
        onClick={handlePreviewClick}
      >
        <VideoPreview 
          src={short.videoUrl} 
          poster={short.thumbnailUrl} 
          aspectRatio="9/16" 
        />
        
        {/* Duration badge */}
        <div className="absolute top-2 right-2 bg-background/80 text-foreground rounded-full px-3 py-1 text-xs font-medium border border-primary/20">
          {short.duration}
        </div>
        
        {/* Timestamp badge */}
        <div className="absolute bottom-2 left-2 bg-primary/80 text-white rounded-full px-3 py-1 text-xs font-medium">
          From {short.timestamp}
        </div>
        
        {/* YouTube badge */}
        {isYoutubeVideo && (
          <div className="absolute top-2 left-2 bg-red-600 text-white rounded-full px-3 py-1 text-xs font-medium">
            YouTube
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-sm mb-1 truncate">{short.title}</h3>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1.5"></span>
              Short #{short.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-accent/20 hover:border-accent"
              title="Edit Short"
              onClick={() => setShowEditOptions(!showEditOptions)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                <path d="m15 5 4 4"></path>
              </svg>
            </Button>
          </div>
        </div>
        
        {short.explanation && (
          <div className="mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowInsights(!showInsights)} 
              className="w-full justify-between text-muted-foreground hover:text-foreground px-3 py-1 h-7 text-xs"
            >
              <span>AI Insights</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform ${showInsights ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </Button>
            
            {showInsights && (
              <div className="mt-2 p-3 bg-accent/5 rounded-md text-xs space-y-2">
                <p>{short.explanation}</p>
                
                {short.hashtags && short.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {short.hashtags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-accent/15 text-accent-foreground rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {short.transcript && (
                  <div className="mt-2 pt-2 border-t border-accent/20">
                    <p className="text-muted-foreground mb-1">Transcript:</p>
                    <p className="italic">{short.transcript}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {showEditOptions && (
          <div className="mb-3 p-3 bg-accent/10 rounded-md space-y-2 border border-accent/30">
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-medium">Adjust Short:</span>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 text-xs border-accent/40 text-accent hover:bg-accent/10"
                onClick={handleEditClick}
              >
                Edit & Trim
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={handlePreviewClick}
          >
            Preview
          </Button>
          <Button 
            className="flex-1 group relative overflow-hidden"
            onClick={handleDownload}
            disabled={downloading}
          >
            <span className="relative z-10">
              {downloading ? "Downloading..." : "Download"}
            </span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-chart-1 to-chart-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      </div>
    </div>
  );
}
