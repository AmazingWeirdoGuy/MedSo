import { Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/logo_1756537062633.jpg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div data-testid="footer-quicklinks">
            <h3 className="text-white font-bold text-lg mb-4">QUICK LINKS</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-white transition-colors" data-testid="footer-link-home">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors" data-testid="footer-link-about">About us</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors" data-testid="footer-link-news">News</Link></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-contact">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div data-testid="footer-contact">
            <h3 className="text-white font-bold text-lg mb-4">CONTACT</h3>
            <p className="mb-2 flex items-center" data-testid="footer-email">
              <Mail className="w-4 h-4 mr-2" /> 
              19609@students.isb.ac.th
            </p>
            <p className="mb-4 flex items-center" data-testid="footer-instagram">
              <Instagram className="w-4 h-4 mr-2" /> 
              @isbmedsociety
            </p>
            
          </div>

          {/* Organization */}
          <div data-testid="footer-organization">
            <h3 className="text-white font-bold text-lg mb-4">ORGANIZATION</h3>
            <p className="text-sm leading-relaxed">ISB is a student-led organization striving to educate the community about health, advocate for healthcare equity, and raise funds for charity.</p>
          </div>

          {/* Medical Society for Students (Logo) */}
          <div data-testid="footer-logo">
            <h3 className="text-white font-bold text-lg mb-4">ISB MEDICAL SOCIETY</h3>
            <img 
              src={logoImage}
              alt="ISB MedSociety Logo" 
              className="w-20 h-20 rounded-full object-cover"
              data-testid="footer-logo-image"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-sm" data-testid="footer-copyright">&copy; 2024 ISB Medical Society. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
