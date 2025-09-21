import { Button } from "@/components/ui/button";

export default function News() {
  const newsItems: any[] = [];

  return (
    <section className="py-20 bg-white" data-testid="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-display" data-testid="news-title">Latest News</h2>
          <p className="text-lg text-muted-foreground" data-testid="news-description">
            Stay updated with our latest activities and medical initiatives
          </p>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center py-12" data-testid="news-empty-state">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-2 font-display">No News Available</h3>
                <p className="text-gray-600">
                  We don't have any news to share at the moment. Check back soon for updates!
                </p>
              </div>
            </div>
          </div>
        ) : (
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
                  <h3 className="text-lg font-bold text-foreground mb-1 font-display" data-testid={`category-news-${news.id}`}>
                    {news.category}
                  </h3>
                  <h4 className="text-xl font-bold text-foreground mb-3 font-display" data-testid={`title-news-${news.id}`}>
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
        )}
      </div>
    </section>
  );
}
