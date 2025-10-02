import { useState } from "react";
import blankPfpPath from "@assets/blank-pfp.png";

interface OptimizedImageProps {
  src: string;
  thumbnail?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  "data-testid"?: string;
}

export function OptimizedImage({ 
  src, 
  thumbnail, 
  alt, 
  className = "", 
  fallbackSrc,
  "data-testid": testId 
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use thumbnail for display if available, otherwise use original
  const displaySrc = thumbnail || src;

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Get the final source - fallback on error
  const finalSrc = imageError ? (fallbackSrc || blankPfpPath) : displaySrc;

  return (
    <div className="relative">
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        data-testid={testId}
      />
      {isLoading && (
        <img 
          src={blankPfpPath} 
          alt={alt} 
          className={`${className} opacity-50 absolute inset-0 rounded-inherit`} 
        />
      )}
    </div>
  );
}