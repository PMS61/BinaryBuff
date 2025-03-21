"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/shorts-generator/video-card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ShortsCarousel({ shorts, onEdit, onPreview, onSave }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!shorts || shorts.length === 0) {
    return (
      <div className="text-center p-6 bg-card border border-border rounded-lg">
        <p className="text-muted-foreground">No shorts generated yet</p>
      </div>
    );
  }

  const handleEdit = (short) => {
    if (onEdit) onEdit({...short, index: currentIndex});
  };

  const handlePreview = (short) => {
    if (onPreview) onPreview(short);
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-6 flex items-center justify-between">
        <span>Generated Shorts</span>
        <span className="text-sm font-normal text-muted-foreground">
          {currentIndex + 1} of {shorts.length}
        </span>
      </h3>
      
      <Carousel
        className="w-full"
        onSelect={(index) => setCurrentIndex(index)}
        defaultIndex={0}
      >
        <CarouselContent>
          {shorts.map((short, index) => (
            <CarouselItem key={short.id} className="flex justify-center">
              <div className="w-full max-w-md">
                <VideoCard 
                  short={short} 
                  onEdit={() => handleEdit(short)}
                  onPreview={() => handlePreview(short)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex items-center justify-center mt-4 gap-2">
          <CarouselPrevious className="static transform-none" />
          <div className="flex gap-1">
            {shorts.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  idx === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <CarouselNext className="static transform-none" />
        </div>
      </Carousel>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-center">
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => onSave && onSave(shorts)}
        >
          Save All Shorts
        </Button>
      </div>
    </div>
  );
}
