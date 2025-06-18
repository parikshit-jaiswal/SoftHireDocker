import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplicantProfile } from '@/Api/ApplicantServices';
import Loader from '@/components/miniComponents/Loader';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setNewChat, setReceiver, setRecentChats, setSender } from '@/redux/chatSlice';

function ApplicantsProfile() {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchProfile = async (id) => {
        try {
            setLoading(true);
            if (!id) {
                throw new Error("No ID provided");
            }
            const response = await getApplicantProfile(id);
            setData(response);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile(id);
    }, []);

    // Use API data or fallback
    const profile = data || {};
    const _id = profile.user?._id || id || 'N/A'; // Fallback to id from params if user._id is not available
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

    const handleMessageClick = () => {
        dispatch(setReceiver(profile.user._id));
        const chatUser = {
            name,
            profileImage,
            _id,
            primaryRole
        };
        dispatch(setNewChat(chatUser));
        navigate("/recruiter/messages");
    };




    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-2 sm:p-6 md:p-10">
            <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 sm:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                        src={profileImage}
                        alt={name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-300"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=User'; }}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 truncate">{name}</h1>
                            {pronouns && (
                                <span className="ml-0 sm:ml-3 px-3 py-1 text-xs sm:text-sm rounded-full bg-gray-100 border border-gray-300 text-gray-700 font-medium w-fit">{pronouns}</span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-gray-700 text-sm">
                            <span>{location}</span>
                            {primaryRole && <span>• {primaryRole}</span>}
                            {yearsOfExperience && <span>• {yearsOfExperience} yrs exp</span>}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">{email}</div>
                    </div>
                    <div className="flex gap-2 items-center mt-2 sm:mt-0">
                        {social.linkedIn && (
                            <a href={social.linkedIn} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-gray-100 border border-gray-200 hover:text-blue-700 text-[#616161]" title="LinkedIn">
                                <Linkedin size={12} strokeWidth={2} />
                            </a>
                        )}
                        {social.github && (
                            <a href={social.github} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-gray-100 border border-gray-200 hover:text-blue-700 text-[#616161]" title="GitHub">
                                <Github size={12} strokeWidth={2} />
                            </a>
                        )}
                        <a href={social.github} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-gray-100 border border-gray-200 hover:text-blue-700 text-[#616161] " title="GitHub">
                            <p className='text-[0.7rem] '>Resume</p>
                        </a>

                        {/* {social.twitter && (
                            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded hover:bg-gray-100 border border-gray-200" title="Twitter">
                                <Twitter size={20} strokeWidth={1.75} />
                            </a>
                        )}
                        {social.website && (
                            <a href={social.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded hover:bg-gray-100 border border-gray-200" title="Website">
                                <svg width="18" height="18" fill="currentColor" className="text-gray-500" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                            </a>
                        )} */}
                    </div>
                </div>

                {/* Bio */}
                {bio && (
                    <div className="mt-6">
                        <div className="text-gray-500 text-sm font-medium mb-1">Bio</div>
                        <div className="text-gray-800 text-sm sm:text-base leading-relaxed">{bio}</div>
                    </div>
                )}

                {/* Achievements */}
                <div className="mt-4">
                    <div className="text-gray-500 text-sm font-medium mb-1">Achievements</div>
                    {achievements.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-800 text-sm sm:text-base space-y-1">
                            {achievements.map((ach, i) => (
                                <li key={i}>{ach}</li>
                            ))}
                        </ul>
                    ) : <div className="text-gray-400 text-sm">No achievements listed</div>}
                </div>

                {/* Work Experience */}
                <div className="mt-4">
                    <div className="text-gray-500 text-sm font-medium mb-1">Work Experience</div>
                    {workExperience.length > 0 ? workExperience.map((exp, i) => (
                        <div key={exp._id || i} className="mb-2">
                            <div className="font-semibold text-gray-900 text-base">{exp.title} at {exp.company}</div>
                            <div className="text-gray-700 text-xs mb-1">{exp.startDate} - {exp.endDate || 'Present'}</div>
                            <div className="text-gray-700 text-sm">{exp.description}</div>
                        </div>
                    )) : <div className="text-gray-400 text-sm">No work experience listed</div>}
                </div>

                {/* Education */}
                <div className="mt-4">
                    <div className="text-gray-500 text-sm font-medium mb-1">Education</div>
                    <div className="font-semibold text-gray-900 text-base">{education.degree || 'N/A'}{education.major ? `, ${education.major}` : ''}</div>
                    <div className="text-gray-700 text-sm">{education.college || education.university || 'N/A'}{education.graduationYear ? ` • ${education.graduationYear}` : ''}</div>
                    {education.gpa && <div className="text-gray-700 text-xs">GPA: {education.gpa}</div>}
                </div>

                {/* Skills */}
                <div className="mt-4">
                    <div className="text-gray-500 text-sm font-medium mb-1">Skills</div>
                    {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-gray-100 border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-md">{skill}</span>
                            ))}
                        </div>
                    ) : <div className="text-gray-400 text-sm">No skills listed</div>}
                </div>

                {/* Open To Roles */}
                <div className="mt-4">
                    <div className="text-gray-500 text-sm font-medium mb-1">Open To Roles</div>
                    {openToRoles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {openToRoles.map((role, i) => (
                                <span key={i} className="bg-gray-100 border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-md">{role}</span>
                            ))}
                        </div>
                    ) : <div className="text-gray-400 text-sm">No open roles listed</div>}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 justify-end mt-8">
                    <button onClick={() => handleMessageClick()} className="border border-red-300 text-red-500 rounded px-4 py-2 text-sm font-medium hover:bg-red-50">Message</button>
                    {/* <button className="bg-[#3AA76D] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#37a169c7]">Accept</button> */}
                    {/* <button className="bg-red-500 text-white rounded px-4 py-2 text-sm font-medium hover:bg-red-600">Message</button> */}
                </div>
            </div>
        </div>
    );
}

export default ApplicantsProfile;
