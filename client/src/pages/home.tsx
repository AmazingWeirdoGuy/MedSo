import Header from "@/components/header";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import Programs from "@/components/programs";
import News from "@/components/news";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
        <Hero />
        
        {/* Elegant Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
        </div>
        
        <Mission />
        
        {/* Subtle Section Transition */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent mx-auto max-w-xs"></div>
        
        <Programs />
        
        {/* Elegant Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
        </div>
        
        <News />
      </div>
      <Footer />
    </div>
  );
}
