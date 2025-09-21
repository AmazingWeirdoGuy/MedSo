import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

export default function News() {
  const newsArticles: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display" data-testid="news-title">
              Latest News
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest activities, events, and achievements from ISB Medical Society
            </p>
          </div>

          {/* Empty State */}
          {newsArticles.length === 0 ? (
            <div className="text-center py-16" data-testid="news-empty-state">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-200 ease-in-out">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">No News Yet</h3>
                  <p className="text-gray-600">
                    We don't have any news articles at the moment. Check back soon for updates on our latest activities and events!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}