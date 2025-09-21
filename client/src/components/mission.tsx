import { GraduationCap, Scale, Globe } from "lucide-react";

export default function Mission() {
  return (
    <section className="py-20 bg-white" data-testid="mission-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 font-display" data-testid="mission-title">
            Our <span className="text-primary">Mission</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground italic max-w-4xl mx-auto px-4" data-testid="mission-description">
            "Our mission is to educate the public on diseases and advocate for healthcare equity everywhere."
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Healthcare Education */}
          <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-in-out animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100" data-testid="card-education">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200 ease-in-out">
              <GraduationCap className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-4 font-display" data-testid="title-education">Healthcare Education</h3>
            <p className="text-blue-700 leading-relaxed" data-testid="text-education">
              Providing comprehensive medical education and raising awareness about diseases and health conditions in our community.
            </p>
          </div>

          {/* Healthcare Equity */}
          <div className="bg-green-50 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-in-out animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200" data-testid="card-equity">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200 ease-in-out">
              <Scale className="text-green-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-4 font-display" data-testid="title-equity">Healthcare Equity</h3>
            <p className="text-green-700 leading-relaxed" data-testid="text-equity">
              Advocating for equal access to healthcare services and breaking down barriers to medical treatment for all.
            </p>
          </div>

          {/* Global Impact */}
          <div className="bg-teal-50 rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-in-out animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300" data-testid="card-impact">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-200 ease-in-out">
              <Globe className="text-teal-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-teal-900 mb-4 font-display" data-testid="title-impact">Global Impact</h3>
            <p className="text-teal-700 leading-relaxed" data-testid="text-impact">
              Working towards a world where quality healthcare is accessible to everyone, regardless of location or background.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
