import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <MainNav />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 sm:px-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Generate Viral Shorts from Your Videos
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                BinaryBuff automatically finds the most engaging parts of your videos and turns them into YouTube Shorts. Maximize your reach with AI-powered video editing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Creating Now
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="w-full max-w-md h-auto relative aspect-[9/16] bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-70">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="h-1 w-full bg-background/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 sm:px-10 bg-secondary/30">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">How Our Shorts Generator Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your long-form content into viral short-form videos in just 3 steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m16 16-4-4-4 4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Video</h3>
                <p className="text-muted-foreground">
                  Upload any video and our AI will analyze it to identify the most engaging moments.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes audio, visuals, and viewer engagement patterns to find the perfect clips for Shorts.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <polyline points="8 17 12 21 16 17"></polyline>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Download Your Shorts</h3>
                <p className="text-muted-foreground">
                  Download multiple ready-to-upload Shorts optimized for maximum engagement and reach.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BinaryBuff. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
