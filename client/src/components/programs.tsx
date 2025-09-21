import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import firstOnTheSceneImage from "@assets/firstonthescene_1756537744391.png";
import medicalMinuteImage from "@assets/medicalminute_1756537744391.png";
import fundraisingImage from "@assets/fundraising_1756538236001.jpg";
import donationImage from "@assets/donation_1756537744391.jpg";

export default function Programs() {
  const programs = [
    {
      id: "first-on-the-scene",
      subtitle: "First on the scene",
      description: "Hands-on training in basic medical procedures and patient care techniques.",
      image: firstOnTheSceneImage
    },
    {
      id: "medical-minute",
      subtitle: "Medical minute",
      description: "Student-made short videos exploring current medical topics, with the aim to improve public health.",
      image: medicalMinuteImage
    },
    {
      id: "fundraising-events",
      subtitle: "Fundraising events",
      description: "Initiatives to raise funds for hospitals.",
      image: fundraisingImage
    },
    {
      id: "donation-charity",
      subtitle: "Donation & charity",
      description: "Donations to charitable organizations or hospitals.",
      image: donationImage
    }
  ];

  return (
    <section className="py-24 bg-background dark:bg-background relative overflow-hidden" data-testid="activities-section">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 luxury-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground mb-6" data-testid="activities-title">
            Our <span className="text-primary">Activities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the initiatives driving our mission forward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div 
              key={program.id}
              className="group bg-card dark:bg-card border border-border rounded-2xl overflow-hidden luxury-hover luxury-press flex flex-col h-full"
              style={{ 
                boxShadow: 'var(--shadow-hairline)',
                animationDelay: `${index * 100}ms`
              }}
              data-testid={`card-activity-${program.id}`}
            >
              <div className="overflow-hidden">
                <AspectRatio ratio={4 / 3}>
                  <img 
                    src={program.image}
                    alt={`${program.subtitle} - ISB Medical Society activity showcasing healthcare education and community engagement`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                    data-testid={`img-activity-${program.id}`}
                  />
                </AspectRatio>
              </div>
              
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <h3 className="text-xl font-display text-primary leading-snug" data-testid={`subtitle-activity-${program.id}`}>
                  {program.subtitle}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow" data-testid={`text-activity-${program.id}`}>
                  {program.description}
                </p>
                
                <div className="pt-2">
                  <Link href="/about">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm luxury-hover luxury-press"
                      style={{ boxShadow: 'var(--shadow-hairline)' }}
                      data-testid={`button-learn-${program.id}`}
                    >
                      Learn more →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
