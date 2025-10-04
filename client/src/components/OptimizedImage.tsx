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
  
  // Determine if we should use modern format sources
  const shouldUseModernFormats = displaySrc?.startsWith('/uploads/members/');
  
  // Generate modern format URLs if using our processed images
  const getModernFormatUrls = (baseUrl: string) => {
    const basePath = baseUrl.replace(/\.(jpg|jpeg|png)$/i, '');
    return {
      avif: `${basePath}.avif`,
      webp: `${basePath}.webp`,
      jpg: `${basePath}.jpg`
    };
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Get the final fallback source
  const getFallbackSrc = () => {
    if (imageError) {
      return fallbackSrc || blankPfpPath;
    }
    return displaySrc;
  };

  // If we have a processed image, use modern formats with fallback
  if (shouldUseModernFormats && !imageError && displaySrc) {
    const formats = getModernFormatUrls(displaySrc);
    
    return (
      <picture className={className}>
        <source srcSet={formats.avif} type="image/avif" />
        <source srcSet={formats.webp} type="image/webp" />
        <img
          src={formats.jpg}
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
      </picture>
    );
  }

  // Fallback to regular img element for external sources or errors
  return (
    <div className="relative">
      <img
        src={getFallbackSrc()}
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