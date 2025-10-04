import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import type { News as NewsType } from "@shared/schema";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function News() {
  const { data: newsArticles = [], isLoading } = useQuery<NewsType[]>({
    queryKey: ["/api/news/published"],
  });
  const [loadingMore, setLoadingMore] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <main className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Premium Page Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-200/30 dark:border-blue-800/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
                Stories & Updates
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 dark:text-white mb-6 tracking-tight"
              data-testid="news-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Latest <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">News</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover the latest activities, events, and achievements from ISB Medical Society
            </motion.p>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-24">
              <Loading size="lg" variant="spinner" text="Loading news articles..." />
            </div>
          ) : newsArticles.length === 0 ? (
            <motion.div 
              className="text-center py-24" 
              data-testid="news-empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-md mx-auto">
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-slate-900/5">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-light text-slate-900 dark:text-white mb-3">No News Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We don't have any news articles at the moment. Check back soon for updates on our latest activities and events.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Premium News Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {newsArticles.map((article, index) => (
                  <motion.article 
                    key={article.id}
                    className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 flex flex-col"
                    data-testid={`article-${article.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Premium Image with Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent z-10" />
                      <img 
                        src={article.thumbnail || article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        data-testid={`img-article-${article.id}`}
                      />
                      
                      {/* Floating Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span 
                          className="inline-block px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-medium rounded-full border border-white/20 shadow-lg"
                          data-testid={`category-${article.id}`}
                        >
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-8 flex flex-col flex-grow">
                      {/* Article Title */}
                      <h2 
                        className="text-2xl font-light text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" 
                        data-testid={`title-${article.id}`}
                      >
                        {article.title}
                      </h2>

                      {/* Article Excerpt */}
                      <p 
                        className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow" 
                        data-testid={`excerpt-${article.id}`}
                      >
                        {article.description}
                      </p>

                      {/* Article Meta & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-light">
                            {article.publishDate ? format(new Date(article.publishDate), "MMM dd, yyyy") : format(new Date(article.createdAt!), "MMM dd, yyyy")}
                          </span>
                        </div>

                        {/* Read More Link */}
                        <button 
                          className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/btn"
                          data-testid={`button-read-${article.id}`}
                        >
                          Read
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>

                    {/* Subtle Gradient Border on Hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-teal-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-teal-500/5 group-hover:to-blue-500/10 transition-all duration-500 pointer-events-none" />
                  </motion.article>
                ))}
              </div>

              {/* Premium Load More Section */}
              <motion.div 
                className="text-center mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button 
                  className="px-10 py-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 text-slate-900 dark:text-white hover:bg-white/80 dark:hover:bg-slate-900/80 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 rounded-full text-base font-light"
                  data-testid="button-load-more"
                  onClick={() => {
                    setLoadingMore(true);
                    setTimeout(() => setLoadingMore(false), 2000);
                  }}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loading size="sm" variant="line" text="Loading more" />
                  ) : (
                    <span className="flex items-center">
                      Load More Stories
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
