import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Loading } from "@/components/ui/loading";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NewsDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  // Fetch all news to find the current article and related ones
  const { data: allNews = [], isLoading } = useQuery<News[]>({
    queryKey: ["/data/news.json"],
    queryFn: async () => {
      const res = await fetch("/data/news.json");
      if (!res.ok) throw new Error("Failed to load data");
      return res.json();
    },
  });

  const currentArticle = allNews.find(article => article.id === params.id);

  // Find related articles based on category (excluding current article)
  const relatedArticles = currentArticle
    ? allNews
        .filter(article => 
          article.id !== currentArticle.id && 
          article.category === currentArticle.category
        )
        .slice(0, 3)
    : [];

  // If no same-category articles, show other recent articles
  const fallbackArticles = relatedArticles.length === 0
    ? allNews.filter(article => article.id !== currentArticle?.id).slice(0, 3)
    : [];

  const displayedRelated = relatedArticles.length > 0 ? relatedArticles : fallbackArticles;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <Loading size="lg" variant="spinner" text="Loading article..." />
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Header />
        <main className="py-20 text-center">
          <h1 className="text-4xl font-light text-slate-900 dark:text-white mb-4">Article Not Found</h1>
          <Button onClick={() => navigate("/news")}>Back to News</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <main className="py-12">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/news")}
            className="group text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            data-testid="button-back-to-news"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to News
          </Button>
        </div>

        {/* Article Header */}
        <motion.article
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          data-testid={`article-detail-${currentArticle.id}`}
        >
          {/* Category Badge */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span 
              className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-200/30 dark:border-blue-800/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300"
              data-testid="article-category"
            >
              {currentArticle.category}
            </span>
          </motion.div>

          {/* Article Title */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="article-title"
          >
            {currentArticle.title}
          </motion.h1>

          {/* Article Meta */}
          <motion.div
            className="flex items-center text-slate-600 dark:text-slate-400 mb-12 pb-6 border-b border-slate-200 dark:border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span className="font-light">
              {currentArticle.publishDate 
                ? format(new Date(currentArticle.publishDate), "MMMM dd, yyyy") 
                : format(new Date(currentArticle.createdAt!), "MMMM dd, yyyy")}
            </span>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <img
              src={currentArticle.image}
              alt={currentArticle.title}
              className="w-full h-auto"
              data-testid="article-image"
            />
          </motion.div>

          {/* Article Content */}
          <motion.div
            className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            data-testid="article-content"
          >
            <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 font-light">
              {currentArticle.description}
            </p>
            
            {currentArticle.content && (
              <div 
                className="mt-8 text-slate-600 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentArticle.content }}
              />
            )}
          </motion.div>
        </motion.article>

        {/* Related Articles Section */}
        {displayedRelated.length > 0 && (
          <motion.section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-testid="related-articles-section"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-white mb-4">
                Related <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Articles</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-light">
                {relatedArticles.length > 0 
                  ? "More stories from the same category" 
                  : "More stories you might enjoy"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {displayedRelated.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 flex flex-col cursor-pointer"
                  onClick={() => navigate(`/news/${article.id}`)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  data-testid={`related-article-${article.id}`}
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent z-10" />
                    <img
                      src={article.thumbnail || article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-block px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-medium rounded-full border border-white/20 shadow-lg">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-light text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow line-clamp-2 mb-4 text-sm">
                      {article.description}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-light">
                          {article.publishDate 
                            ? format(new Date(article.publishDate), "MMM dd") 
                            : format(new Date(article.createdAt!), "MMM dd")}
                        </span>
                      </div>

                      <span className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors group/btn">
                        Read
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-teal-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-teal-500/5 group-hover:to-blue-500/10 transition-all duration-500 pointer-events-none" />
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}
