import axios from 'axios';

// Use the same approach as api.js
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const profileAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/profile`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
profileAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
profileAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const profileService = {
  // Get current user's profile (no ID needed)
  getCurrentUserProfile: async () => {
    try {
      const response = await profileAPI.get('/me');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch current user profile',
        error: error.response?.data || error.message,
      };
    }
  },

  // Update current user's profile (no ID needed)
  updateCurrentUserProfile: async (profileData) => {
    try {
      const response = await profileAPI.patch('/me', profileData);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        error: error.response?.data || error.message,
      };
    }
  },

  // Get profile by user ID
  getProfile: async (userId) => {
    try {
      const response = await profileAPI.get(`/${userId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile',
        error: error.response?.data || error.message,
      };
    }
  },

  // Create profile
  createProfile: async (profileData) => {
    try {
      const response = await profileAPI.post('/', profileData);
      return {
        success: true,
        data: response.data,
        message: 'Profile created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create profile',
        error: error.response?.data || error.message,
      };
    }
  },

  // Update profile by ID
  updateProfile: async (profileId, profileData) => {
    try {
      const response = await profileAPI.patch(`/${profileId}`, profileData);
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        error: error.response?.data || error.message,
      };
    }
  },

  // Upload profile image
  uploadProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profilePhoto', imageFile);

      const response = await profileAPI.post('/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Profile image uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload image',
        error: error.response?.data || error.message,
      };
    }
  },

  // Get profile image
  getProfileImage: async () => {
    try {
      const response = await profileAPI.get('/profile-image');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile image',
        error: error.response?.data || error.message,
      };
    }
  },

  // Search applicants
  searchApplicants: async (searchParams) => {
    try {
      const response = await profileAPI.get('/search-applicants', {
        params: searchParams,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search applicants',
        error: error.response?.data || error.message,
      };
    }
  },

  // Helper function to format profile data
  formatProfileData: (profile) => {
    if (!profile) return null;

    return {
      id: profile._id,
      name: profile.name || profile.user?.fullName || 'Unknown',
      email: profile.user?.email || 'No email',
      location: profile.location || 'Location not specified',
      primaryRole: profile.primaryRole || 'Role not specified',
      yearsOfExperience: profile.yearsOfExperience || 'Experience not specified',
      openToRoles: profile.openToRoles || [],
      bio: profile.bio || 'No bio available',
      socialProfiles: profile.socialProfiles || {},
      workExperience: profile.workExperience || [],
      education: profile.education || {},
      skills: profile.skills || [],
      achievements: profile.achievements || 'No achievements listed',
      identity: profile.identity || {},
      profileImage: profile.profileImage || null,
      user: profile.user || {},
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  },

  // Helper function to format work experience
  formatWorkExperience: (workExperience) => {
    if (!Array.isArray(workExperience)) return [];

    return workExperience.map(exp => ({
      company: exp.company || 'Unknown Company',
      title: exp.title || 'Unknown Position',
      startDate: exp.startDate || 'Unknown',
      endDate: exp.current ? 'Present' : (exp.endDate || 'Unknown'),
      description: exp.description || 'No description available',
      current: exp.current || false,
    }));
  },

  // Helper function to format education
  formatEducation: (education) => {
    if (!education) return null;

    return {
      college: education.college || 'Unknown Institution',
      degree: education.degree || 'Unknown Degree',
      major: education.major || 'Unknown Major',
      graduationYear: education.graduationYear || 'Unknown Year',
      gpa: education.gpa || null,
    };
  },
};

export default profileService;