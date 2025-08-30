import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function About() {
  const [activeTab, setActiveTab] = useState("officers");

  const officers = [
    { name: "John Smith", position: "President", year: "Grade 12" },
    { name: "Sarah Johnson", position: "Vice President", year: "Grade 11" },
    { name: "Michael Chen", position: "Secretary", year: "Grade 12" },
    { name: "Emma Davis", position: "Treasurer", year: "Grade 11" },
    { name: "David Wilson", position: "Events Coordinator", year: "Grade 10" }
  ];

  const members = [
    { name: "Alex Rodriguez", year: "Grade 12" },
    { name: "Sophia Kim", year: "Grade 11" },
    { name: "Ryan Thompson", year: "Grade 11" },
    { name: "Isabella Chang", year: "Grade 10" },
    { name: "Lucas Anderson", year: "Grade 10" },
    { name: "Maya Patel", year: "Grade 9" },
    { name: "Ethan Lee", year: "Grade 9" },
    { name: "Olivia Martinez", year: "Grade 9" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side - About Us Content */}
            <div data-testid="about-content">
              <h1 className="text-4xl font-bold text-foreground mb-6" data-testid="about-title">
                About <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">Us</span>
              </h1>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Why We Exist</h2>
                
                <p data-testid="about-mission">
                  The ISB Medical Society was founded with a clear mission: to educate the public on diseases and advocate for healthcare equity everywhere. We believe that access to medical knowledge and healthcare should not be limited by geography, economic status, or social barriers.
                </p>
                
                <p data-testid="about-vision">
                  Our vision is to create a world where quality healthcare education is accessible to everyone. Through our programs, activities, and community outreach, we strive to bridge the gap between medical knowledge and public understanding.
                </p>
                
                <p data-testid="about-impact">
                  As a student-led organization, we are passionate about making a real difference in our community and beyond. We organize workshops, awareness campaigns, fundraising events, and volunteer at local healthcare facilities to put our values into action.
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg mt-8">
                  <h3 className="text-xl font-semibold text-primary mb-3">Our Core Values</h3>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Education:</strong> Providing accessible medical knowledge to all</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Equity:</strong> Advocating for equal healthcare access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Community:</strong> Building stronger, healthier communities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Innovation:</strong> Using creative approaches to solve health challenges</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side - Club Members Dropdown */}
            <div data-testid="members-section">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                
                {/* Dropdown Header */}
                <div className="bg-primary p-4">
                  <h2 className="text-xl font-bold text-white text-center">Our Team</h2>
                </div>
                
                {/* Dropdown Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("officers")}
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                      activeTab === "officers"
                        ? "bg-blue-50 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    data-testid="tab-officers"
                  >
                    Club Officers
                  </button>
                  <button
                    onClick={() => setActiveTab("members")}
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                      activeTab === "members"
                        ? "bg-blue-50 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    data-testid="tab-members"
                  >
                    Active Members
                  </button>
                </div>

                {/* Content */}
                <div className="p-6" data-testid="members-content">
                  {activeTab === "officers" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Club Officers</h3>
                      {officers.map((officer, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4 py-2" data-testid={`officer-${index}`}>
                          <h4 className="font-semibold text-foreground">{officer.name}</h4>
                          <p className="text-primary font-medium">{officer.position}</p>
                          <p className="text-sm text-muted-foreground">{officer.year}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "members" && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Active Members</h3>
                      <div className="grid gap-3">
                        {members.map((member, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-testid={`member-${index}`}>
                            <span className="font-medium text-foreground">{member.name}</span>
                            <span className="text-sm text-muted-foreground">{member.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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