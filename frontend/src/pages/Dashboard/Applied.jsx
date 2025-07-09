import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  ChevronRight, Calendar, Clock, MapPin, Building, Briefcase, 
  Filter, Search, ExternalLink, Eye, Mail, Phone, Globe,
  DollarSign, Users, Award, CheckCircle, XCircle, AlertCircle, Menu
} from "lucide-react";
import userService from "@/Api/UserService";

export default function JobApplicationDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, activeTab, searchTerm, statusFilter]);

  // Reset expanded application when changing tabs
  useEffect(() => {
    setExpandedApplication(null);
  }, [activeTab]);

  // Handle navigation from dashboard with specific application to expand
  useEffect(() => {
    if (location.state?.expandedId && applications.length > 0) {
      setExpandedApplication(location.state.expandedId);
      // Clear the state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, applications]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const result = await userService.getAppliedJobs();
      console.log("API Result:", result); // Debug log
      
      if (result.success) {
        const formattedApplications = userService.formatApplicationData(result.data);
        console.log("Formatted Applications:", formattedApplications); // Debug log
        setApplications(formattedApplications);
      } else {
        setError(result.message || "Failed to load applications");
      }
    } catch (err) {
      setError("Failed to load job applications");
      console.error("Error loading applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by status (ongoing vs archived)
    if (activeTab === "Ongoing") {
      filtered = filtered.filter(app => 
        ["Pending", "Submitted", "Under Review", "Interview Scheduled", "Shortlisted"].includes(app.status)
      );
    } else {
      filtered = filtered.filter(app => 
        ["Rejected", "Withdrawn", "Accepted", "Offer Extended"].includes(app.status)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => {
        const searchLower = searchTerm.toLowerCase();
        const jobTitleMatch = app.jobTitle.toLowerCase().includes(searchLower);
        const companyMatch = app.company.toLowerCase().includes(searchLower);
        
        // Safe skills check - ensure skills is an array before checking
        const skillsMatch = Array.isArray(app.skills) 
          ? app.skills.some(skill => skill.toLowerCase().includes(searchLower))
          : false;
        
        return jobTitleMatch || companyMatch || skillsMatch;
      });
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "Pending": "bg-yellow-400",
      "Submitted": "bg-blue-400",
      "Under Review": "bg-purple-400",
      "Interview Scheduled": "bg-green-400",
      "Shortlisted": "bg-emerald-400",
      "Rejected": "bg-red-400",
      "Withdrawn": "bg-gray-400",
      "Accepted": "bg-green-600",
      "Offer Extended": "bg-emerald-600"
    };
    return statusColors[status] || "bg-gray-400";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
      case "Offer Extended":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Rejected":
      case "Withdrawn":
        return <XCircle size={16} className="text-red-600" />;
      case "Interview Scheduled":
        return <Calendar size={16} className="text-green-600" />;
      default:
        return <AlertCircle size={16} className="text-yellow-600" />;
    }
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName) return "?";
    return companyName
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500",
      "bg-yellow-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500"
    ];
    const hash = companyName ? companyName.split("").reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const toggleApplicationDetails = (applicationId) => {
    console.log("Toggling details for application:", applicationId);
    setExpandedApplication(
      expandedApplication === applicationId ? null : applicationId
    );
  };

  const getOngoingStatuses = () => {
    const ongoingApps = applications.filter(app => 
      ["Pending", "Submitted", "Under Review", "Interview Scheduled", "Shortlisted"].includes(app.status)
    );
    return [...new Set(ongoingApps.map(app => app.status))];
  };

  const getArchivedStatuses = () => {
    const archivedApps = applications.filter(app => 
      ["Rejected", "Withdrawn", "Accepted", "Offer Extended"].includes(app.status)
    );
    return [...new Set(archivedApps.map(app => app.status))];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex min-h-screen">
          <main className="flex-1 p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Applications</h2>
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading your applications...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex min-h-screen">
          <main className="flex-1 p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Applications</h2>
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={loadApplications}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <main className="flex-1 p-4 md:p-6">
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl md:text-2xl font-bold">Applications</h2>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-600">
                Total: {applications.length} applications
              </span>
              <button
                onClick={loadApplications}
                className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 w-full sm:w-auto"
              >
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Section - Responsive */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Filters */}
            <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by job title, company, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base w-full md:w-auto"
                  >
                    <option value="All">All Statuses</option>
                    {activeTab === "Ongoing" 
                      ? getOngoingStatuses().map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))
                      : getArchivedStatuses().map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))
                    }
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Responsive */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-4 md:space-x-8 overflow-x-auto">
              <button
                className={`py-2 px-1 font-medium relative whitespace-nowrap ${
                  activeTab === "Ongoing"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Ongoing")}
              >
                Ongoing
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {applications.filter(app => 
                    ["Pending", "Submitted", "Under Review", "Interview Scheduled", "Shortlisted"].includes(app.status)
                  ).length}
                </span>
              </button>
              <button
                className={`py-2 px-1 font-medium relative whitespace-nowrap ${
                  activeTab === "Archived"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Archived")}
              >
                Archived
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                  {applications.filter(app => 
                    ["Rejected", "Withdrawn", "Accepted", "Offer Extended"].includes(app.status)
                  ).length}
                </span>
              </button>
            </div>
          </div>

          {/* Application Cards - Responsive */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === "Ongoing" ? "No ongoing applications" : "No archived applications"}
              </h3>
              <p className="text-gray-500 mb-6 px-4">
                {activeTab === "Ongoing" 
                  ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                  : "No completed applications found."
                }
              </p>
              {activeTab === "Ongoing" && (
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Browse Jobs
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                  {/* Main Application Card - Responsive Layout */}
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
                      <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                        {/* Company Logo */}
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${getCompanyColor(app.company)} text-white rounded-lg flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0`}>
                          {getCompanyInitials(app.company)}
                        </div>
                        
                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 truncate">
                            {app.jobTitle}
                          </h3>
                          
                          {/* Company and Location - Stack on mobile */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-600 mb-2 space-y-1 sm:space-y-0">
                            <div className="flex items-center space-x-1">
                              <Building size={14} className="flex-shrink-0" />
                              <span className="text-sm truncate">{app.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin size={14} className="flex-shrink-0" />
                              <span className="text-sm truncate">{app.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase size={14} className="flex-shrink-0" />
                              <span className="text-sm truncate">{app.jobType}</span>
                            </div>
                          </div>
                          
                          {/* Status and Dates - Stack on mobile */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(app.status)}
                              <span className={`w-2 h-2 ${getStatusColor(app.status)} rounded-full`}></span>
                              <span className="text-sm font-medium text-gray-900">{app.status}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500 text-xs md:text-sm">
                              <Calendar size={12} className="flex-shrink-0" />
                              <span>Applied: {app.appliedDate}</span>
                            </div>
                            {app.statusUpdatedAt !== app.appliedDate && (
                              <div className="flex items-center space-x-1 text-gray-500 text-xs md:text-sm">
                                <Clock size={12} className="flex-shrink-0" />
                                <span>Updated: {app.statusUpdatedAt}</span>
                              </div>
                            )}
                          </div>

                          {/* Skills - Show fewer on mobile */}
                          {Array.isArray(app.skills) && app.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {app.skills.slice(0, window.innerWidth < 768 ? 2 : 3).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {app.skills.length > (window.innerWidth < 768 ? 2 : 3) && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{app.skills.length - (window.innerWidth < 768 ? 2 : 3)} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions - Full width on mobile */}
                      <div className="flex flex-col items-end space-y-2 md:ml-4">
                        <button 
                          onClick={() => toggleApplicationDetails(app.id)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors w-full md:w-auto justify-center md:justify-start"
                        >
                          <span className="text-sm font-medium">
                            {expandedApplication === app.id ? "Hide Details" : "View Details"}
                          </span>
                          <ChevronRight 
                            size={16} 
                            className={`transform transition-transform ${
                              expandedApplication === app.id ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Quick Info Row - Responsive */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          {app.salary !== "Not disclosed" && (
                            <div className="flex items-center space-x-1">
                              <DollarSign size={14} />
                              <span className="truncate">{app.salary}</span>
                            </div>
                          )}
                          {app.remotePolicy !== "Not specified" && (
                            <div className="flex items-center space-x-1">
                              <Globe size={14} />
                              <span>{app.remotePolicy}</span>
                            </div>
                          )}
                          {app.visaSponsorship && (
                            <div className="flex items-center space-x-1">
                              <Award size={14} />
                              <span>Visa Sponsorship</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          {app.coverLetter && (
                            <span className="flex items-center space-x-1">
                              <span>📝</span>
                              <span>Cover letter</span>
                            </span>
                          )}
                          {app.resume && (
                            <span className="flex items-center space-x-1">
                              <span>📄</span>
                              <span>Resume</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Responsive Grid */}
                  {expandedApplication === app.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4 md:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Job Description */}
                        {app.jobDescription && app.jobDescription !== 'No description available' && (
                          <div className="lg:col-span-2">
                            <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {app.jobDescription}
                            </p>
                          </div>
                        )}

                        {/* Contact Person */}
                        {app.contactPerson && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Contact Person</h4>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p><strong>{app.contactPerson.name}</strong></p>
                              <p>{app.contactPerson.position}</p>
                              <p>{app.contactPerson.location}</p>
                              <p>{app.contactPerson.experience} experience</p>
                            </div>
                          </div>
                        )}

                        {/* Responsibilities */}
                        {Array.isArray(app.responsibilities) && app.responsibilities.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {app.responsibilities.map((resp, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Qualifications */}
                        {Array.isArray(app.qualifications) && app.qualifications.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {app.qualifications.map((qual, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-1">✓</span>
                                  <span>{qual}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tools & Technologies */}
                        {Array.isArray(app.tools) && app.tools.length > 0 && (
                          <div className="lg:col-span-2">
                            <h4 className="font-semibold text-gray-900 mb-2">Tools & Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {app.tools.map((tool, index) => (
                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cover Letter */}
                        {app.coverLetter && (
                          <div className="lg:col-span-2">
                            <h4 className="font-semibold text-gray-900 mb-2">Your Cover Letter</h4>
                            <div className="bg-white p-4 rounded border text-sm text-gray-700 leading-relaxed">
                              {app.coverLetter}
                            </div>
                          </div>
                        )}

                        {/* Additional Info - Responsive Grid */}
                        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                          {app.collaborationHours && app.collaborationHours !== 'Not specified' && (
                            <div>
                              <span className="text-xs text-gray-500">Working Hours</span>
                              <p className="text-sm font-medium break-words">{app.collaborationHours}</p>
                            </div>
                          )}
                          {app.postedAt && (
                            <div>
                              <span className="text-xs text-gray-500">Posted</span>
                              <p className="text-sm font-medium">{app.postedAt}</p>
                            </div>
                          )}
                          {Array.isArray(app.hiresIn) && app.hiresIn.length > 0 && (
                            <div>
                              <span className="text-xs text-gray-500">Hires In</span>
                              <p className="text-sm font-medium">{app.hiresIn.join(', ')}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-xs text-gray-500">Active Job</span>
                            <p className="text-sm font-medium">{app.isActive ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats - Responsive Grid */}
          {applications.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              <div className="bg-yellow-50 p-3 md:p-4 rounded-lg text-center">
                <div className="text-xl md:text-2xl font-bold text-yellow-600">
                  {applications.filter(app => ["Pending", "Submitted"].includes(app.status)).length}
                </div>
                <div className="text-xs md:text-sm text-yellow-800">Pending</div>
              </div>
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center">
                <div className="text-xl md:text-2xl font-bold text-blue-600">
                  {applications.filter(app => app.status === "Under Review").length}
                </div>
                <div className="text-xs md:text-sm text-blue-800">Under Review</div>
              </div>
              <div className="bg-green-50 p-3 md:p-4 rounded-lg text-center">
                <div className="text-xl md:text-2xl font-bold text-green-600">
                  {applications.filter(app => ["Interview Scheduled", "Shortlisted"].includes(app.status)).length}
                </div>
                <div className="text-xs md:text-sm text-green-800">Interviews</div>
              </div>
              <div className="bg-purple-50 p-3 md:p-4 rounded-lg text-center">
                <div className="text-xl md:text-2xl font-bold text-purple-600">
                  {applications.filter(app => ["Offer Extended", "Accepted"].includes(app.status)).length}
                </div>
                <div className="text-xs md:text-sm text-purple-800">Offers</div>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg text-center col-span-2 md:col-span-1">
                <div className="text-xl md:text-2xl font-bold text-gray-600">
                  {applications.length}
                </div>
                <div className="text-xs md:text-sm text-gray-800">Total</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
