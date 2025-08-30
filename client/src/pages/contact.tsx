import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, MapPin, Phone, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="contact-title">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with ISB Medical Society. We'd love to hear from you and answer any questions you may have.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div data-testid="contact-form-section">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" data-testid="contact-form">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input 
                          id="firstName"
                          type="text"
                          required
                          className="w-full"
                          data-testid="input-firstName"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input 
                          id="lastName"
                          type="text"
                          required
                          className="w-full"
                          data-testid="input-lastName"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input 
                        id="email"
                        type="email"
                        required
                        className="w-full"
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level
                      </label>
                      <Input 
                        id="grade"
                        type="text"
                        placeholder="e.g., Grade 9, Grade 10..."
                        className="w-full"
                        data-testid="input-grade"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input 
                        id="subject"
                        type="text"
                        required
                        placeholder="What is this regarding?"
                        className="w-full"
                        data-testid="input-subject"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea 
                        id="message"
                        required
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full"
                        data-testid="input-message"
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-primary/90 py-3"
                      data-testid="button-submit"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div data-testid="contact-info-section">
              <div className="space-y-8">
                
                {/* Contact Details */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <div className="flex items-start space-x-4" data-testid="contact-email">
                      <Mail className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <p className="text-gray-600">19609@students.isb.ac.th</p>
                        <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4" data-testid="contact-instagram">
                      <Instagram className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Instagram</h3>
                        <p className="text-gray-600">@isbmedsociety</p>
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
                <Card className="shadow-lg bg-gradient-to-br from-primary to-teal-500 text-white">
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
                    <Button 
                      variant="secondary"
                      className="bg-white text-primary hover:bg-gray-100"
                      data-testid="button-join"
                    >Learn More</Button>
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