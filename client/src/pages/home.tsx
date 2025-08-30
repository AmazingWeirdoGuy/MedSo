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
        <Mission />
        <Programs />
        <News />
      </div>
      <Footer />
    </div>
  );
}
