import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export default function News() {
  const newsItems: any[] = [];

  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-blue-50/20 dark:from-slate-900/40 dark:via-background dark:to-slate-800/20 relative texture-subtle" data-testid="news-section">
      {/* Subtle Decorative Elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-32 right-20 w-48 h-48 bg-primary/8 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-accent/6 rounded-full blur-2xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 luxury-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground mb-6" data-testid="news-title">
            Latest <span className="text-primary">News</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="news-description">
            Stay updated with our latest activities and medical initiatives
          </p>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center py-16 luxury-scale-in" data-testid="news-empty-state">
            <div className="max-w-lg mx-auto">
              <div className="bg-card dark:bg-card border-2 border-border/60 rounded-2xl p-12 surface-elevated" style={{ boxShadow: 'var(--shadow-medium)' }}>
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Instagram className="text-primary w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-display text-foreground mb-4">Stay Connected</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Follow us on social media for the latest updates on our healthcare initiatives and community programs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://instagram.com/isbmedsociety" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 luxury-hover luxury-press"
                      style={{ boxShadow: 'var(--shadow-hairline)' }}
                      data-testid="follow-instagram"
                    >
                      Follow on Instagram
                    </Button>
                  </a>
                  
                  <a 
                    href="mailto:info@isbmedicalsociety.org"
                    className="inline-block"
                  >
                    <Button 
                      variant="outline"
                      className="border-2 border-border hover:bg-muted/50 px-6 py-3 luxury-hover luxury-press"
                      data-testid="subscribe-newsletter"
                    >
                      Contact Us
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news, index) => (
              <div 
                key={news.id}
                className="group bg-card dark:bg-card border border-border rounded-2xl overflow-hidden luxury-hover luxury-press flex flex-col h-full"
                style={{ 
                  boxShadow: 'var(--shadow-hairline)',
                  animationDelay: `${index * 100}ms`
                }}
                data-testid={`card-news-${news.id}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                    data-testid={`img-news-${news.id}`}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full" data-testid={`category-news-${news.id}`}>
                      {news.category}
                    </span>
                    <h3 className="text-lg font-display text-foreground leading-snug" data-testid={`title-news-${news.id}`}>
                      {news.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow" data-testid={`text-news-${news.id}`}>
                    {news.description}
                  </p>
                  
                  <div className="pt-2">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start p-0 h-auto text-primary hover:text-primary/80 font-medium text-sm luxury-press"
                      data-testid={`button-read-${news.id}`}
                    >
                      Read more →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
