import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
    <section className="py-20 bg-gray-50" data-testid="activities-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="activities-title">
            Our <span className="text-primary">Activities</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <div 
              key={program.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full"
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
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-lg font-semibold text-primary mb-3" data-testid={`subtitle-activity-${program.id}`}>
                  {program.subtitle}
                </h4>
                <p className="text-muted-foreground text-sm mb-4 flex-grow" data-testid={`text-activity-${program.id}`}>
                  {program.description}
                </p>
                <Link href="/about">
                  <Button 
                    className="bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105 w-full mt-auto transition-all duration-200 ease-in-out active:scale-95 py-3 text-base"
                    data-testid={`button-learn-${program.id}`}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
