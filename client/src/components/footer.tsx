import { Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/logo_1756537062633.jpg";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-[var(--graphite)] to-slate-800 text-slate-300 py-16 texture-noise border-t border-slate-700/50" data-testid="footer" style={{ boxShadow: 'inset 0 1px 0 0 rgb(148 163 184 / 0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div data-testid="footer-quicklinks">
            <h3 className="text-white font-bold text-lg mb-4 font-display">QUICK LINKS</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-white transition-colors" data-testid="footer-link-home">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors" data-testid="footer-link-about">About us</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors" data-testid="footer-link-news">News</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors" data-testid="footer-link-contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div data-testid="footer-contact">
            <h3 className="text-white font-bold text-lg mb-4 font-display">CONTACT</h3>
            <a 
              href="mailto:info@isbmedicalsociety.org" 
              className="mb-2 flex items-center hover:text-white transition-colors duration-200" 
              data-testid="footer-email"
            >
              <Mail className="w-4 h-4 mr-2" /> 
              info@isbmedicalsociety.org
            </a>
            <a 
              href="https://instagram.com/isbmedsociety" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mb-4 flex items-center hover:text-white transition-colors duration-200" 
              data-testid="footer-instagram"
            >
              <Instagram className="w-4 h-4 mr-2" /> 
              @isbmedsociety
            </a>
            
          </div>

          {/* Organization */}
          <div data-testid="footer-organization">
            <h3 className="text-white font-bold text-lg mb-4 font-display">ORGANIZATION</h3>
            <p className="text-sm leading-relaxed">ISB is a student-led organization striving to educate the community about health, advocate for healthcare equity, and raise funds for charity.</p>
          </div>

          {/* Medical Society for Students (Logo) */}
          <div data-testid="footer-logo">
            <h3 className="text-white font-bold text-lg mb-4 font-display">ISB MEDICAL SOCIETY</h3>
            <img 
              src={logoImage}
              alt="ISB MedSociety Logo" 
              className="w-20 h-20 rounded-full object-cover"
              data-testid="footer-logo-image"
            />
          </div>
        </div>

        <div className="border-t border-slate-700/70 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" data-testid="footer-copyright">© 2025 ISB Medical Society. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors" data-testid="footer-link-terms">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors" data-testid="footer-link-privacy">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
