import { Stethoscope, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3" data-testid="logo">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-primary">ISB MedSociety</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8" data-testid="navigation">
            <a href="#" className="text-primary font-medium" data-testid="nav-home">HOME</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-about">ABOUT US</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-news">NEWS</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-contact">CONTACT</a>
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden p-2 text-muted-foreground hover:text-primary"
            data-testid="mobile-menu-button"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
