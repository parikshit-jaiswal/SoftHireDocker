import React, { useState, useEffect } from 'react';
import { User, Building2, Globe, Edit3, Save, X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { getRecruiterProfile, updateRecruiterProfile } from '@/Api/RecruiterServices';

function RecruiterProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [editData, setEditData] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });

    const industries = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 
        'Retail', 'Construction', 'Transportation', 'Entertainment', 'Consulting',
        'Real Estate', 'Energy', 'Government', 'Non-profit', 'Other'
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getRecruiterProfile();
            setProfile(response.recruiter);
            setEditData({
                companyName: response.recruiter.companyName || '',
                website: response.recruiter.website || '',
                industry: response.recruiter.organization?.industry || ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile data' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setMessage({ type: '', text: '' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            companyName: profile.companyName || '',
            website: profile.website || '',
            industry: profile.organization?.industry || ''
        });
        setMessage({ type: '', text: '' });
    };

    const handleSave = async () => {
        try {
            setUpdating(true);
            const response = await updateRecruiterProfile(editData);
            setProfile(response.recruiter);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.error || 'Failed to update profile' 
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#EA4C25] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600">Unable to load your recruiter profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Profile</h1>
                    <p className="text-gray-600">Manage your professional information and company details</p>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        message.type === 'success' 
                            ? 'bg-green-100 border border-green-200 text-green-800' 
                            : 'bg-red-100 border border-red-200 text-red-800'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Profile Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                                    {profile.user?.avatar ? (
                                        <img 
                                            src={profile.user.avatar} 
                                            alt={profile.user.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    {profile.user?.fullName}
                                </h2>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600 text-sm">{profile.user?.email}</span>
                                </div>
                                {profile.user?.isVerified && (
                                    <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Verified Account</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#EA4C25] hover:bg-[#d63e1e] text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={updating}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#EA4C25] hover:bg-[#d63e1e] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            {updating ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {updating ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Building2 className="w-4 h-4 inline mr-2" />
                                        Company Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA4C25] focus:border-[#EA4C25] outline-none transition-colors"
                                            placeholder="Enter company name"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                            {profile.companyName || 'Not specified'}
                                        </p>
                                    )}
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Globe className="w-4 h-4 inline mr-2" />
                                        Company Website
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={editData.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA4C25] focus:border-[#EA4C25] outline-none transition-colors"
                                            placeholder="https://example.com"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                            {profile.website ? (
                                                <a 
                                                    href={profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#EA4C25] hover:text-[#d63e1e] hover:underline"
                                                >
                                                    {profile.website}
                                                </a>
                                            ) : (
                                                <span className="text-gray-900">Not specified</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Industry */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Building2 className="w-4 h-4 inline mr-2" />
                                        Industry
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editData.industry}
                                            onChange={(e) => handleInputChange('industry', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA4C25] focus:border-[#EA4C25] outline-none transition-colors"
                                        >
                                            <option value="">Select industry</option>
                                            {industries.map(industry => (
                                                <option key={industry} value={industry}>{industry}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                            {profile.organization?.industry || 'Not specified'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Organization Status */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Organization Status</h4>
                                        <p className="text-sm text-gray-500">Current verification status of your organization</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        profile.organization?.status === 'verified' 
                                            ? 'bg-green-100 text-green-800'
                                            : profile.organization?.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {profile.organization?.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                        <span className="font-medium">Profile Created:</span>
                                        <br />
                                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span>
                                        <br />
                                        {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecruiterProfile;