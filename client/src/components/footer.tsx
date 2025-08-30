import { Mail, Facebook, Instagram, Twitter } from "lucide-react";
import logoImage from "@assets/logo_1756537062633.jpg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Menu */}
          <div data-testid="footer-menu">
            <h3 className="text-white font-bold text-lg mb-4">MENU</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-home">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-about">About us</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-news">News</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-contact">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div data-testid="footer-contact">
            <h3 className="text-white font-bold text-lg mb-4">CONTACT</h3>
            <p className="mb-2 flex items-center" data-testid="footer-email">
              <Mail className="w-4 h-4 mr-2" /> 
              contact@isbmedsociety.com
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="social-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="social-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="social-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Organization */}
          <div data-testid="footer-organization">
            <h3 className="text-white font-bold text-lg mb-4">ORGANIZATION</h3>
            <p className="text-sm leading-relaxed">
              ISB is a student-led organization striving to provide equal access of medical and healthcare knowledge to all students.
            </p>
          </div>

          {/* Medical Society for Students (Logo) */}
          <div data-testid="footer-logo">
            <h3 className="text-white font-bold text-lg mb-4">MEDICAL SOCIETY FOR STUDENTS (MSS)</h3>
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
