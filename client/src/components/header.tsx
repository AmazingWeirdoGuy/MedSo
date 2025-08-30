import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import logoImage from "@assets/logo_1756537062633.jpg";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200 ease-in-out" data-testid="logo">
            <img 
              src={logoImage}
              alt="ISB MedSociety Logo" 
              className="w-10 h-10 rounded-full object-cover hover:shadow-lg transition-shadow duration-200"
              data-testid="logo-image"
            />
            <span className="text-xl font-bold text-primary">ISB MedSociety</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8" data-testid="navigation">
            <Link href="/" className="text-primary font-medium hover:scale-110 transition-all duration-200 ease-in-out" data-testid="nav-home">HOME</Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 ease-in-out" data-testid="nav-about">ABOUT US</Link>
            <Link href="/news" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 ease-in-out" data-testid="nav-news">NEWS</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 ease-in-out" data-testid="nav-contact">CONTACT</Link>
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden p-2 text-muted-foreground hover:text-primary hover:scale-110 hover:bg-gray-100 transition-all duration-200 ease-in-out"
            data-testid="mobile-menu-button"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
