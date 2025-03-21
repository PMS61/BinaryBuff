import { Button } from "@/components/ui/button";

export function ErrorMessage({ message, onRetry, className = "" }) {
  return (
    <div className={`p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive ${className}`}>
      <div className="flex items-center gap-2 mb-2">
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
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
        <h3 className="font-medium">Connection Error</h3>
      </div>
      <p className="text-sm mb-3">{message}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
}
