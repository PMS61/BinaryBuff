"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from "@/lib/supabase";
import { UploadCard } from "@/components/shorts-generator/upload-card";
import { ProcessingCard } from "@/components/shorts-generator/processing-card";
import { VideoPreviewModal } from "@/components/shorts-generator/video-preview-modal";
import { ShortEditorModal } from "@/components/shorts-generator/short-editor-modal";
import { ShortsCarousel } from "@/components/shorts-generator/shorts-carousel";
import { MainNav } from "@/components/main-nav";
import { videosApi } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("upload"); // upload, processing, results
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [shorts, setShorts] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [editingShort, setEditingShort] = useState(null);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        // Initialize with available user data
        setUser({
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
          name: currentUser.user_metadata?.full_name || null
        });
        
        // Get the token from supabase directly instead of using getSession
        // This assumes the getCurrentUser function already gets the session data
        try {
          // Import supabase client directly if needed
          const { supabase } = await import('@/lib/supabase');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            setUserToken(session.access_token);
          }
        } catch (sessionError) {
          console.error("Error getting session:", sessionError);
          // Continue without token - may limit functionality but won't crash
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  useEffect(() => {
    // Simulate generating shorts if in processing view
    if (currentView === "processing") {
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            generateShortsFromVideo();
            return 100;
          }
          return prev + 2;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [currentView, uploadedVideo]);

  const generateShortsFromVideo = async () => {
    try {
      // In a real implementation, we would call the API to generate shorts
      // For now, we'll generate random timestamps
      
      // Calculate a random duration for the video (between 2 and 10 minutes)
      const videoDuration = uploadedVideo.duration || Math.floor(Math.random() * 480) + 120;
      
      // Generate 5 random shorts
      const generatedShorts = Array.from({ length: 5 }, (_, i) => {
        // Generate a random start time
        const start = Math.floor(Math.random() * (videoDuration - 30));
        // Generate a random duration between 10 and 30 seconds
        const shortDuration = Math.floor(Math.random() * 20) + 10;
        const end = Math.min(start + shortDuration, videoDuration);
        
        return {
          id: `short_${i + 1}`,
          title: `Engaging Moment ${i + 1}`,
          trimStart: start,
          trimEnd: end,
          duration: `0:${shortDuration}`,
          timestamp: `${Math.floor(start / 60)}:${String(start % 60).padStart(2, '0')}`,
          thumbnailUrl: `/placeholder-thumbnail-${i % 3 + 1}.jpg`,
          videoUrl: uploadedVideo.videoUrl,
          isShort: true,
          isYoutubeVideo: uploadedVideo.isYoutubeVideo,
          context: uploadedVideo.context,
          transcript: "This is a sample transcript for this short clip."
        };
      });
      
      setShorts(generatedShorts);
      setCurrentView("results");
      
    } catch (error) {
      console.error("Error generating shorts:", error);
    }
  };

  const handleUploadComplete = (videoData) => {
    setUploadedVideo(videoData);
    setCurrentView("processing");
    setProcessingProgress(0);
  };

  const handleNewUpload = () => {
    setCurrentView("upload");
    setUploadedVideo(null);
    setProcessingProgress(0);
    setShorts([]);
  };

  const handlePreviewOriginalVideo = () => {
    if (uploadedVideo) {
      setPreviewVideo({
        ...uploadedVideo,
        title: uploadedVideo.name,
        isShort: false
      });
    }
  };

  const handlePreviewShort = (short) => {
    setPreviewVideo(short);
  };

  const handleEditShort = (short) => {
    console.log("Opening editor for short:", short);
    // Make sure the short has isShort property for the VideoPreviewModal
    if (!short.isShort) {
      short.isShort = true;
    }
    setEditingShort(short);
  };

  const handleSaveEditedShort = (updatedShort) => {
    console.log("Saving edited short:", updatedShort);
    // Update the short in the shorts list
    const updatedShorts = shorts.map(s => 
      s.id === updatedShort.id ? updatedShort : s
    );
    setShorts(updatedShorts);
    setEditingShort(null);
  };

  const handleSaveAllShorts = async (allShorts) => {
    console.log("Saving all shorts:", allShorts);
    // In a real implementation, we would call the API to save all shorts
    // For now, we'll just simulate a success message
    alert("All shorts saved successfully!");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav user={user} onSignOut={handleSignOut} showAuthButtons={false} />
      
      <main className="flex-1 p-6 bg-gradient-to-b from-background to-background via-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm mr-3">AI-Powered</span>
              YouTube Shorts Generator
            </h1>
            <p className="text-muted-foreground">
              Upload your video and we'll find the most engaging moments to create viral shorts
            </p>
          </div>
          
          {currentView === "upload" && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-lg">
              <UploadCard onUploadComplete={handleUploadComplete} />
            </div>
          )}
          
          {currentView === "processing" && uploadedVideo && (
            <div className="mb-8">
              <ProcessingCard 
                progress={processingProgress} 
                videoName={uploadedVideo.name}
                videoContext={uploadedVideo.context}
              />
            </div>
          )}
          
          {currentView === "results" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border shadow-md">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="w-2 h-5 bg-primary rounded-sm mr-2 inline-block"></span>
                  Generated Shorts
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePreviewOriginalVideo} className="border-accent/50 text-accent hover:bg-accent/10">
                    Preview Original
                  </Button>
                  <Button onClick={handleNewUpload} className="bg-primary hover:bg-primary/90">
                    Upload New Video
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                  <ShortsCarousel 
                    shorts={shorts}
                    onPreview={handlePreviewShort}
                    onEdit={handleEditShort}
                    onSave={handleSaveAllShorts}
                  />
                </div>
              </div>
            </div>
          )}
          
          {currentView !== "upload" && uploadedVideo && (
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-1.5 h-4 bg-accent rounded-sm mr-2 inline-block"></span>
                Video Details
              </h2>
              <div className="overflow-x-auto bg-card rounded-lg border border-border shadow-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/10">
                      <th className="py-3 px-4 text-left font-medium">Video</th>
                      <th className="py-3 px-4 text-left font-medium">Source</th>
                      <th className="py-3 px-4 text-left font-medium">Uploaded</th>
                      <th className="py-3 px-4 text-left font-medium">Duration</th>
                      <th className="py-3 px-4 text-left font-medium">Shorts</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-secondary/5">
                      <td className="py-3 px-4">{uploadedVideo.name}</td>
                      <td className="py-3 px-4">
                        {uploadedVideo.isYoutubeVideo ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">YouTube</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">Local File</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(uploadedVideo.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {typeof uploadedVideo.duration === 'number' ? 
                          `${Math.floor(uploadedVideo.duration / 60)}:${String(uploadedVideo.duration % 60).padStart(2, '0')}` : 
                          uploadedVideo.duration}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {shorts.length}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handlePreviewOriginalVideo}
                          className="border-accent/40 text-accent hover:bg-accent/10"
                        >
                          Preview
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Video Preview Modal */}
      {previewVideo && (
        <VideoPreviewModal 
          video={previewVideo}
          onClose={() => setPreviewVideo(null)}
          onEdit={short => {
            setPreviewVideo(null);
            setEditingShort(short);
          }}
        />
      )}
      
      {/* Short Editor Modal */}
      {editingShort && (
        <ShortEditorModal
          short={editingShort}
          onClose={() => setEditingShort(null)}
          onSave={handleSaveEditedShort}
        />
      )}
    </div>
  );
}
