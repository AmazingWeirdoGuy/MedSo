import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Loading } from "@/components/ui/loading";
import groupPhotoImage from "@assets/97ccae24-4d7b-48c9-a16e-40476198cbd1_1758466251232.png";
import hospitalVisitImage from "@assets/e5a0817e-1bad-4a67-bc34-45225337e332_1758466243134.png";
import educationImage from "@assets/16fd4d4d-d0b8-481f-821d-9d4b8ccae2f6_1758466251232.png";

const heroImages = [
  {
    src: groupPhotoImage,
    alt: "ISB Medical Society - First Aid Training Certification Group"
  },
  {
    src: hospitalVisitImage,
    alt: "ISB Medical Society - Hospital Community Outreach"
  },
  {
    src: educationImage,
    alt: "ISB Medical Society - Health Education Programs"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [location, navigate] = useLocation();
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6 seconds per slide
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Scroll fade effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 0; // Start fading immediately
      const fadeEnd = 150; // Completely faded after 150px of scroll
      
      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        // Calculate opacity between fadeStart and fadeEnd
        const fadeProgress = scrollY / fadeEnd;
        setScrollOpacity(1 - fadeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pause on user interaction
  const handleInteraction = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000); // Resume after 10s
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    handleInteraction();
  };

  // Scroll to next section
  const scrollToNext = () => {
    const heroSection = document.querySelector('[data-testid="hero-section"]');
    if (heroSection) {
      const nextSection = heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Handle Join Our Mission button click
  const handleJoinClick = () => {
    setLoadingButton('join');
    setTimeout(() => {
      if (location === '/contact') {
        // If already on contact page, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // If not on contact page, navigate to contact page
        navigate('/contact');
      }
      setLoadingButton(null);
      handleInteraction();
    }, 500);
  };

  // Handle Learn More button click
  const handleLearnMoreClick = () => {
    setLoadingButton('learn');
    setTimeout(() => {
      if (location === '/about') {
        // If already on about page, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // If not on about page, navigate to about page
        navigate('/about');
      }
      setLoadingButton(null);
      handleInteraction();
    }, 500);
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
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              onLoad={() => console.log('Image loaded and visible:', image.src, 'slide:', index, 'current:', currentSlide)}
            />
          </div>
        ))}
      </div>

      {/* Split layout with dedicated text area */}
      <div className="absolute inset-0 grid lg:grid-cols-2 items-center">
        
        {/* Left side - Text content with subtle background */}
        <div 
          className="h-full flex items-center justify-center p-8 sm:p-12 lg:p-16 transition-opacity duration-300 ease-out"
          style={{ 
            opacity: scrollOpacity,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%)'
          }}
        >
          <div className="max-w-xl space-y-8 luxury-fade-in">
            
            {/* Clean, readable typography */}
            <div className="space-y-6">
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display text-white leading-tight tracking-tight"
                style={{ 
                  letterSpacing: '-0.02em'
                }}
                data-testid="hero-title"
              >
                Advancing Healthcare
                <span className="block text-primary font-light mt-2">
                  Education & Equity
                </span>
              </h1>
              
              <p 
                className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed font-light"
                style={{ 
                  letterSpacing: '0.01em'
                }}
                data-testid="hero-description"
              >
                A student-led organization dedicated to educating our community about health, 
                advocating for healthcare equity, and supporting medical initiatives worldwide.
              </p>
            </div>

            {/* Premium CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-primary/80 hover:bg-primary/90 text-white px-12 py-6 text-lg font-medium luxury-hover luxury-press border border-white/20 rounded-xl backdrop-blur-md"
                style={{ 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  minWidth: '200px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.9) 100%)'
                }}
                data-testid="hero-cta-primary"
                onClick={handleJoinClick}
                disabled={loadingButton === 'join'}
              >
                {loadingButton === 'join' ? (
                  <Loading size="sm" variant="dots" />
                ) : (
                  'Join Our Mission'
                )}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border border-white/30 hover:border-white/50 bg-white/15 hover:bg-white/25 text-white hover:text-white/90 backdrop-blur-md px-12 py-6 text-lg font-medium luxury-hover luxury-press rounded-xl"
                style={{ 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  minWidth: '200px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.25) 100%)'
                }}
                data-testid="hero-cta-secondary"
                onClick={handleLearnMoreClick}
                disabled={loadingButton === 'learn'}
              >
                {loadingButton === 'learn' ? (
                  <Loading size="sm" variant="dots" />
                ) : (
                  'Learn More'
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side - Full image display on larger screens, hidden on mobile */}
        <div className="hidden lg:block h-full relative overflow-hidden">
          {/* Image shows through naturally here */}
        </div>
      </div>
      
      {/* Mobile overlay for better readability on small screens */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

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
        <button 
          onClick={scrollToNext}
          className="flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-colors duration-300 luxury-hover group"
          data-testid="scroll-indicator"
          aria-label="Scroll to next section"
        >
          <span className="text-sm font-light tracking-wide">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent group-hover:from-white group-hover:to-white/20 transition-all duration-300"></div>
          <div className="w-2 h-2 border border-white/60 border-t-0 border-l-0 transform rotate-45 group-hover:border-white transition-colors duration-300 animate-bounce"></div>
        </button>
      </div>

    </section>
  );
}