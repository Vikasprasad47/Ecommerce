import React, { useState } from "react";
import { 
  FiUsers, 
  FiTarget, 
  FiAward, 
  FiTrendingUp, 
  FiGlobe, 
  FiHeart,
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiClock,
  FiStar,
  FiMapPin,
  FiCalendar
} from "react-icons/fi";

const About = () => {
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const companyStats = [
    { number: "50K+", label: "Happy Customers", icon: <FiUsers />, color: "blue" },
    { number: "100K+", label: "Products Delivered", icon: <FiShoppingBag />, color: "green" },
    { number: "95%", label: "Satisfaction Rate", icon: <FiStar />, color: "yellow" },
    { number: "24/7", label: "Customer Support", icon: <FiClock />, color: "purple" }
  ];

  const coreValues = [
    {
      icon: <FiShield />,
      title: "Trust & Security",
      description: "We prioritize the security of your data and transactions with enterprise-grade protection",
      features: ["GDPR Compliance", "Secure Payments", "Data Encryption"]
    },
    {
      icon: <FiTrendingUp />,
      title: "Innovation",
      description: "Continuously evolving our platform with cutting-edge technology and user-centric features",
      features: ["AI-Powered Recommendations", "Real-time Analytics", "Mobile-First Design"]
    },
    {
      icon: <FiHeart />,
      title: "Customer First",
      description: "Your satisfaction drives every decision we make and every feature we build",
      features: ["24/7 Support", "Easy Returns", "Personalized Experience"]
    },
    {
      icon: <FiGlobe />,
      title: "Global Reach",
      description: "Connecting buyers and sellers across borders with seamless international commerce",
      features: ["Multi-Currency", "Global Shipping", "Localized Experience"]
    }
  ];

  const timeline = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Quickoo was established with a vision to revolutionize e-commerce in India",
      milestone: "First 100 customers"
    },
    {
      year: "2021",
      title: "Platform Launch",
      description: "Launched our full-featured e-commerce platform with 500+ merchant partners",
      milestone: "10,000+ products listed"
    },
    {
      year: "2022",
      title: "National Expansion",
      description: "Expanded operations to cover all major cities across India",
      milestone: "50,000+ active users"
    },
    {
      year: "2023",
      title: "Technology Upgrade",
      description: "Implemented AI and machine learning for personalized shopping experiences",
      milestone: "95% customer satisfaction"
    },
    {
      year: "2024",
      title: "Global Vision",
      description: "Preparing for international expansion and advanced marketplace features",
      milestone: "100K+ products delivered"
    }
  ];

  const leadershipTeam = [
    {
      name: "Rajesh Kumar",
      position: "CEO & Founder",
      experience: "12+ years in E-commerce",
      education: "IIT Delhi, MBA - IIM Ahmedabad",
      focus: "Product Strategy & Growth"
    },
    {
      name: "Priya Sharma",
      position: "CTO",
      experience: "10+ years in Tech Leadership",
      education: "B.Tech Computer Science - BITS Pilani",
      focus: "Technology Innovation & Platform Development"
    },
    {
      name: "Amit Patel",
      position: "COO",
      experience: "15+ years in Operations",
      education: "Operations Management - SP Jain",
      focus: "Supply Chain & Customer Experience"
    },
    {
      name: "Neha Gupta",
      position: "CMO",
      experience: "8+ years in Digital Marketing",
      education: "Marketing - MICA, Ahmedabad",
      focus: "Brand Growth & Customer Acquisition"
    }
  ];

  const aboutSections = [
    {
      title: "1. Our Story & Mission",
      icon: <FiTarget />,
      content: (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Our Founding Vision</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Quickoo was born in 2020 from a simple observation: e-commerce in India was becoming 
                increasingly complex and impersonal. We envisioned a platform that combines the efficiency 
                of modern technology with the personalized touch of traditional commerce.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to democratize e-commerce by providing businesses of all sizes with 
                enterprise-grade tools and insights, while offering customers a seamless, secure, 
                and enjoyable shopping experience.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-3">Core Mission Statement</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                "To empower businesses and delight customers through innovative e-commerce solutions 
                that are secure, scalable, and customer-centric. We believe in building lasting 
                relationships through transparency, reliability, and continuous innovation."
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. Company Timeline",
      icon: <FiCalendar />,
      content: (
        <div className="space-y-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className="relative flex items-start space-x-6 mb-8 last:mb-0">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center relative z-10">
                  <span className="text-white font-bold text-sm">{item.year}</span>
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 inline-block">
                    <span className="text-blue-600 text-xs font-medium">Milestone: {item.milestone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "3. Leadership Team",
      icon: <FiUsers />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                    <p className="text-blue-600 font-medium text-sm mb-2">{member.position}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-medium">{member.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Education:</span>
                        <span className="font-medium text-right">{member.education}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Focus Area:</span>
                        <span className="font-medium text-blue-600">{member.focus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "4. Core Values & Principles",
      icon: <FiAward />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {coreValues.map((value, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 bg-${value.color}-100 rounded-lg flex items-center justify-center text-${value.color}-600 mb-4`}>
                  {value.icon}
                </div>
                <h4 className="font-semibold text-gray-900 text-lg mb-3">{value.title}</h4>
                <p className="text-gray-700 text-sm mb-4">{value.description}</p>
                <div className="space-y-2">
                  {value.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 bg-${value.color}-500 rounded-full`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "5. Technology & Innovation",
      icon: <FiTrendingUp />,
      content: (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Our Tech Stack</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-700">Cloud Infrastructure</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">AWS</span>
                </div>
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-700">Frontend Framework</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">React.js</span>
                </div>
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-700">Backend Technology</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">Node.js</span>
                </div>
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-700">Database</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">MongoDB</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Innovation Focus</h4>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800 mb-2">AI & Machine Learning</h5>
                  <p className="text-green-700 text-sm">Personalized recommendations and predictive analytics</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Mobile-First Approach</h5>
                  <p className="text-purple-700 text-sm">Optimized for mobile commerce and app experience</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-800 mb-2">Security Innovation</h5>
                  <p className="text-yellow-700 text-sm">Advanced fraud detection and data protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "6. Global Presence & Impact",
      icon: <FiGlobe />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <FiMapPin className="text-blue-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900">Operations</h4>
              <p className="text-gray-600 text-sm">Pan-India presence with 50+ cities</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <FiTruck className="text-green-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900">Logistics</h4>
              <p className="text-gray-600 text-sm">500+ delivery partners nationwide</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <FiShoppingBag className="text-purple-600 text-2xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900">Merchants</h4>
              <p className="text-gray-600 text-sm">1000+ trusted seller partners</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Future Expansion Plans</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>International market entry (2024-2025)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Advanced AI capabilities</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Blockchain integration for security</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Sustainability initiatives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Professional Header */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FiTarget className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">About Quickoo</h1>
                <p className="text-sm text-gray-500">Leading E-Commerce Innovation Since 2020</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Established</p>
              <p className="font-semibold text-gray-900">2020</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-gray-700 text-sm">
              <strong>Company Profile:</strong> Technology-driven E-commerce Platform | 
              <strong> Headquarters:</strong> Pune, India | 
              <strong> Team Size:</strong> 150+ Professionals
            </p>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {companyStats.map((stat, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600 mx-auto mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* About Sections */}
        <div className="space-y-4">
          {aboutSections.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between w-full px-6 py-4 bg-white hover:bg-gray-50 text-left border-b border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-gray-600">
                    {section.icon}
                  </div>
                  <h2 className="font-semibold text-gray-900 text-lg">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-400">
                  {openSections[index] ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </button>
              
              {openSections[index] && (
                <div className="px-6 py-4 bg-white">
                  <div className="prose prose-gray max-w-none">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-orange-200 to-purple-200 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Join Our Journey</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Be part of India's fastest growing e-commerce platform. Whether you're a customer, 
            merchant, or potential team member, we'd love to have you with us on this exciting journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Explore Careers
            </button>
            <button className="border border-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Partner With Us
            </button>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Company Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Legal Name:</span>
                    <span className="font-medium">Quickoo E-Commerce Solutions Pvt. Ltd.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration:</span>
                    <span className="font-medium">U72900PN2020PTC196752</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Number:</span>
                    <span className="font-medium">27AAECQ8979L1ZY</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Certifications</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ISO Certification:</span>
                    <span className="font-medium">ISO 27001:2022</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PCI Compliance:</span>
                    <span className="font-medium">PCI DSS Level 1</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © 2024 Quickoo E-Commerce Solutions Pvt. Ltd. All rights reserved. 
                Transforming commerce through technology and innovation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;