"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VideoPreview } from "@/components/ui/video-preview";
import { ContextModal } from "@/components/shorts-generator/context-modal";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processVideo, getProcessingStatus } from "@/lib/api";

export function UploadCard({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [videoContext, setVideoContext] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeLinkError, setYoutubeLinkError] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [youtubeVideoData, setYoutubeVideoData] = useState(null);
  const [loadingYoutubePreview, setLoadingYoutubePreview] = useState(false);
  const fileInputRef = useRef(null);
  const [processingJobId, setProcessingJobId] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);

  useEffect(() => {
    // Clean up video URL when component unmounts or file changes
    return () => {
      if (videoUrl && !youtubeVideoData) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl, youtubeVideoData]);

  useEffect(() => {
    // Poll for processing status if we have a job ID
    let intervalId;
    
    if (processingJobId && uploading) {
      intervalId = setInterval(async () => {
        try {
          const status = await getProcessingStatus(processingJobId);
          
          setUploadProgress(status.progress);
          
          if (status.status === 'completed') {
            setUploading(false);
            clearInterval(intervalId);
            
            // Save transcript data
            if (status.transcript) {
              setTranscriptData(status.transcript);
            }
            
            // Prepare data for the parent component
            setTimeout(() => {
              onUploadComplete({
                id: Date.now(),
                name: file ? file.name : youtubeVideoData.title || "YouTube Video",
                duration: status.videoInfo?.lengthSeconds || (file ? Math.floor(Math.random() * 600) + 120 : "Unknown"),
                uploadDate: new Date().toISOString(),
                thumbnailUrl: status.videoInfo?.thumbnailUrl || "/placeholder-thumbnail.jpg",
                videoUrl: videoUrl,
                context: videoContext,
                isYoutubeVideo: !!youtubeVideoData,
                jobId: processingJobId,
                transcript: status.transcript
              });
            }, 1000);
          } else if (status.status === 'failed') {
            setUploading(false);
            setProcessingError(status.error || "Processing failed");
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error checking processing status:", error);
        }
      }, 2000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [processingJobId, uploading, onUploadComplete, file, youtubeVideoData, videoUrl, videoContext]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return;
    }
    
    // Revoke previous URL if it exists
    if (videoUrl && !youtubeVideoData) {
      URL.revokeObjectURL(videoUrl);
    }
    
    // Create a URL for the video
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setFile(file);
    setYoutubeVideoData(null);
  };

  const validateYoutubeUrl = (url) => {
    // Regular expression to validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(&.*)?$/;
    return youtubeRegex.test(url);
  };

  const extractYoutubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleYoutubeLinkSubmit = async () => {
    if (!validateYoutubeUrl(youtubeLink)) {
      setYoutubeLinkError("Please enter a valid YouTube URL");
      return;
    }
    
    setYoutubeLinkError("");
    setLoadingYoutubePreview(true);
    
    try {
      // Extract video ID
      const videoId = extractYoutubeVideoId(youtubeLink);
      
      if (!videoId) {
        throw new Error("Could not extract video ID");
      }
      
      // In a real implementation, you would make an API call to get video info
      // For this example, we'll simulate fetching video data
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      
      // YouTube embed URL
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
      setYoutubeVideoData({
        id: videoId,
        title: "YouTube Video",  // In a real implementation, we would get this from the API
        thumbnailUrl: thumbnailUrl,
        videoUrl: embedUrl,
        duration: "Unknown",  // Would come from API
        isYoutubeVideo: true
      });
      
      setVideoUrl(embedUrl);
      setFile(null);
      
    } catch (error) {
      console.error("Error fetching YouTube video data:", error);
      setYoutubeLinkError("Could not load video data. Please check the URL and try again.");
    } finally {
      setLoadingYoutubePreview(false);
    }
  };

  const handleContextSubmit = (contextData) => {
    setVideoContext(contextData);
    setIsContextModalOpen(false);
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          // Simulate processing delay
          setTimeout(() => {
            onUploadComplete({
              id: Date.now(),
              name: file ? file.name : youtubeVideoData.title || "YouTube Video",
              duration: file ? Math.floor(Math.random() * 600) + 120 : youtubeVideoData.duration || "Unknown",
              uploadDate: new Date().toISOString(),
              thumbnailUrl: youtubeVideoData ? youtubeVideoData.thumbnailUrl : "/placeholder-thumbnail.jpg",
              videoUrl: videoUrl,
              context: videoContext,
              isYoutubeVideo: !!youtubeVideoData
            });
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const startRealProcessing = async () => {
    setUploading(true);
    setUploadProgress(0);
    setProcessingError(null);
    
    try {
      // Prepare data for API
      const videoData = {
        file: file,
        videoUrl: youtubeVideoData?.videoUrl,
        isYoutubeVideo: !!youtubeVideoData,
        context: videoContext
      };
      
      // Send to the backend
      const response = await processVideo(videoData);
      
      // Store the job ID for status polling
      setProcessingJobId(response.jobId);
    } catch (error) {
      console.error("Error starting video processing:", error);
      setUploading(false);
      setProcessingError("Failed to process video. Please try again.");
    }
  };

  const handleUpload = () => {
    if (!file && !youtubeVideoData) return;
    setIsContextModalOpen(true);
  };

  const startUpload = () => {
    // Determine whether to use the real API or the simulation
    const useRealBackend = process.env.NEXT_PUBLIC_USE_REAL_BACKEND === "true";
    
    if (useRealBackend) {
      startRealProcessing();
    } else {
      simulateUpload();
    }
  };

  const resetForm = () => {
    if (videoUrl && !youtubeVideoData) {
      URL.revokeObjectURL(videoUrl);
    }
    setFile(null);
    setVideoUrl(null);
    setYoutubeVideoData(null);
    setVideoContext(null);
    setYoutubeLink("");
    setYoutubeLinkError("");
  };

  const hasVideoContent = !!file || !!youtubeVideoData;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!hasVideoContent ? (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
            <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-0">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-primary/20 rounded-full p-4 animated-gradient">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="36" 
                    height="36" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-white"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m16 16-4-4-4 4"></path>
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-1">Upload your video</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Drag and drop your video file here, or click to browse
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="mx-auto"
                  >
                    Select Video
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="video/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="youtube" className="mt-0">
            <div className="border-2 border-dashed rounded-lg p-8 transition-colors border-border">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-secondary/20 rounded-full p-4 animated-gradient">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="36" 
                    height="36" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-secondary"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                    <path d="m10 15 5-3-5-3z"></path>
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-1">Add YouTube Video</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Paste a YouTube video link to generate shorts
                  </p>
                  <div className="flex gap-2 max-w-md mx-auto">
                    <Input
                      type="text"
                      placeholder="https://youtube.com/watch?v=..."
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      className={youtubeLinkError ? "border-destructive" : ""}
                    />
                    <Button 
                      onClick={handleYoutubeLinkSubmit}
                      disabled={loadingYoutubePreview || !youtubeLink}
                    >
                      {loadingYoutubePreview ? "Loading..." : "Add"}
                    </Button>
                  </div>
                  {youtubeLinkError && (
                    <p className="text-destructive text-xs mt-2">{youtubeLinkError}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div 
          className="border-2 border-dashed rounded-lg p-8 transition-colors bg-secondary/10 border-border"
        >
          <div className="w-full">
            <div className="mb-6 max-w-md mx-auto overflow-hidden rounded-lg border-2 border-primary shadow-lg shadow-primary/20">
              {youtubeVideoData ? (
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <iframe 
                    src={videoUrl} 
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              ) : (
                <VideoPreview src={videoUrl} aspectRatio="16/9" />
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-4 p-3 bg-accent/10 rounded-lg border border-accent/30">
              <div className="bg-primary/10 rounded-full p-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="m17 9-6 6-4-4"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium truncate">
                  {file ? file.name : youtubeVideoData.title || "YouTube Video"}
                  {youtubeVideoData && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      YouTube
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 
                   youtubeVideoData ? `Video ID: ${youtubeVideoData.id}` : ""}
                </p>
              </div>
              {!uploading && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetForm}
                >
                  Change
                </Button>
              )}
            </div>

            {videoContext && (
              <div className="mb-4 p-3 bg-secondary/20 rounded-lg border border-secondary/40">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium">Video Context Added</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsContextModalOpen(true)}
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
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                      <path d="m15 5 4 4"></path>
                    </svg>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-1 font-medium capitalize">{videoContext.contentType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Audience:</span>
                    <span className="ml-1 font-medium">{videoContext.targetAudience || "Not specified"}</span>
                  </div>
                </div>
                {videoContext.keywords?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {videoContext.keywords.map((keyword, i) => (
                      <span key={i} className="px-2 py-0.5 bg-accent/30 text-accent-foreground rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {uploading ? (
              <div className="space-y-2">
                <Progress 
                  value={uploadProgress} 
                  className="h-2.5 bg-accent/30"
                />
                <p className="text-xs text-center text-muted-foreground">
                  {uploadProgress < 20 && "Preparing your video..."}
                  {uploadProgress >= 20 && uploadProgress < 40 && "Extracting audio..."}
                  {uploadProgress >= 40 && uploadProgress < 60 && "Generating transcript..."}
                  {uploadProgress >= 60 && uploadProgress < 80 && "Analyzing content..."}
                  {uploadProgress >= 80 && uploadProgress < 100 && "Finding engaging moments..."}
                  {uploadProgress === 100 && "Processing complete!"}
                </p>
                
                {processingError && (
                  <div className="p-3 mt-2 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
                    <p className="font-medium">Processing Error:</p>
                    <p>{processingError}</p>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={videoContext ? startUpload : handleUpload} 
                className="w-full bg-primary hover:bg-primary/90 group relative overflow-hidden"
              >
                <span className="relative z-10">
                  {videoContext ? "Start Processing" : "Add Context & Generate Shorts"}
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-chart-1 to-chart-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-center mt-4 text-muted-foreground">
        {activeTab === "upload" && !hasVideoContent ? 
          "Supported formats: MP4, MOV, AVI, WMV, WEBM (max 500MB)" :
          "Generate shorts from YouTube videos or your own uploaded content"}
      </p>
      
      <ContextModal 
        isOpen={isContextModalOpen}
        onClose={() => {
          setIsContextModalOpen(false);
          // If they're closing without saving and don't have context yet, treat as skip
          if (!videoContext) {
            startUpload();
          }
        }}
        onSubmit={handleContextSubmit}
      />
    </div>
  );
}
