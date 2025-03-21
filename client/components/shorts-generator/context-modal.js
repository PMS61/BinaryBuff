"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function ContextModal({ isOpen, onClose, onSubmit }) {
  const [context, setContext] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("educational"); // Default

  const handleSubmit = () => {
    onSubmit({
      context,
      targetAudience,
      keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
      contentType
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Additional Video Context</DialogTitle>
          <DialogDescription>
            Providing more context about your video helps our AI generate better shorts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="context" className="text-sm font-medium">
              Video Description/Context
            </label>
            <Textarea
              id="context"
              placeholder="What is your video about? Add details that will help our AI understand the content better."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="resize-none min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="audience" className="text-sm font-medium">
              Target Audience
            </label>
            <Input
              id="audience"
              placeholder="Who is your target audience? (e.g., tech enthusiasts, fitness beginners)"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="keywords" className="text-sm font-medium">
              Keywords (comma separated)
            </label>
            <Input
              id="keywords"
              placeholder="Enter keywords related to your video"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Content Type</label>
            <div className="flex flex-wrap gap-2">
              {["educational", "entertainment", "tutorial", "vlog", "product review"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={contentType === type ? "default" : "outline"}
                  className={contentType === type ? "bg-primary text-white" : ""}
                  onClick={() => setContentType(type)}
                  size="sm"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-accent/20 p-3 rounded-md border border-accent/30 my-2">
          <h4 className="text-sm font-medium mb-1">Why this matters:</h4>
          <p className="text-xs text-muted-foreground">
            Our AI uses this information to identify the most engaging moments and generate shorts optimized for your specific audience and content type.
          </p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Skip
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Save Context
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
