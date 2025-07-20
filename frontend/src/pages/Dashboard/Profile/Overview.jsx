import React, { useState, useEffect } from "react";
import { Linkedin, Github, Globe, Twitter, Download, Eye } from "lucide-react";
import profileService from "@/Api/profileService";
import userService from "@/Api/UserService";

const Overview = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    loadProfileData();
    loadResumeData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const profileResult = await profileService.getCurrentUserProfile();
      
      if (profileResult.success) {
        const formattedProfile = profileService.formatProfileData(profileResult.data);
        setProfileData(formattedProfile);
      } else {
        setError(profileResult.message);
      }
    } catch (err) {
      setError("Failed to load profile data");
      console.error("Profile loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Use dedicated resume API instead of profile API
  const loadResumeData = async () => {
    try {
      console.log('🔄 Loading resume for current user...');
      
      // ✅ REMOVED: localStorage check - avoid stale data
      // Use the dedicated resume API to get current user's resume
      const result = await userService.getResume();
      
      if (result.success && result.data?.resume) {
        console.log('✅ Found resume for current user:', result.data.resume);
        setResumeUrl(result.data.resume);
      } else {
        console.log('📝 No resume found for current user');
        setResumeUrl(null);
      }
    } catch (error) {
      console.error('❌ Failed to load resume:', error);
      setResumeUrl(null);
    }
  };

  const handleResumeClick = () => {
    if (resumeUrl) {
      // ✅ Handle both Cloudinary URLs and relative paths
      const fullUrl = resumeUrl.startsWith('http') 
        ? resumeUrl 
        : `${import.meta.env.VITE_SERVER_URL}${resumeUrl}`;
      window.open(fullUrl, "_blank");
    } else {
      alert("No resume uploaded yet. Please upload your resume in the Resume/CV tab.");
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin size={20} className="text-gray-600" />;
      case 'github': return <Github size={20} className="text-gray-600" />;
      case 'twitter': return <Twitter size={20} className="text-gray-600" />;
      case 'website': return <Globe size={20} className="text-gray-600" />;
      default: return <Globe size={20} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={loadProfileData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No profile data found. Please create your profile first.</p>
        <button 
          onClick={() => window.location.href = "/dashboard/profile?tab=Profile"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Profile
        </button>
      </div>
    );
  }

  const formattedWorkExperience = profileService.formatWorkExperience(profileData.workExperience);
  const formattedEducation = profileService.formatEducation(profileData.education);

  // Get display image
  const displayImage = profileData.profileImage || profileData.user?.avatar;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">What Recruiters will see</h2>

      {/* Profile Preview Card */}
      <div className="border border-gray-200 rounded-lg p-8 bg-white">
        {/* User Info */}
        <div className="flex items-start mb-8">
          <div className="mr-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=6366f1&color=fff`;
                  }}
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=6366f1&color=fff`}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{profileData.name}</h3>
                {profileData.identity?.displayPronouns && profileData.identity?.pronouns && (
                  <span className="text-sm text-gray-600 mt-1">({profileData.identity.pronouns})</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {/* Social Profile Icons */}
                {profileData.socialProfiles && Object.entries(profileData.socialProfiles).map(([platform, url]) => 
                  url && (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                      title={platform}
                    >
                      {getSocialIcon(platform)}
                    </a>
                  )
                )}
                
                {/* ✅ UPDATED: Resume Button with better status indication */}
                <div className="flex items-center space-x-1">
                  <button
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                      resumeUrl 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                    }`}
                    onClick={handleResumeClick}
                  >
                    {resumeUrl ? <Eye size={14} /> : <Download size={14} />}
                    <span>{resumeUrl ? "View Resume" : "Upload Resume"}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-2 mb-2 text-gray-600">
              <span>{profileData.location}</span>
              <span className="mx-2">•</span>
              <span>{profileData.primaryRole}</span>
              {profileData.yearsOfExperience && (
                <>
                  <span className="mx-2">•</span>
                  <span>{profileData.yearsOfExperience} experience</span>
                </>
              )}
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Active Today
            </span>
          </div>
        </div>

        {/* Bio / Looking for */}
        {profileData.bio && (
          <div className="mb-8">
            <h4 className="text-sm text-gray-500 mb-2">About</h4>
            <div className="pl-4 border-l-2 border-gray-300">
              <p className="text-gray-700">{profileData.bio}</p>
            </div>
          </div>
        )}

        {/* Work Experience */}
        {formattedWorkExperience.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm text-gray-500 mb-2">Work Experience</h4>
            <div className="space-y-4">
              {formattedWorkExperience.map((exp, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-300">
                  <div className="font-semibold text-gray-900">{exp.title}</div>
                  <div className="text-gray-700">{exp.company}</div>
                  <div className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</div>
                  {exp.description && (
                    <p className="text-gray-700 mt-1 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {formattedEducation && (
          <div className="mb-8">
            <h4 className="text-sm text-gray-500 mb-2">Education</h4>
            <div>
              <p className="font-medium">
                {formattedEducation.degree}
                {formattedEducation.major && `, ${formattedEducation.major}`}
              </p>
              <p className="text-gray-700">
                {formattedEducation.college}
                {formattedEducation.graduationYear && ` • ${formattedEducation.graduationYear}`}
              </p>
              {formattedEducation.gpa && (
                <p className="text-sm text-gray-600">GPA: {formattedEducation.gpa}</p>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {profileData.skills && profileData.skills.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm text-gray-500 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {profileData.achievements && profileData.achievements !== 'No achievements listed' && (
          <div className="mb-8">
            <h4 className="text-sm text-gray-500 mb-2">Achievements</h4>
            <div className="pl-4 border-l-2 border-gray-300">
              <p className="text-gray-700">{profileData.achievements}</p>
            </div>
          </div>
        )}

        {/* Open to Roles */}
        {profileData.openToRoles && profileData.openToRoles.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm text-gray-500 mb-2">Open to Roles</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.openToRoles.map((role, index) => (
                <span
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-800"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm text-gray-500 mb-2">Contact</h4>
          <p className="text-gray-700">{profileData.email}</p>
        </div>
      </div>
    </>
  );
};

export default Overview;
