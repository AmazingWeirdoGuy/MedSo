import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, MapPin, Clock } from "lucide-react";

export default function Contact() {

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Header />
      <main className="py-24 luxury-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground mb-6" data-testid="contact-title">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get in touch with ISB Medical Society. We'd love to hear from you and answer any questions you may have.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Contact Form */}
            <div className="luxury-scale-in" data-testid="contact-form-section">
              <div className="bg-card dark:bg-card border border-border rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-subtle)' }}>
                <div className="p-6">
                  <div className="w-full" data-testid="google-form">
                    <iframe 
                      src="https://docs.google.com/forms/d/e/1FAIpQLSdU5C0GZRTXHHyQMo8jP6iACDbj8PXYKbwDLQIPrPSmjmmmyQ/viewform?embedded=true" 
                      className="w-full rounded-lg h-[950px] sm:h-[900px] lg:h-[850px]"
                      frameBorder={0} 
                      title="ISB Medical Society Contact Form"
                      loading="lazy"
                      data-testid="contact-form-iframe"
                    >
                      Loading…
                    </iframe>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500 mb-2">Having trouble with the form?</p>
                      <a 
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdU5C0GZRTXHHyQMo8jP6iACDbj8PXYKbwDLQIPrPSmjmmmyQ/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline text-sm font-medium transition-colors duration-200"
                        data-testid="link-form-external"
                      >
                        Open form in a new tab
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div data-testid="contact-info-section">
              <div className="space-y-8">
                
                {/* Contact Details */}
                <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 font-display">Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <div className="flex items-start space-x-4" data-testid="contact-email">
                      <Mail className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <a 
                          href="mailto:info@isbmedicalsociety.org" 
                          className="text-gray-600 hover:text-primary transition-colors duration-200 underline"
                        >
                          info@isbmedicalsociety.org
                        </a>
                        <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4" data-testid="contact-instagram">
                      <Instagram className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Instagram</h3>
                        <a 
                          href="https://instagram.com/isbmedsociety" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-600 hover:text-primary transition-colors duration-200 underline"
                        >
                          @isbmedsociety
                        </a>
                        <p className="text-sm text-gray-500">Follow us for updates and news</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4" data-testid="contact-location">
                      <MapPin className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Location</h3>
                        <p className="text-gray-600">International School Bangkok</p>
                        <p className="text-sm text-gray-500">Nichada Campus, Bangkok, Thailand</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4" data-testid="contact-hours">
                      <Clock className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Meeting Times</h3>
                        <p className="text-gray-600">Thursday panther block</p>
                        <p className="text-sm text-gray-500">10:55-11:25 Room 3-207</p>
                      </div>
                    </div>

                  </CardContent>
                </Card>

                {/* Join Us Card */}
                <Card className="shadow-lg bg-gradient-to-br from-primary to-teal-500 text-white hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-in-out">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Interested in Joining?</h3>
                    <p className="mb-6 text-blue-50">
                      ISB Medical Society welcomes students who are passionate about healthcare, medicine, and making a positive impact in our community.
                    </p>
                    <ul className="space-y-2 text-blue-50 mb-6">
                      <li>• Open to all grade levels</li>
                      <li>• No prior medical knowledge required</li>
                      <li>• Regular meetings and exciting activities</li>
                      <li>• Volunteer and leadership opportunities</li>
                    </ul>
                  </CardContent>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}