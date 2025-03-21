import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">How Our Shorts Generator Works</h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4">AI-Powered Content Analysis</h2>
              <p className="text-lg mb-4">
                Our advanced AI algorithms analyze your uploaded videos to identify the most engaging and shareable moments. Here's what happens behind the scenes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Audio analysis identifies key points, emotional moments, and dynamic changes</li>
                <li>Visual processing detects action sequences, facial expressions, and viewer-grabbing visuals</li>
                <li>Content mapping finds natural break points for optimal short-form clips</li>
                <li>Engagement prediction evaluates which segments will perform best on platforms like YouTube Shorts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">The 3-Step Process</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Upload</h3>
                  <p className="text-muted-foreground">
                    Upload any video (up to 500MB) in common formats including MP4, MOV, AVI, etc.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Process</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes your content and automatically creates multiple short clips optimized for engagement.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Download</h3>
                  <p className="text-muted-foreground">
                    Preview and download your generated shorts, ready to upload to YouTube or other platforms.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
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
                  <div>
                    <h3 className="font-medium mb-1">Vertical Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      All shorts are automatically optimized for vertical viewing (9:16 aspect ratio).
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="mt-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
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
                  <div>
                    <h3 className="font-medium mb-1">Multiple Shorts Per Video</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate 5-10 high-quality shorts from a single long-form video.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="mt-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
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
                  <div>
                    <h3 className="font-medium mb-1">Custom Editing</h3>
                    <p className="text-sm text-muted-foreground">
                      Fine-tune generated shorts with our simple editing interface before downloading.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="mt-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
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
                  <div>
                    <h3 className="font-medium mb-1">Captions & Subtitles</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatic caption generation for improved accessibility and engagement.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-center">
              <Link href="/signup">
                <Button size="lg">Try It Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

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
