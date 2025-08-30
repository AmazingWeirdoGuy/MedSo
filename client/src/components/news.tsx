import { Button } from "@/components/ui/button";

export default function News() {
  const newsItems = [
    {
      id: "health-fair-2024",
      category: "Health Fair 2024",
      title: "Annual Health Fair Success",
      description: "Our 2024 Health Fair attracted over 500 participants, providing free health screenings and medical consultations to the community.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      id: "global-health-initiative",
      category: "Global Health Initiative",
      title: "New Partnership Announced",
      description: "MedSo partners with international healthcare organizations to expand our global health advocacy programs.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      id: "medical-research",
      category: "Medical Research",
      title: "Student Research Initiative",
      description: "Our students are conducting groundbreaking research in preventive medicine and community health solutions.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      id: "community-outreach",
      category: "Community Outreach",
      title: "Mobile Health Clinic Launch",
      description: "Bringing healthcare services directly to underserved communities through our new mobile health clinic program.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    }
  ];

  return (
    <section className="py-20 bg-white" data-testid="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="news-title">Latest News</h2>
          <p className="text-lg text-muted-foreground" data-testid="news-description">
            Stay updated with our latest activities and medical initiatives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newsItems.map((news) => (
            <div 
              key={news.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-border flex flex-col h-full"
              data-testid={`card-news-${news.id}`}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  data-testid={`img-news-${news.id}`}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-foreground mb-1" data-testid={`category-news-${news.id}`}>
                  {news.category}
                </h3>
                <h4 className="text-xl font-bold text-foreground mb-3" data-testid={`title-news-${news.id}`}>
                  {news.title}
                </h4>
                <p className="text-muted-foreground mb-4 flex-grow" data-testid={`text-news-${news.id}`}>
                  {news.description}
                </p>
                <Button 
                  className="bg-blue-500 text-white hover:bg-blue-600 w-full mt-auto"
                  data-testid={`button-read-${news.id}`}
                >
                  Read more
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
