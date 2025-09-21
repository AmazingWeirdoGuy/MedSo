import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Header />
      <main className="py-24 luxury-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground mb-6" data-testid="terms-title">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-card dark:bg-card border border-border rounded-2xl p-8 lg:p-12 space-y-8" style={{ boxShadow: 'var(--shadow-subtle)' }}>
            
            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the ISB Medical Society website, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service apply to all visitors, users, and others who access or use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ISB Medical Society provides educational content, community resources, and information about healthcare initiatives. Our services include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Educational materials about health and medical topics</li>
                <li>Information about our activities and programs</li>
                <li>Community engagement opportunities</li>
                <li>Contact forms and communication services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When using our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Use the service for lawful purposes only</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not attempt to disrupt or damage our website or services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">4. Educational Content Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The health and medical information provided on this website is for educational purposes only and should not be considered as professional medical advice. Always consult with qualified healthcare professionals for medical concerns or decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, logos, images, and materials on this website are the property of ISB Medical Society or its content suppliers and are protected by copyright laws. Unauthorized use or reproduction is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                ISB Medical Society shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or any information provided on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this website. Your continued use of our services constitutes acceptance of any modifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:info@isbmedicalsociety.org" className="text-primary hover:text-primary/80 underline">
                  info@isbmedicalsociety.org
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}