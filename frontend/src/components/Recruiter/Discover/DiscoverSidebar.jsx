import React, { useEffect, useState } from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { setMessages, setReceiver } from '@/redux/chatSlice';
import { skillOptions } from '@/constants/postJobOptions';
import { locations } from '@/constants/locations';
import { ro } from 'date-fns/locale';

const DiscoverSidebar = ({ discoverApplicants }) => {

  const [searchValue, setSearchValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  // Filter state
  const [roleFilter, setRoleFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState([]);
  const [skillFilter, setSkillFilter] = useState([]);
  const [educationFilter, setEducationFilter] = useState([]);

  // Remove filter handlers
  const removeRole = (role) => setRoleFilter(roleFilter.filter(r => r !== role));
  const removeLocation = (loc) => setLocationFilter(locationFilter.filter(l => l !== loc));
  const removeExperience = (exp) => setExperienceFilter(experienceFilter.filter(e => e !== exp));
  const removeSkill = (skill) => setSkillFilter(skillFilter.filter(s => s !== skill));
  const removeEducation = (edu) => setEducationFilter(educationFilter.filter(e => e !== edu));

  // Add filter handlers
  const addRole = (role) => {
    if (!roleFilter.includes(role)) setRoleFilter([...roleFilter, role]);
  };
  const addLocation = (loc) => {
    if (!locationFilter.includes(loc)) setLocationFilter([...locationFilter, loc]);
  };
  const addExperience = (exp) => {
    if (!experienceFilter.includes(exp)) setExperienceFilter([...experienceFilter, exp]);
  };
  const addSkill = (skill) => {
    if (!skillFilter.includes(skill)) setSkillFilter([...skillFilter, skill]);
  };
  const addEducation = (edu) => {
    if (!educationFilter.includes(edu)) setEducationFilter([...educationFilter, edu]);
  };

  // Dropdown open state
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [experienceDropdown, setExperienceDropdown] = useState(false);
  const [skillDropdown, setSkillDropdown] = useState(false);
  const [educationDropdown, setEducationDropdown] = useState(false);

  // Dropdown search state
  const [roleSearch, setRoleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [experienceSearch, setExperienceSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [educationSearch, setEducationSearch] = useState('');

  // Example dropdown options
  const roleOptions = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Software Engineer",
    "Mobile App Developer",
    "Android Developer",
    "iOS Developer",
    "UI/UX Designer",
    "Web Developer",
    "QA Engineer",
    "Automation Tester",
    "Game Developer",
    "Cybersecurity Analyst",
    "Information Security Specialist",
    "Network Engineer",
    "IT Support Specialist",
    "Database Administrator",
    "System Administrator",
    "Site Reliability Engineer",
    "AI Engineer",
    "Blockchain Developer",
    "Embedded Systems Engineer",
    "IoT Developer",
    "AR/VR Developer",
    "Robotics Engineer",
    "Technical Writer",
    "Product Manager",
    "Project Manager",
    "Business Analyst",
    "Scrum Master",
    "Software Architect",
    "Solutions Architect",
    "Salesforce Developer",
    "CRM Consultant",
    "ERP Consultant",
    "Tech Support Engineer",
    "Help Desk Technician",
    "IT Consultant",
    "SEO Specialist",
    "Digital Marketing Analyst",
    "Content Strategist",
    "Social Media Manager",
    "Graphic Designer",
    "Video Editor",
    "3D Animator",
    "Photographer",
    "Penetration Tester",
    "Ethical Hacker",
    "Game Designer",
    "Game Tester",
    "VR Designer",
    "AI Researcher",
    "Computer Vision Engineer",
    "NLP Engineer",
    "Big Data Engineer",
    "Hadoop Developer",
    "SAP Consultant",
    "Oracle Developer",
    "Python Developer",
    "Java Developer",
    "Technical Program Manager",
    "Innovation Manager",
    "Firmware Engineer",
    "VLSI Design Engineer",
    "FPGA Engineer",
    "Technical Account Manager",
    "Cloud Security Engineer",
    "Mobile Security Analyst",
    "IT Risk Analyst",
    "Infrastructure Engineer",
    "Network Security Engineer",
    "IT Governance Analyst",
    "Information Systems Manager",
    "Platform Engineer",
    "AI Ethics Researcher",
    "Data Engineer",
    "Data Architect",
    "Solutions Engineer",
    "Security Consultant",
    "Security Engineer",
    "Quantitative Analyst",
    "Financial Data Analyst",
    "Digital Forensics Analyst",
    "IT Project Coordinator",
    "Health Informatics Specialist",
    "EdTech Developer",
    "Agile Coach",
    "Scrum Product Owner",
    "Tech Evangelist",
    "Cloud Migration Engineer",
    "Business Intelligence Developer",
    "IT Compliance Analyst",
    "Database Architect",
    "IT Trainer",
    "Research Software Engineer",
    "IT Asset Manager",
    "Application Support Engineer",
    "Security Operations Center Analyst (SOC Analyst)",
    "Logistics Software Engineer",
    "Legal Tech Consultant",
    "InsurTech Developer",
    "FinTech Product Manager",
    "SaaS Engineer",
    "CRM Specialist",
    "Data Compliance Officer",
    "Knowledge Management Specialist",
    "Telecom Engineer",
    "E-commerce Tech Lead",
    "Streaming Platform Engineer",
    "DevRel Engineer",
    "JavaScript Developer",
    "TypeScript Developer",
    "C++ Developer",
    "C# Developer",
    "Go Developer",
    "Rust Developer",
    "PHP Developer",
    "Ruby on Rails Developer",
    "Perl Developer",
    "Scala Developer",
    "Technical Recruiter",
    "Cloud Consultant",
    "Azure Engineer",
    "AWS Engineer",
    "GCP Engineer",
    "Kubernetes Specialist",
    "Docker Expert",
    "CI/CD Engineer",
    "NoSQL Developer",
    "MongoDB Specialist",
    "PostgreSQL Developer",
    "MySQL Developer",
    "Linux Administrator",
    "Windows Server Engineer",
    "IT Auditor",
    "CTO",
    "Software Tester",
    "Tech Support Specialist",
    "Computer Programmer",
    "Hardware Engineer",
    "Biomedical Engineer",
    "Research Scientist",
    "Mathematician",
    "Statistician",
    "Simulation Engineer"
  ];
  const locationOptions = locations;

  const experienceOptions = [
    "0-1 year",
    "1-2 years",
    "2-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ];
  const educationOptions = [
    "B.Tech",
    "B.Sc",
    "B.A",
    "M.Tech",
    "M.Sc",
    "MBA",
    "Ph.D"
  ];
  // Helper to close all dropdowns except the one being opened, and toggle if already open
  const toggleDropdown = (dropdown, setDropdown) => {
    if (dropdown) {
      setRoleDropdown(false);
      setLocationDropdown(false);
      setExperienceDropdown(false);
      setSkillDropdown(false);
      setEducationDropdown(false);
    } else {
      setRoleDropdown(false);
      setLocationDropdown(false);
      setExperienceDropdown(false);
      setSkillDropdown(false);
      setEducationDropdown(false);
      setDropdown(true);
    }
  };

  useEffect(() => {
    console.log('Filters changed:', {
      roleFilter,
      locationFilter,
      experienceFilter,
      skillFilter,
      educationFilter
    });

    discoverApplicants({ role: roleFilter, location: locationFilter, experience: experienceFilter, skills: skillFilter, education: educationFilter })

  }, [roleFilter, locationFilter, experienceFilter, skillFilter, educationFilter]);

  return (
    <div className="relative flex h-screen pb-16">
      {/* Mobile Toggle Button - positioned relative to parent container */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-3 left-0 z-50 p-2"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-80 bg-white transition-transform duration-300 ease-in-out h-screen`}>
        <div className="w-80 h-screen bg-[#F4F3F2] flex flex-col z-0">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          </div>

          {/* Search and Filters */}
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}

            {/* Filters */}
            <div className="space-y-6 mt-6">
              {/* Role Filter */}
              <div>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(roleDropdown, setRoleDropdown)}>
                  <span className="font-bold text-lg text-gray-900">Role</span>
                  <Plus className={`text-2xl text-gray-400 font-bold transition-transform ${roleDropdown ? 'rotate-45' : ''}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {roleFilter.map(role => (
                    <span key={role} className="bg-white border border-gray-300 text-gray-700 rounded-2xl px-3 py-1 flex items-center text-sm font-medium">
                      {role}
                      <button className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => removeRole(role)}>×</button>
                    </span>
                  ))}
                </div>
                {roleDropdown && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 z-10 absolute w-64 max-h-48 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search roles"
                      value={roleSearch}
                      onChange={e => setRoleSearch(e.target.value)}
                      className="w-full mb-2 px-2 py-1 border rounded text-sm"
                    />
                    {roleOptions.filter(option => option.toLowerCase().includes(roleSearch.toLowerCase())).map(option => (
                      <div
                        key={option}
                        className={`px-3 py-2 rounded cursor-pointer text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-100 ${roleFilter.includes(option) ? 'bg-blue-100 font-semibold' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (roleFilter.includes(option)) {
                            removeRole(option);
                          } else {
                            addRole(option);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={roleFilter.includes(option)}
                          readOnly
                          className="mr-2 accent-blue-500"
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Location Filter */}
              <div>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(locationDropdown, setLocationDropdown)}>
                  <span className="font-bold text-lg text-gray-900">Location</span>
                  <Plus className={`text-2xl text-gray-400 font-bold transition-transform ${locationDropdown ? 'rotate-45' : ''}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {locationFilter.map(loc => (
                    <span key={loc} className="bg-white border border-gray-300 text-gray-700 rounded-2xl px-3 py-1 flex items-center text-sm font-medium">
                      {loc}
                      <button className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => removeLocation(loc)}>×</button>
                    </span>
                  ))}
                </div>
                {locationDropdown && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 z-10 absolute w-64 max-h-48 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search locations"
                      value={locationSearch}
                      onChange={e => setLocationSearch(e.target.value)}
                      className="w-full mb-2 px-2 py-1 border rounded text-sm"
                    />
                    {locationOptions.filter(option => option.toLowerCase().includes(locationSearch.toLowerCase())).map(option => (
                      <div
                        key={option}
                        className={`px-3 py-2 rounded cursor-pointer text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-100 ${locationFilter.includes(option) ? 'bg-blue-100 font-semibold' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (locationFilter.includes(option)) {
                            removeLocation(option);
                          } else {
                            addLocation(option);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={locationFilter.includes(option)}
                          readOnly
                          className="mr-2 accent-blue-500"
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Experience Filter */}
              <div>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(experienceDropdown, setExperienceDropdown)}>
                  <span className="font-bold text-lg text-gray-900">Experience</span>
                  <Plus className={`text-2xl text-gray-400 font-bold transition-transform ${experienceDropdown ? 'rotate-45' : ''}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {experienceFilter.map(exp => (
                    <span key={exp} className="bg-white border border-gray-300 text-gray-700 rounded-2xl px-3 py-1 flex items-center text-sm font-medium">
                      {exp}
                      <button className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => removeExperience(exp)}>×</button>
                    </span>
                  ))}
                </div>
                {experienceDropdown && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 z-10 absolute w-64 max-h-48 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search experience"
                      value={experienceSearch}
                      onChange={e => setExperienceSearch(e.target.value)}
                      className="w-full mb-2 px-2 py-1 border rounded text-sm"
                    />
                    {experienceOptions.filter(option => option.toLowerCase().includes(experienceSearch.toLowerCase())).map(option => (
                      <div
                        key={option}
                        className={`px-3 py-2 rounded cursor-pointer text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-100 ${experienceFilter.includes(option) ? 'bg-blue-100 font-semibold' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (experienceFilter.includes(option)) {
                            removeExperience(option);
                          } else {
                            addExperience(option);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={experienceFilter.includes(option)}
                          readOnly
                          className="mr-2 accent-blue-500"
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Skill Filter */}
              <div>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(skillDropdown, setSkillDropdown)}>
                  <span className="font-bold text-lg text-gray-900">Skill</span>
                  <Plus className={`text-2xl text-gray-400 font-bold transition-transform ${skillDropdown ? 'rotate-45' : ''}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillFilter.map(skill => (
                    <span key={skill} className="bg-white border border-gray-300 text-gray-700 rounded-2xl px-3 py-1 flex items-center text-sm font-medium">
                      {skill}
                      <button className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => removeSkill(skill)}>×</button>
                    </span>
                  ))}
                </div>
                {skillDropdown && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 z-10 absolute w-64 max-h-48 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search skills"
                      value={skillSearch}
                      onChange={e => setSkillSearch(e.target.value)}
                      className="w-full mb-2 px-2 py-1 border rounded text-sm"
                    />
                    {skillOptions.filter(option => option.toLowerCase().includes(skillSearch.toLowerCase())).map(option => (
                      <div
                        key={option}
                        className={`px-3 py-2 rounded cursor-pointer text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-100 ${skillFilter.includes(option) ? 'bg-blue-100 font-semibold' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (skillFilter.includes(option)) {
                            removeSkill(option);
                          } else {
                            addSkill(option);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={skillFilter.includes(option)}
                          readOnly
                          className="mr-2 accent-blue-500"
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Education Filter */}
              <div>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(educationDropdown, setEducationDropdown)}>
                  <span className="font-bold text-lg text-gray-900">Education</span>
                  <Plus className={`text-2xl text-gray-400 font-bold transition-transform ${educationDropdown ? 'rotate-45' : ''}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {educationFilter.map(edu => (
                    <span key={edu} className="bg-white border border-gray-300 text-gray-700 rounded-2xl px-3 py-1 flex items-center text-sm font-medium">
                      {edu}
                      <button className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => removeEducation(edu)}>×</button>
                    </span>
                  ))}
                </div>
                {educationDropdown && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow p-2 z-10 absolute w-64 max-h-48 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search education"
                      value={educationSearch}
                      onChange={e => setEducationSearch(e.target.value)}
                      className="w-full mb-2 px-2 py-1 border rounded text-sm"
                    />
                    {educationOptions.filter(option => option.toLowerCase().includes(educationSearch.toLowerCase())).map(option => (
                      <div
                        key={option}
                        className={`px-3 py-2 rounded cursor-pointer text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-100 ${educationFilter.includes(option) ? 'bg-blue-100 font-semibold' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (educationFilter.includes(option)) {
                            removeEducation(option);
                          } else {
                            addEducation(option);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={educationFilter.includes(option)}
                          readOnly
                          className="mr-2 accent-blue-500"
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Overlay for mobile */}
      {
        isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )
      }
    </div >
  );
};

export default DiscoverSidebar;
