import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loading({ size = "md", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {/* Modern Spinner */}
      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-2 border-primary/20",
          sizeClasses[size]
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent border-t-primary",
            "animate-spin"
          )} 
          style={{ animationDuration: "0.8s" }} />
        </div>
        
        {/* Pulsing center dot */}
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "bg-primary rounded-full animate-pulse",
          size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3"
        )} />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-muted rounded-lg h-4 w-full mb-2"></div>
      <div className="bg-muted rounded-lg h-4 w-3/4 mb-2"></div>
      <div className="bg-muted rounded-lg h-4 w-1/2"></div>
    </div>
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl p-6 border animate-pulse", className)}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-muted rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded"></div>
        <div className="h-3 bg-muted rounded w-5/6"></div>
        <div className="h-3 bg-muted rounded w-4/6"></div>
      </div>
    </div>
  );
}