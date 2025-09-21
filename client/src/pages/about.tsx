import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    websiteManager: true, // Default to website manager being open
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

  const websiteManager = [
    { name: "Rungphob (Ronnie) Lertvilaivithaya", position: "Head of Website Development", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face" }
  ];

  const officers = [
    { name: "[President Name]", position: "President", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { name: "[Vice President Name]", position: "Vice President", image: "https://images.unsplash.com/photo-1494790108755-2616b056b3c1?w=150&h=150&fit=crop&crop=face" },
    { name: "[Secretary Name]", position: "Secretary", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { name: "[Treasurer Name]", position: "Treasurer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
  ];

  const members = [
    { name: "[Member Name 1]", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 2]", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 3]", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 4]", image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 5]", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face" },
    { name: "[Member Name 6]", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" }
  ];

  const advisors = [
    { name: "[Faculty Advisor Name 1]", position: "Faculty Advisor", department: "Biology Department", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face" },
    { name: "[Faculty Advisor Name 2]", position: "Health & Wellness Coordinator", department: "Student Services", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face" }
  ];


  const ProfileCard = ({ person, showPosition = false, showDepartment = false, showImage = true }: { person: any, showPosition?: boolean, showDepartment?: boolean, showImage?: boolean }) => (
    <div className="flex items-center space-x-4 p-4 bg-card dark:bg-card border border-border rounded-xl luxury-hover luxury-press" style={{ boxShadow: 'var(--shadow-hairline)' }}>
      {showImage && (
        <img 
          src={person.image} 
          alt={person.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
        />
      )}
      <div className="flex-1 space-y-1">
        <h4 className="font-medium text-foreground">{person.name}</h4>
        {showPosition && person.position && (
          <p className="text-sm text-primary font-medium">{person.position}</p>
        )}
        {showDepartment && person.department && (
          <p className="text-sm text-muted-foreground">{person.department}</p>
        )}
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
    <div className="border-b border-border last:border-b-0 overflow-hidden bg-card dark:bg-card rounded-xl mb-3" style={{ boxShadow: 'var(--shadow-hairline)' }}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-6 flex items-center justify-between text-left luxury-hover touch-manipulation"
        data-testid={testId}
      >
        <span className="font-display text-foreground tracking-wide text-lg">{title}</span>
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 border-t border-border">
          <div className="pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Header />
      <main className="py-24 luxury-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Title */}
          <div className="text-center mb-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground mb-6" data-testid="about-title">
              About <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get to know the people and mission driving ISB Medical Society forward
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Side - Organization Description */}
            <div className="luxury-scale-in" data-testid="about-content">
              <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-8" data-testid="org-title">Our Organization</h2>
              
              <div className="space-y-8 text-muted-foreground leading-relaxed max-w-prose">
                <p data-testid="about-description">
                  ISB MedSociety is more than just a student club — it's a community built by and for those who are passionate about the medical sciences. Founded on the belief that knowledge in medicine should not be confined to classrooms, our club provides a space where students can explore the world of healthcare, develop leadership skills, and make a meaningful impact.
                </p>
                
                <div>
                  <h3 className="font-display text-foreground mb-4 text-xl">Why we exist</h3>
                  <p>
                    We believe the next generation of healthcare professionals must not only be knowledgeable but also empathetic, socially aware, and motivated to improve lives. ISB MedSociety nurtures this vision by creating opportunities to learn, to lead, and to give back.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Team Members Accordion */}
            <div className="luxury-fade-in" data-testid="members-section">
              <div className="space-y-4">
                
                <AccordionSection
                  title="Website Manager"
                  isOpen={openSections.websiteManager}
                  onToggle={() => toggleSection('websiteManager')}
                  testId="section-website-manager"
                >
                  <div className="space-y-2">
                    {websiteManager.map((manager, index) => (
                      <ProfileCard 
                        key={index} 
                        person={manager} 
                        showPosition={true}
                      />
                    ))}
                  </div>
                </AccordionSection>

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
                        showImage={false}
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
                        showDepartment={true}
                      />
                    ))}
                  </div>
                </AccordionSection>

              </div>
            </div>

          </div>

          {/* Interested in Joining Section */}
          <motion.div 
            className="mt-16 lg:mt-20" 
            data-testid="joining-section"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-8 lg:p-12"
              whileInView={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 font-display" 
                data-testid="joining-title"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 120
                }}
              >
                Interested in Joining?
              </motion.h2>
              
              <div className="max-w-3xl mx-auto text-center">
                <motion.p 
                  className="text-lg text-gray-700 mb-8 leading-relaxed" 
                  data-testid="joining-description"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  ISB Medical Society welcomes students who are passionate about healthcare, medicine, and making a positive impact in our community.
                </motion.p>
                
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button asChild size="lg" className="text-white bg-blue-600 hover:bg-blue-700 outline-none focus:outline-none focus-visible:outline-none !ring-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:ring-transparent focus-visible:!ring-offset-0 transition-all duration-300 px-8 py-3 text-lg font-medium rounded-lg">
                      <Link to="/contact" data-testid="button-join-now">
                        Join Now
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
                
                <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 text-gray-700 list-none">
                  {[
                    { testId: "benefit-grade-levels", text: "Open to all grade levels" },
                    { testId: "benefit-no-experience", text: "No prior medical knowledge required" },
                    { testId: "benefit-activities", text: "Regular meetings and exciting activities" },
                    { testId: "benefit-opportunities", text: "Volunteer and leadership opportunities" },
                    { testId: "benefit-cas-hours", text: "Counts toward Service for CAS" }
                  ].map((benefit, index) => (
                    <motion.li 
                      key={benefit.testId}
                      className="flex flex-col items-center p-4 rounded-lg cursor-pointer" 
                      data-testid={benefit.testId}
                      style={{
                        boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
                        backgroundColor: "transparent"
                      }}
                      initial={{ opacity: 0, y: 40, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.9 + (index * 0.15),
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -8,
                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
                        backgroundColor: "rgba(249, 250, 251, 0.8)",
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                        whileHover={{
                          backgroundColor: "rgba(37, 99, 235, 0.15)",
                          scale: 1.1,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <motion.span 
                          className="text-blue-600 font-bold text-lg" 
                          aria-hidden="true"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.4, 
                            delay: 1.2 + (index * 0.15),
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{
                            color: "#1d4ed8",
                            scale: 1.2,
                            transition: { duration: 0.2 }
                          }}
                        >
                          ✓
                        </motion.span>
                      </motion.div>
                      <p className="font-medium text-center">{benefit.text}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}