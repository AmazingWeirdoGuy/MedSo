import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import About from "@/pages/about";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import Contact from "@/pages/contact";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import AdminPage from "@/pages/admin";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

// Component to handle scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Smooth scroll to top whenever the location changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  return null;
}

function Router() {
  const isDev = import.meta.env.DEV;
  
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/news/:id" component={NewsDetail} />
        <Route path="/news" component={News} />
        <Route path="/contact" component={Contact} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        {isDev && <Route path="/login" component={LoginPage} />}
        {isDev && <Route path="/admin" component={AdminPage} />}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
