import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Header />
      <main className="py-24 luxury-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground mb-6" data-testid="privacy-title">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-card dark:bg-card border border-border rounded-2xl p-8 lg:p-12 space-y-8" style={{ boxShadow: 'var(--shadow-subtle)' }}>
            
            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Fill out contact forms or join our mailing list</li>
                <li>Participate in our programs or events</li>
                <li>Contact us via email or social media</li>
                <li>Visit our website (through cookies and analytics)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you updates about our programs and activities</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and optimize user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist us in operating our website</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with school administration for student-related activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">4. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">6. Student Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                As a student organization, we take special care to protect student privacy in accordance with educational privacy laws and school policies. We only collect information necessary for our educational and community service activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access the personal information we have about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of communications at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
                <a href="mailto:info@isbmedicalsociety.org" className="text-primary hover:text-primary/80 underline">
                  info@isbmedicalsociety.org
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated revision date.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}