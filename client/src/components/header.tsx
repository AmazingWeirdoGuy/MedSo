import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/logo_1756537062633.jpg";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileNavClick = () => {
    closeMobileMenu();
    // Scroll to top when navigating on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200 ease-in-out" data-testid="logo">
            <img 
              src={logoImage}
              alt="ISB Medical Society Logo" 
              className="w-10 h-10 rounded-full object-cover hover:shadow-lg transition-shadow duration-200"
              data-testid="logo-image"
            />
            <span className="text-xl font-bold text-primary">ISB Medical Society</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8" data-testid="navigation">
            <Link href="/" className={`font-medium hover:scale-110 transition-all duration-200 ease-in-out ${isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"}`} data-testid="nav-home">HOME</Link>
            <Link href="/about" className={`font-medium hover:scale-110 transition-all duration-200 ease-in-out ${isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-primary"}`} data-testid="nav-about">ABOUT US</Link>
            <Link href="/news" className={`font-medium hover:scale-110 transition-all duration-200 ease-in-out ${isActive("/news") ? "text-primary" : "text-muted-foreground hover:text-primary"}`} data-testid="nav-news">NEWS</Link>
            <Link href="/contact" className={`font-medium hover:scale-110 transition-all duration-200 ease-in-out ${isActive("/contact") ? "text-primary" : "text-muted-foreground hover:text-primary"}`} data-testid="nav-contact">CONTACT</Link>
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden p-2 text-muted-foreground hover:text-primary hover:scale-110 hover:bg-gray-100 transition-all duration-200 ease-in-out"
            onClick={toggleMobileMenu}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <nav className="px-4 py-4 border-t border-gray-200 bg-white" data-testid="mobile-navigation">
            <div className="space-y-4">
              <Link 
                href="/" 
                className={`block text-lg font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out ${isActive("/") ? "text-primary bg-blue-50" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-home"
              >
                HOME
              </Link>
              <Link 
                href="/about" 
                className={`block text-lg font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out ${isActive("/about") ? "text-primary bg-blue-50" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-about"
              >
                ABOUT US
              </Link>
              <Link 
                href="/news" 
                className={`block text-lg font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out ${isActive("/news") ? "text-primary bg-blue-50" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-news"
              >
                NEWS
              </Link>
              <Link 
                href="/contact" 
                className={`block text-lg font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out ${isActive("/contact") ? "text-primary bg-blue-50" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-contact"
              >
                CONTACT
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
