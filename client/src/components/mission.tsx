import { GraduationCap, Scale, Globe } from "lucide-react";

export default function Mission() {
  return (
    <section className="py-20 bg-white" data-testid="mission-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="mission-title">
            Our <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">Mission</span>
          </h2>
          <p className="text-lg text-muted-foreground italic max-w-4xl mx-auto" data-testid="mission-description">
            "Our mission is to educate the public on diseases and advocate for healthcare equity everywhere."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Healthcare Education */}
          <div className="bg-blue-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow" data-testid="card-education">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-4" data-testid="title-education">Healthcare Education</h3>
            <p className="text-blue-700 leading-relaxed" data-testid="text-education">
              Providing comprehensive medical education and raising awareness about diseases and health conditions in our community.
            </p>
          </div>

          {/* Healthcare Equity */}
          <div className="bg-green-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow" data-testid="card-equity">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="text-green-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-4" data-testid="title-equity">Healthcare Equity</h3>
            <p className="text-green-700 leading-relaxed" data-testid="text-equity">
              Advocating for equal access to healthcare services and breaking down barriers to medical treatment for all.
            </p>
          </div>

          {/* Global Impact */}
          <div className="bg-teal-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow" data-testid="card-impact">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="text-teal-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-teal-900 mb-4" data-testid="title-impact">Global Impact</h3>
            <p className="text-teal-700 leading-relaxed" data-testid="text-impact">
              Working towards a world where quality healthcare is accessible to everyone, regardless of location or background.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
