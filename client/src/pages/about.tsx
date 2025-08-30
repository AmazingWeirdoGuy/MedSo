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
    { name: "John Smith", position: "President", year: "Grade 12", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { name: "Sarah Johnson", position: "Vice President", year: "Grade 11", image: "https://images.unsplash.com/photo-1494790108755-2616b056b3c1?w=150&h=150&fit=crop&crop=face" },
    { name: "Michael Chen", position: "Secretary", year: "Grade 12", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { name: "Emma Davis", position: "Treasurer", year: "Grade 11", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
  ];

  const members = [
    { name: "Alex Rodriguez", year: "Grade 12", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { name: "Sophia Kim", year: "Grade 11", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
    { name: "Ryan Thompson", year: "Grade 11", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face" },
    { name: "Isabella Chang", year: "Grade 10", image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face" }
  ];

  const advisors = [
    { name: "Dr. Emily Watson", position: "Faculty Advisor", department: "Biology Department", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face" },
    { name: "Mr. James Parker", position: "Health & Wellness Coordinator", department: "Student Services", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face" }
  ];


  const ProfileCard = ({ person, showPosition = false }: { person: any, showPosition?: boolean }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <img 
        src={person.image} 
        alt={person.name}
        className="w-12 h-12 rounded-full object-cover"
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
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        data-testid={testId}
      >
        <span className="font-medium text-gray-900 uppercase tracking-wide text-sm">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Title */}
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-16" data-testid="about-title">
            About us
          </h1>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side - Organization Description */}
            <div data-testid="about-content">
              <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid="org-title">
                ISB Medical Society
              </h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p data-testid="about-description">
                  We are a group of passionate students who want to educate the public on diseases and advocate for healthcare equity everywhere. Our mission is to bridge the gap between medical knowledge and public understanding, ensuring that quality healthcare education is accessible to everyone regardless of their background.
                </p>
                
                <p>
                  Our founders include students with diverse interests in medicine, public health, and healthcare advocacy. We have members who have participated in various medical competitions, volunteered at local hospitals, and conducted health awareness campaigns in our community.
                </p>
                
                <p>
                  Acknowledging the growing importance of healthcare literacy in our modern world, the significance of medical knowledge is now greater than ever. The ISB Medical Society was created with the goal of providing healthcare equity in the form of giving equal access to medical education and health resources to students and community members in Thailand, and in other countries around the world.
                </p>
                
                <p>
                  Our organization works by conducting educational workshops, organizing health awareness campaigns, partnering with local healthcare facilities, and creating resources that make medical information accessible to people of all ages and backgrounds.
                </p>
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