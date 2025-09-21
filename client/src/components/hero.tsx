import posterImage from "@assets/poster_1756536893578.png";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-700/30 py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto" data-testid="hero-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Editorial Content */}
          <div className="luxury-fade-in space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground leading-tight max-w-lg" data-testid="hero-title">
                Advancing Healthcare Education & 
                <span className="text-primary"> Equity</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-prose" data-testid="hero-description">
                A student-led organization dedicated to educating our community about health, advocating for healthcare equity, and supporting medical initiatives worldwide.
              </p>
            </div>

            {/* Premium CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-base font-medium luxury-hover luxury-press shadow-md border-0"
                  data-testid="hero-cta-primary"
                >
                  Join Our Mission
                </Button>
              </Link>
              
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-border hover:bg-muted/50 px-8 py-4 text-base font-medium luxury-hover luxury-press"
                  data-testid="hero-cta-secondary"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Premium Image Container */}
          <div className="luxury-scale-in">
            <div className="relative">
              <AspectRatio ratio={16 / 9} className="overflow-hidden">
                <img 
                  src={posterImage}
                  alt="ISB Medical Society showcasing healthcare education and community outreach initiatives" 
                  className="w-full h-full object-cover luxury-hover rounded-2xl"
                  style={{ boxShadow: 'var(--shadow-subtle)' }}
                  loading="lazy"
                  data-testid="hero-poster"
                />
              </AspectRatio>
              
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
