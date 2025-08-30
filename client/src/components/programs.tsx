import { Button } from "@/components/ui/button";
import firstOnTheSceneImage from "@assets/firstonthescene_1756537744391.png";
import medicalMinuteImage from "@assets/medicalminute_1756537744391.png";
// Note: Using placeholder due to uppercase .JPG extension issue with Vite
// Please rename the file to lowercase .jpg for proper import
const fundraisingImage = "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
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
    <section className="py-20 bg-gray-50" data-testid="activities-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="activities-title">
            Our <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">Activities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="activities-description">Our activities are of non-profit nature.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <div 
              key={program.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              data-testid={`card-activity-${program.id}`}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={program.image}
                  alt={program.subtitle}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  data-testid={`img-activity-${program.id}`}
                />
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-primary mb-3" data-testid={`subtitle-activity-${program.id}`}>
                  {program.subtitle}
                </h4>
                <p className="text-muted-foreground text-sm mb-4" data-testid={`text-activity-${program.id}`}>
                  {program.description}
                </p>
                <Button 
                  className="bg-primary text-white hover:bg-primary/90 w-full"
                  data-testid={`button-learn-${program.id}`}
                >
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
