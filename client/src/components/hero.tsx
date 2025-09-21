import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import posterImage from "@assets/poster_1756536893578.png";

// Placeholder images - user will replace with new photos
const heroImages = [
  {
    src: posterImage,
    alt: "ISB Medical Society - Healthcare Education"
  },
  {
    src: posterImage, // Will be replaced with new images
    alt: "ISB Medical Society - Community Outreach"
  },
  {
    src: posterImage, // Will be replaced with new images  
    alt: "ISB Medical Society - Medical Training"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6 seconds per slide
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Pause on user interaction
  const handleInteraction = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000); // Resume after 10s
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    handleInteraction();
  };

  return (
    <section 
      className="relative h-screen overflow-hidden bg-black"
      data-testid="hero-section"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className={`w-full h-full bg-cover bg-center bg-no-repeat transform transition-transform duration-1000 ease-out scale-105 hover:scale-110 ${
                index === currentSlide ? 'animate-ken-burns' : ''
              }`}
              style={{ 
                backgroundImage: `url(${image.src})`
              }}
            />
            {/* Individual image overlay for optimal contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
          </div>
        ))}
      </div>

      {/* Dynamic Overlay - adjusts based on content */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/50" />
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Main Content */}
          <div className="space-y-8 luxury-fade-in">
            
            {/* Dramatic Typography */}
            <div className="space-y-6">
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display text-white leading-[0.9] tracking-tight"
                style={{ 
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '-0.02em'
                }}
                data-testid="hero-title"
              >
                Advancing Healthcare
                <span className="block text-primary font-light">
                  Education & Equity
                </span>
              </h1>
              
              <p 
                className="text-xl sm:text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-4xl mx-auto font-light"
                style={{ 
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                  letterSpacing: '0.01em'
                }}
                data-testid="hero-description"
              >
                A student-led organization dedicated to educating our community about health, 
                advocating for healthcare equity, and supporting medical initiatives worldwide.
              </p>
            </div>

            {/* Premium CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/contact">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg font-medium luxury-hover luxury-press border-0 rounded-xl backdrop-blur-sm"
                  style={{ 
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    minWidth: '200px'
                  }}
                  data-testid="hero-cta-primary"
                  onClick={handleInteraction}
                >
                  Join Our Mission
                </Button>
              </Link>
              
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-12 py-6 text-lg font-medium luxury-hover luxury-press rounded-xl"
                  style={{ 
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    minWidth: '200px'
                  }}
                  data-testid="hero-cta-secondary"
                  onClick={handleInteraction}
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-3 p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 luxury-hover ${
                index === currentSlide 
                  ? 'bg-primary w-8 shadow-lg shadow-primary/50' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              style={{
                boxShadow: index === currentSlide ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
              }}
              data-testid={`hero-indicator-${index}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-sm font-light tracking-wide">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </div>

    </section>
  );
}