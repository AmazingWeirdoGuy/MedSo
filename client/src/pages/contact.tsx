import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  grade: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      grade: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  data-testid="input-firstName"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  data-testid="input-lastName"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                type="email"
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade Level</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="e.g., Grade 9, Grade 10..."
                                data-testid="input-grade"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="What is this regarding?"
                                data-testid="input-subject"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field}
                                rows={5}
                                placeholder="Tell us more about your inquiry..."
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="w-full bg-primary text-white hover:bg-primary/90 py-3"
                        data-testid="button-submit"
                      >
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
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