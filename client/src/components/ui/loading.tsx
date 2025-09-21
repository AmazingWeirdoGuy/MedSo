import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  variant?: "spinner" | "dots" | "line";
}

export function Loading({ size = "md", className, text, variant = "spinner" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3"
  };

  if (variant === "dots") {
    return (
      <>
        <style>
          {`
            @keyframes bo-pulse {
              0%, 80%, 100% { 
                opacity: 0.3; 
                transform: scale(0.8); 
              }
              40% { 
                opacity: 1; 
                transform: scale(1); 
              }
            }
          `}
        </style>
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
          {/* Bang & Olufsen style dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-foreground/80 rounded-full",
                  dotSizes[size]
                )}
                style={{
                  animation: `bo-pulse 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
          
          {text && (
            <p className="text-xs text-muted-foreground font-light tracking-wide uppercase">
              {text}
            </p>
          )}
        </div>
      </>
    );
  }

  if (variant === "line") {
    return (
      <>
        <style>
          {`
            @keyframes bo-slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(350%); }
            }
          `}
        </style>
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
          {/* Bang & Olufsen style progress line */}
          <div className="w-32 h-0.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-transparent via-foreground/80 to-transparent rounded-full"
              style={{
                width: '40%',
                animation: 'bo-slide 2s ease-in-out infinite'
              }}
            />
          </div>
          
          {text && (
            <p className="text-xs text-muted-foreground font-light tracking-wide uppercase">
              {text}
            </p>
          )}
        </div>
      </>
    );
  }

  // Default elegant spinner
  return (
    <>
      <style>
        {`
          @keyframes bo-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        {/* Bang & Olufsen style minimal spinner */}
        <div className="relative">
          <div className={cn(
            "rounded-full border-2 border-muted",
            sizeClasses[size]
          )}>
            <div 
              className={cn(
                "absolute inset-0 rounded-full border-2 border-transparent border-t-foreground/80",
                sizeClasses[size]
              )}
              style={{
                animation: 'bo-spin 1.5s ease-in-out infinite'
              }}
            />
          </div>
        </div>
        
        {text && (
          <p className="text-xs text-muted-foreground font-light tracking-wide uppercase">
            {text}
          </p>
        )}
      </div>
    </>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-muted/60 rounded-lg h-4 w-full mb-3" style={{ animationDelay: '0s' }}></div>
      <div className="bg-muted/60 rounded-lg h-4 w-3/4 mb-3" style={{ animationDelay: '0.1s' }}></div>
      <div className="bg-muted/60 rounded-lg h-4 w-1/2" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl p-6 border", className)}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-muted/60 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-muted/60 rounded w-3/4 mb-2 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-3 bg-muted/60 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted/60 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="h-3 bg-muted/60 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="h-3 bg-muted/60 rounded w-4/6 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}