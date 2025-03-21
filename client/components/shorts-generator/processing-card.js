"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProcessingCard({ progress, videoName, videoContext, transcript }) {
  const [activeTab, setActiveTab] = useState("processing");
  
  const getStepStatus = (threshold) => {
    if (progress >= threshold) {
      return "complete";
    }
    if (progress > threshold - 25) {
      return "in-progress";
    }
    return "pending";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Processing Video</h3>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">
              {progress < 100 ? `${progress}%` : "Complete"}
            </span>
          </div>
          
          <Progress value={progress} className="h-2.5 bg-accent/20" />
          
          <p className="text-sm text-muted-foreground">
            {videoName}
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="processing">Processing Steps</TabsTrigger>
            <TabsTrigger value="transcript" disabled={!transcript}>Transcript</TabsTrigger>
          </TabsList>
          
          <TabsContent value="processing">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className={`flex-none w-8 h-8 flex items-center justify-center rounded-full ${
                  getStepStatus(25) === 'complete' ? 'bg-green-100 text-green-600' : 
                  getStepStatus(25) === 'in-progress' ? 'bg-primary/20 text-primary animate-pulse' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {getStepStatus(25) === 'complete' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Extract Audio</h4>
                  <p className="text-sm text-muted-foreground">
                    Extracting audio from video file for processing
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`flex-none w-8 h-8 flex items-center justify-center rounded-full ${
                  getStepStatus(50) === 'complete' ? 'bg-green-100 text-green-600' : 
                  getStepStatus(50) === 'in-progress' ? 'bg-primary/20 text-primary animate-pulse' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {getStepStatus(50) === 'complete' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Generate Transcript</h4>
                  <p className="text-sm text-muted-foreground">
                    Creating a detailed transcript with timestamps
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`flex-none w-8 h-8 flex items-center justify-center rounded-full ${
                  getStepStatus(75) === 'complete' ? 'bg-green-100 text-green-600' : 
                  getStepStatus(75) === 'in-progress' ? 'bg-primary/20 text-primary animate-pulse' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {getStepStatus(75) === 'complete' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Analyze Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Using AI to identify the most engaging moments
                  </p>
                  {videoContext && (
                    <div className="mt-2 p-2 bg-accent/10 rounded-md border border-accent/30 text-xs">
                      <span className="font-medium">Using your context:</span> {videoContext.contentType} 
                      {videoContext.targetAudience && ` for ${videoContext.targetAudience}`}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`flex-none w-8 h-8 flex items-center justify-center rounded-full ${
                  getStepStatus(100) === 'complete' ? 'bg-green-100 text-green-600' : 
                  getStepStatus(100) === 'in-progress' ? 'bg-primary/20 text-primary animate-pulse' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {getStepStatus(100) === 'complete' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  ) : (
                    <span>4</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Generate Shorts</h4>
                  <p className="text-sm text-muted-foreground">
                    Creating optimized short video clips
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transcript">
            {transcript ? (
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Full transcript of your video content with timestamps:
                </p>
                
                <div className="space-y-3">
                  {transcript.segments.map((segment, index) => (
                    <div key={index} className="p-3 rounded-md hover:bg-accent/5 transition-colors">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs font-mono text-primary">
                          {Math.floor(segment.start / 60)}:{String(Math.floor(segment.start % 60)).padStart(2, '0')} - 
                          {Math.floor(segment.end / 60)}:{String(Math.floor(segment.end % 60)).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(segment.end - segment.start)}s
                        </span>
                      </div>
                      <p className="text-sm">{segment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground">Transcript will appear here once processing is complete.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
