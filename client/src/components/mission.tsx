import { GraduationCap, Scale, Globe } from "lucide-react";

export default function Mission() {
  return (
    <section className="py-24 bg-background dark:bg-background" data-testid="mission-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 luxury-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground mb-6" data-testid="mission-title">
            Our <span className="text-primary">Mission</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto" data-testid="mission-description">
            "Educating the public on diseases and advocating for healthcare equity everywhere."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Healthcare Education */}
          <div className="group bg-card dark:bg-card border border-border rounded-2xl p-8 text-center luxury-hover luxury-press" 
               style={{ boxShadow: 'var(--shadow-hairline)' }}
               data-testid="card-education">
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/15 transition-colors duration-300">
              <GraduationCap className="text-primary w-10 h-10" />
            </div>
            <h3 className="text-xl font-display text-foreground mb-6" data-testid="title-education">
              Healthcare Education
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-64 mx-auto" data-testid="text-education">
              Providing comprehensive medical education and raising awareness about diseases and health conditions in our community.
            </p>
          </div>

          {/* Healthcare Equity */}
          <div className="group bg-card dark:bg-card border border-border rounded-2xl p-8 text-center luxury-hover luxury-press" 
               style={{ boxShadow: 'var(--shadow-hairline)' }}
               data-testid="card-equity">
            <div className="w-20 h-20 bg-accent/10 dark:bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-accent/15 transition-colors duration-300">
              <Scale className="text-accent w-10 h-10" />
            </div>
            <h3 className="text-xl font-display text-foreground mb-6" data-testid="title-equity">
              Healthcare Equity
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-64 mx-auto" data-testid="text-equity">
              Advocating for equal access to healthcare services and breaking down barriers to medical treatment for all.
            </p>
          </div>

          {/* Global Impact */}
          <div className="group bg-card dark:bg-card border border-border rounded-2xl p-8 text-center luxury-hover luxury-press" 
               style={{ boxShadow: 'var(--shadow-hairline)' }}
               data-testid="card-impact">
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/15 transition-colors duration-300">
              <Globe className="text-primary w-10 h-10" />
            </div>
            <h3 className="text-xl font-display text-foreground mb-6" data-testid="title-impact">
              Global Impact
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-64 mx-auto" data-testid="text-impact">
              Working towards a world where quality healthcare is accessible to everyone, regardless of location or background.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
