import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, MapPin, Clock } from "lucide-react";

export default function Contact() {

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <Header />
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 py-32 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.05),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[0.9] tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
              data-testid="contact-title"
            >
              <span className="block font-extralight text-slate-300 text-2xl sm:text-3xl lg:text-4xl mb-4 uppercase tracking-[0.2em]">Any questions or Inquiries?</span>
              Get in Touch
            </h1>
            <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Begin a conversation with ISB Medical Society. 
              <span className="block mt-2 text-slate-500">Excellence in healthcare education starts here.</span>
            </p>
          </div>
        </div>
      </section>
      <main className="relative bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
            
            {/* Contact Form */}
            <div className="lg:col-span-3" data-testid="contact-form-section">
              <div className="mb-12">
                <h2 className="text-3xl lg:text-4xl font-light text-slate-800 dark:text-slate-200 mb-4">
                  Send us a message
                </h2>
                <div className="w-16 h-[1px] bg-slate-300 dark:bg-slate-600"></div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-none shadow-2xl overflow-hidden border-0" 
                   style={{ 
                     boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08)' 
                   }}>
                <div className="p-8 lg:p-12">
                  <div className="w-full" data-testid="google-form">
                    <iframe 
                      src="https://docs.google.com/forms/d/e/1FAIpQLSdU5C0GZRTXHHyQMo8jP6iACDbj8PXYKbwDLQIPrPSmjmmmyQ/viewform?embedded=true" 
                      className="w-full h-[900px] lg:h-[850px]"
                      frameBorder={0} 
                      title="ISB Medical Society Contact Form"
                      loading="lazy"
                      data-testid="contact-form-iframe"
                      style={{ 
                        border: 'none',
                        borderRadius: '0'
                      }}
                    >
                      Loading…
                    </iframe>
                    <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-700 pt-8">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-light">
                        Experiencing technical difficulties?
                      </p>
                      <a 
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdU5C0GZRTXHHyQMo8jP6iACDbj8PXYKbwDLQIPrPSmjmmmyQ/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline text-sm font-light transition-all duration-300 tracking-wide"
                        data-testid="link-form-external"
                      >
                        Open in new window
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="lg:col-span-2" data-testid="contact-info-section">
              <div className="space-y-16">
                
                {/* Contact Methods */}
                <div>
                  <h2 className="text-2xl lg:text-3xl font-light text-slate-800 dark:text-slate-200 mb-8">Contact Us</h2>
                  <div className="space-y-8">
                    
                    <div className="group" data-testid="contact-email">
                      <div className="flex items-start space-x-4 py-6 border-b border-slate-200 dark:border-slate-700 transition-all duration-300 group-hover:border-slate-400 dark:group-hover:border-slate-500">
                        <Mail className="w-5 h-5 text-slate-400 mt-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-light mb-2">
                            Email
                          </p>
                          <a 
                            href="mailto:info@isbmedicalsociety.org" 
                            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-lg font-light transition-colors duration-300 break-all"
                          >
                            info@isbmedicalsociety.org
                          </a>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">We try to reply in a timely manner</p>
                        </div>
                      </div>
                    </div>

                    <div className="group" data-testid="contact-instagram">
                      <div className="flex items-start space-x-4 py-6 border-b border-slate-200 dark:border-slate-700 transition-all duration-300 group-hover:border-slate-400 dark:group-hover:border-slate-500">
                        <Instagram className="w-5 h-5 text-slate-400 mt-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-light mb-2">
                            Social
                          </p>
                          <a 
                            href="https://instagram.com/isbmedsociety" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-lg font-light transition-colors duration-300"
                          >
                            @isbmedsociety
                          </a>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">Our social media outlet</p>
                        </div>
                      </div>
                    </div>

                    <div className="group" data-testid="contact-location">
                      <div className="flex items-start space-x-4 py-6 border-b border-slate-200 dark:border-slate-700 transition-all duration-300 group-hover:border-slate-400 dark:group-hover:border-slate-500">
                        <MapPin className="w-5 h-5 text-slate-400 mt-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-light mb-2">
                            Location
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 text-lg font-light">
                            International School Bangkok
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">Nichada Campus, Pak Kret, Nonthaburi 11120</p>
                        </div>
                      </div>
                    </div>

                    <div className="group" data-testid="contact-hours">
                      <div className="flex items-start space-x-4 py-6 transition-all duration-300">
                        <Clock className="w-5 h-5 text-slate-400 mt-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-light mb-2">Meeting Times</p>
                          <p className="text-slate-700 dark:text-slate-300 text-lg font-light">
                            Thursday Panther Block
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">
                            10:55-11:25 Room 3-207
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Membership Information */}
                <div className="bg-sky-400 dark:bg-sky-500 p-8 lg:p-10">
                  <h3 className="text-2xl font-light text-white mb-6">
                    Join our community
                  </h3>
                  <p className="text-sky-50 mb-8 font-light leading-relaxed">
                    ISB Medical Society welcomes students passionate about healthcare, 
                    medicine, and positive community impact.
                  </p>
                  <div className="space-y-3 text-sky-100 text-sm font-light">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-1 bg-sky-200 rounded-full"></div>
                      <span>Open to all grade levels</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-1 bg-sky-200 rounded-full"></div>
                      <span>No prior medical knowledge required</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-1 bg-sky-200 rounded-full"></div>
                      <span>Weekly meetings and activities</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-1 bg-sky-200 rounded-full"></div>
                      <span>Leadership opportunities</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}