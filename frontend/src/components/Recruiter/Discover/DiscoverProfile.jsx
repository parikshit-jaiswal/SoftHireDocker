import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplicantProfile } from '@/Api/ApplicantServices';
import Loader from '@/components/miniComponents/Loader';
import { Github, Linkedin, Twitter, Globe, Eye, Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, setNewChat, setReceiver, setRecentChats, setSender } from '@/redux/chatSlice';

function DiscoverProfile({ data }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(data)
    // Use API data or fallback
    const profile = data || {};
    const _id = profile?.user?._id || 'N/A';
    const name = profile.name || profile.user?.fullName || 'N/A';
    const location = profile.location || 'N/A';
    const pronouns = profile.identity?.displayPronouns && profile.identity?.pronouns ? profile.identity.pronouns : null;
    const primaryRole = profile.primaryRole || 'N/A';
    const yearsOfExperience = profile.yearsOfExperience || 'N/A';
    const openToRoles = profile.openToRoles || [];
    const bio = profile.bio || '';
    const workExperience = profile.workExperience || [];
    const skills = profile.skills || [];
    const achievements = profile.achievements || [];
    const education = profile.education || {};
    const social = profile.socialProfiles || {};
    const profileImage = profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
    const email = profile.user?.email || 'N/A';
    const resumeUrl = profile.resume || null; // Assuming resume URL is available

    const handleMessageClick = () => {
        dispatch(setReceiver(profile.user._id));
        const chatUser = {
            name,
            profileImage,
            _id,
            primaryRole
        };
        dispatch(setNewChat(chatUser));
        dispatch(setMessages([]));
        navigate("/recruiter/messages");
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

    const handleResumeClick = () => {
        if (resumeUrl) {
            window.open(resumeUrl, "_blank");
        } else {
            alert("No resume available for this candidate.");
        }
    };

    // Format work experience similar to Overview
    const formatWorkExperience = (experiences) => {
        return experiences.map(exp => ({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate || 'Present',
            description: exp.description
        }));
    };

    // Format education similar to Overview
    const formatEducation = (edu) => {
        if (!edu || Object.keys(edu).length === 0) return null;
        return {
            degree: edu.degree || 'N/A',
            major: edu.major,
            college: edu.college || edu.university || 'N/A',
            graduationYear: edu.graduationYear,
            gpa: edu.gpa
        };
    };

    const formattedWorkExperience = formatWorkExperience(workExperience);
    const formattedEducation = formatEducation(education);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            {/* Profile Preview Card - Responsive */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-8 bg-white">
                {/* User Info - Mobile Responsive */}
                <div className="mb-6 sm:mb-8">
                    {/* Mobile Layout - Centered */}
                    <div className="flex flex-col items-center text-center sm:hidden">
                        {/* Profile Image */}
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                            <img
                                src={profileImage}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
                                }}
                            />
                        </div>

                        {/* Name and Pronouns */}
                        <div className="mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                            {pronouns && (
                                <p className="text-sm text-gray-600 mt-1">({pronouns})</p>
                            )}
                        </div>

                        {/* Social Icons */}
                        {social && Object.keys(social).some(platform => social[platform]) && (
                            <div className="flex items-center justify-center space-x-4 mb-3">
                                {Object.entries(social).map(([platform, url]) =>
                                    url && (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                            title={platform}
                                        >
                                            {getSocialIcon(platform)}
                                        </a>
                                    )
                                )}
                            </div>
                        )}

                        {/* Resume Button */}
                        <button
                            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-4 ${resumeUrl
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={handleResumeClick}
                        >
                            {resumeUrl ? <Eye size={16} /> : <Download size={16} />}
                            <span>{resumeUrl ? "View Resume" : "No Resume"}</span>
                        </button>

                        {/* Location */}
                        <p className="text-gray-600 mb-1">{location}</p>

                        {/* Role */}
                        <p className="text-gray-900 font-medium mb-1">{primaryRole}</p>

                        {/* Experience */}
                        {yearsOfExperience && yearsOfExperience !== 'N/A' && (
                            <p className="text-gray-600 text-sm mb-3">{yearsOfExperience} years experience</p>
                        )}

                        {/* Availability Badge */}
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                            Available
                        </span>
                    </div>

                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden sm:flex sm:items-start">
                        {/* Profile Image */}
                        <div className="mr-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                                <img
                                    src={profileImage}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
                                    }}
                                />
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1">
                            {/* Name and Actions Row */}
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                                    {pronouns && (
                                        <span className="text-sm text-gray-600 mt-1">({pronouns})</span>
                                    )}
                                </div>

                                {/* Social Icons and Resume - Desktop */}
                                <div className="flex items-center space-x-3">
                                    {/* Social Profile Icons */}
                                    {social && Object.keys(social).some(platform => social[platform]) && (
                                        <div className="flex items-center space-x-2">
                                            {Object.entries(social).map(([platform, url]) =>
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
                                        </div>
                                    )}

                                    {/* Resume Button */}
                                    <button
                                        className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-colors ${resumeUrl
                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            }`}
                                        onClick={handleResumeClick}
                                    >
                                        {resumeUrl ? <Eye size={14} /> : <Download size={14} />}
                                        <span>{resumeUrl ? "View Resume" : "No Resume"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Location, Role, Experience - Desktop */}
                            <div className="flex items-center text-gray-600 mb-2">
                                <span>{location}</span>
                                <span className="mx-2">•</span>
                                <span>{primaryRole}</span>
                                {yearsOfExperience && yearsOfExperience !== 'N/A' && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span>{yearsOfExperience} years experience</span>
                                    </>
                                )}
                            </div>

                            {/* Availability Badge */}
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Available
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bio / About */}
                {bio && (
                    <div className="mb-6 sm:mb-8">
                        <h4 className="text-sm text-gray-500 mb-2">About</h4>
                        <div className="pl-3 sm:pl-4 border-l-2 border-gray-300">
                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{bio}</p>
                        </div>
                    </div>
                )}

                {/* Work Experience */}
                {formattedWorkExperience.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <h4 className="text-sm text-gray-500 mb-2">Work Experience</h4>
                        <div className="space-y-4">
                            {formattedWorkExperience.map((exp, index) => (
                                <div key={index} className="pl-3 sm:pl-4 border-l-2 border-gray-300">
                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{exp.title}</div>
                                    <div className="text-gray-700 text-sm sm:text-base">{exp.company}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">{exp.startDate} - {exp.endDate}</div>
                                    {exp.description && (
                                        <p className="text-gray-700 mt-1 text-xs sm:text-sm leading-relaxed">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {formattedEducation && (
                    <div className="mb-6 sm:mb-8">
                        <h4 className="text-sm text-gray-500 mb-2">Education</h4>
                        <div className="pl-3 sm:pl-4 border-l-2 border-gray-300">
                            <p className="font-medium text-sm sm:text-base">
                                {formattedEducation.degree}
                                {formattedEducation.major && `, ${formattedEducation.major}`}
                            </p>
                            <p className="text-gray-700 text-sm sm:text-base">
                                {formattedEducation.college}
                                {formattedEducation.graduationYear && ` • ${formattedEducation.graduationYear}`}
                            </p>
                            {formattedEducation.gpa && (
                                <p className="text-xs sm:text-sm text-gray-600">GPA: {formattedEducation.gpa}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <h4 className="text-sm text-gray-500 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements */}
                {achievements && achievements.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <h4 className="text-sm text-gray-500 mb-2">Achievements</h4>
                        <div className="pl-3 sm:pl-4 border-l-2 border-gray-300">
                            {achievements.map((achievement, index) => (
                                <p key={index} className="text-gray-700 mb-1 text-sm sm:text-base leading-relaxed">• {achievement}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Open to Roles */}
                {openToRoles && openToRoles.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <h4 className="text-sm text-gray-500 mb-2">Open to Roles</h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {openToRoles.map((role, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-blue-800"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Information */}
                <div className="pt-4 border-t border-gray-200 mb-6">
                    <h4 className="text-sm text-gray-500 mb-2">Contact</h4>
                    <p className="text-gray-700 text-sm sm:text-base break-all sm:break-normal">{email}</p>
                </div>

                {/* Action Buttons - Full width on mobile */}
                <div className="flex justify-center sm:justify-end">
                    <button
                        onClick={handleMessageClick}
                        className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DiscoverProfile;