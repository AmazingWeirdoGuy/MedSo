import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

export default function News() {
  const newsArticles = [
    {
      id: 1,
      title: "ISB MedSociety Hosts Successful Health Awareness Workshop",
      excerpt: "Over 100 students participated in our latest workshop focusing on mental health awareness and stress management techniques.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      category: "Events"
    },
    {
      id: 2,
      title: "Medical Professionals Share Career Insights with Students",
      excerpt: "Local doctors and nurses visited ISB to share their experiences and advice with aspiring medical students.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      author: "Michael Chen",
      date: "March 10, 2024",
      category: "Career Guidance"
    },
    {
      id: 3,
      title: "Fundraising Drive Raises $5,000 for Local Hospital",
      excerpt: "Thanks to the generous support of our school community, we successfully raised funds to support the children's ward at Bangkok Hospital.",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop",
      author: "Emma Davis",
      date: "March 5, 2024",
      category: "Fundraising"
    },
    {
      id: 4,
      title: "First Aid Training Session Prepares Students for Emergencies",
      excerpt: "Students learned essential first aid skills including CPR, wound care, and emergency response procedures.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop",
      author: "David Wilson",
      date: "February 28, 2024",
      category: "Training"
    },
    {
      id: 5,
      title: "Partnership with Local Clinic Provides Volunteer Opportunities",
      excerpt: "ISB MedSociety has established a partnership with Bangkok Community Clinic to offer hands-on volunteer experience for members.",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&h=400&fit=crop",
      author: "Alex Rodriguez",
      date: "February 20, 2024",
      category: "Partnerships"
    },
    {
      id: 6,
      title: "Medical Minute Series Launches on Social Media",
      excerpt: "Our new educational video series breaks down complex medical topics into digestible one-minute explanations for students and the public.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
      author: "Sophia Kim",
      date: "February 15, 2024",
      category: "Education"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="news-title">
              Latest News
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest activities, events, and achievements from ISB Medical Society
            </p>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <article 
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                data-testid={`article-${article.id}`}
              >
                {/* Article Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    data-testid={`img-article-${article.id}`}
                  />
                </div>

                {/* Article Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <span 
                    className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3"
                    data-testid={`category-${article.id}`}
                  >
                    {article.category}
                  </span>

                  {/* Article Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2" data-testid={`title-${article.id}`}>
                    {article.title}
                  </h2>

                  {/* Article Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3" data-testid={`excerpt-${article.id}`}>
                    {article.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="w-4 h-4 mr-1" />
                    <span className="mr-4">{article.author}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{article.date}</span>
                  </div>

                  {/* Read More Button */}
                  <Button 
                    className="bg-blue-500 text-white hover:bg-blue-600 w-full"
                    data-testid={`button-read-${article.id}`}
                  >
                    Read Full Article
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Section */}
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              className="px-8 py-3 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              data-testid="button-load-more"
            >
              Load More News
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}