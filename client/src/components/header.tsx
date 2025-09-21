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
    <header className="bg-background dark:bg-background border-b border-border sticky top-0 z-50" style={{ boxShadow: 'var(--shadow-hairline)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-4 luxury-hover" data-testid="logo">
              <img 
                src={logoImage}
                alt="ISB Medical Society Logo" 
                className="w-12 h-12 rounded-full object-cover"
                data-testid="logo-image"
              />
              <span className="text-xl font-display text-primary">ISB Medical Society</span>
            </div>
          </Link>
          
          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" data-testid="navigation">
            <Link 
              href="/" 
              className={`relative font-display font-medium transition-colors duration-200 ${isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`} 
              data-testid="nav-home"
            >
              Home
              {isActive("/") && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </Link>
            <Link 
              href="/about" 
              className={`relative font-display font-medium transition-colors duration-200 ${isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`} 
              data-testid="nav-about"
            >
              About
              {isActive("/about") && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </Link>
            <Link 
              href="/news" 
              className={`relative font-display font-medium transition-colors duration-200 ${isActive("/news") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`} 
              data-testid="nav-news"
            >
              News
              {isActive("/news") && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </Link>
            <Link 
              href="/contact" 
              className={`relative font-display font-medium transition-colors duration-200 ${isActive("/contact") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`} 
              data-testid="nav-contact"
            >
              Contact
              {isActive("/contact") && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </Link>
          </nav>

          {/* Right side - CTA and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Premium CTA */}
            <Link href="/contact" className="hidden md:block">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 luxury-hover luxury-press font-medium"
                style={{ boxShadow: 'var(--shadow-hairline)' }}
                data-testid="header-cta"
              >
                Join Us
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground luxury-hover"
              onClick={toggleMobileMenu}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <nav className="px-4 py-6 border-t border-border bg-background dark:bg-background" data-testid="mobile-navigation">
            <div className="space-y-3">
              <Link 
                href="/" 
                className={`block font-display font-medium py-3 px-4 rounded-xl luxury-hover ${isActive("/") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-home"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`block font-display font-medium py-3 px-4 rounded-xl luxury-hover ${isActive("/about") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-about"
              >
                About
              </Link>
              <Link 
                href="/news" 
                className={`block font-display font-medium py-3 px-4 rounded-xl luxury-hover ${isActive("/news") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-news"
              >
                News
              </Link>
              <Link 
                href="/contact" 
                className={`block font-display font-medium py-3 px-4 rounded-xl luxury-hover ${isActive("/contact") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                onClick={handleMobileNavClick}
                data-testid="mobile-nav-contact"
              >
                Contact
              </Link>
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t border-border">
                <Link href="/contact" onClick={handleMobileNavClick}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground luxury-hover luxury-press"
                    data-testid="mobile-header-cta"
                  >
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
