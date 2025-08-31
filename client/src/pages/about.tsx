import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function About() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    officers: true, // Default to officers being open
    members: false,
    advisors: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const officers = [
    { name: "[President Name]", position: "President", year: "Senior", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { name: "[Vice President Name]", position: "Vice President", year: "Junior", image: "https://images.unsplash.com/photo-1494790108755-2616b056b3c1?w=150&h=150&fit=crop&crop=face" },
    { name: "[Secretary Name]", position: "Secretary", year: "Senior", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { name: "[Treasurer Name]", position: "Treasurer", year: "Junior", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
  ];

  const members = [
    { name: "[Member Name 1]", year: "Senior", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 2]", year: "Junior", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 3]", year: "Sophomore", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 4]", year: "Freshman", image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 5]", year: "Junior", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 6]", year: "Sophomore", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" }
  ];

  const advisors = [
    { name: "[Faculty Advisor Name 1]", position: "Faculty Advisor", department: "Biology Department", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face" },
    { name: "[Faculty Advisor Name 2]", position: "Health & Wellness Coordinator", department: "Student Services", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face" }
  ];


  const ProfileCard = ({ person, showPosition = false }: { person: any, showPosition?: boolean }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-in-out hover:shadow-md hover:scale-[1.02]">
      <img 
        src={person.image} 
        alt={person.name}
        className="w-12 h-12 rounded-full object-cover transition-transform duration-200 ease-in-out hover:scale-110"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{person.name}</h4>
        {showPosition && person.position && (
          <p className="text-sm text-blue-600 font-medium">{person.position}</p>
        )}
        <p className="text-sm text-gray-500">{person.year || person.department}</p>
      </div>
    </div>
  );

  const AccordionSection = ({ 
    title, 
    isOpen, 
    onToggle, 
    children, 
    testId 
  }: { 
    title: string, 
    isOpen: boolean, 
    onToggle: () => void, 
    children: React.ReactNode,
    testId: string 
  }) => (
    <div className="border-b border-gray-200 last:border-b-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-200 ease-in-out touch-manipulation"
        data-testid={testId}
      >
        <span className="font-medium text-gray-900 uppercase tracking-wide text-sm">{title}</span>
        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12 sm:mb-16" data-testid="about-title">
            About us
          </h1>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
            {/* Left Side - Organization Description */}
            <div data-testid="about-content">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6" data-testid="org-title">Our club</h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p data-testid="about-description">
                  ISB MedSociety is more than just a student club — it's a community built by and for those who are passionate about the medical sciences. Founded on the belief that knowledge in medicine should not be confined to classrooms, our club provides a space where students can explore the world of healthcare, develop leadership skills, and make a meaningful impact.
                </p>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-xl sm:text-2xl lg:text-[30px]">Why we exist</h3>
                  <p>
                    We believe the next generation of healthcare professionals must not only be knowledgeable but also empathetic, socially aware, and motivated to improve lives. ISB MedSociety nurtures this vision by creating opportunities to learn, to lead, and to give back.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Team Members Accordion */}
            <div data-testid="members-section">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                
                <AccordionSection
                  title="Club Officers"
                  isOpen={openSections.officers}
                  onToggle={() => toggleSection('officers')}
                  testId="section-officers"
                >
                  <div className="space-y-2">
                    {officers.map((officer, index) => (
                      <ProfileCard 
                        key={index} 
                        person={officer} 
                        showPosition={true}
                      />
                    ))}
                  </div>
                </AccordionSection>

                <AccordionSection
                  title="Active Members"
                  isOpen={openSections.members}
                  onToggle={() => toggleSection('members')}
                  testId="section-members"
                >
                  <div className="space-y-2">
                    {members.map((member, index) => (
                      <ProfileCard 
                        key={index} 
                        person={member}
                      />
                    ))}
                  </div>
                </AccordionSection>

                <AccordionSection
                  title="Faculty Advisors"
                  isOpen={openSections.advisors}
                  onToggle={() => toggleSection('advisors')}
                  testId="section-advisors"
                >
                  <div className="space-y-2">
                    {advisors.map((advisor, index) => (
                      <ProfileCard 
                        key={index} 
                        person={advisor} 
                        showPosition={true}
                      />
                    ))}
                  </div>
                </AccordionSection>


              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}