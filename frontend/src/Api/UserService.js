import axios from 'axios';

// Use the same approach as api.js - import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const userAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/user`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Create separate API instance for resume operations
const resumeAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/resume`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token for userAPI
userAPI.interceptors.request.use(
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

// ✅ Request interceptor for resumeAPI
resumeAPI.interceptors.request.use(
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
userAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Response interceptor for resumeAPI
resumeAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User Service Object
const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await userAPI.get('/profile');
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

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const { skills, experience } = profileData;
      
      if (skills && skills.some(skill => skill.length > 50)) {
        return {
          success: false,
          message: 'Each skill must be 50 characters or less',
        };
      }

      if (experience && (experience < 0 || experience > 50)) {
        return {
          success: false,
          message: 'Experience must be between 0 and 50 years',
        };
      }

      const response = await userAPI.put('/profile', profileData);
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

  // ✅ Upload resume using resumeAPI
  uploadResume: async (file) => {
    try {
      if (!file) {
        return {
          success: false,
          message: 'No file selected',
        };
      }

      if (file.type !== 'application/pdf') {
        return {
          success: false,
          message: 'Please upload a PDF file only',
        };
      }

      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          message: 'File size should be less than 5MB',
        };
      }

      const formData = new FormData();
      formData.append('resume', file);

      console.log('📤 Uploading resume to /api/resume');

      const response = await resumeAPI.patch('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Resume upload response:', response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Resume uploaded successfully',
      };
    } catch (error) {
      console.error('💥 Resume upload error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload resume',
        error: error.response?.data || error.message,
      };
    }
  },

  // ✅ Get resume using resumeAPI
  getResume: async () => {
    try {
      const response = await resumeAPI.get('/');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Resume fetch error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch resume',
        error: error.response?.data || error.message,
      };
    }
  },

  // ✅ Delete resume using resumeAPI
  deleteResume: async () => {
    try {
      const response = await resumeAPI.delete('/');
      return {
        success: true,
        message: response.data.message || 'Resume deleted successfully',
      };
    } catch (error) {
      console.error('Resume delete error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete resume',
        error: error.response?.data || error.message,
      };
    }
  },

  // ✅ Validate file method
  validateFile: (file, allowedTypes = ['application/pdf'], maxSize = 5 * 1024 * 1024) => {
    if (!file) {
      return { isValid: false, message: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: 'Please upload a PDF file only' };
    }

    if (file.size > maxSize) {
      return { isValid: false, message: 'File size should be less than 5MB' };
    }

    return { isValid: true, message: 'File is valid' };
  },

  // Get applied jobs - Fixed to handle correct response structure
  getAppliedJobs: async () => {
    try {
      const response = await userAPI.get('/applied-jobs');
      return {
        success: true,
        data: response.data.data || response.data, // Handle nested data structure
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch applied jobs',
        error: error.response?.data || error.message,
      };
    }
  },

  // Apply for a job
  applyForJob: async (jobId, applicationData) => {
    try {
      const { resume, coverLetter } = applicationData;

      if (!resume) {
        return {
          success: false,
          message: 'Resume is required to apply for a job',
        };
      }

      const response = await userAPI.post(`/apply/${jobId}`, {
        resume,
        coverLetter,
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Application submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit application',
        error: error.response?.data || error.message,
      };
    }
  },

  // Get scheduled interviews
  getInterviews: async () => {
    try {
      const response = await userAPI.get('/interviews');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch interviews',
        error: error.response?.data || error.message,
      };
    }
  },

  // Get visa applications
  getVisaApplications: async () => {
    try {
      const response = await userAPI.get('/visa-applications');
      return {
        success: true,
        data: response.data.visaApplications || response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch visa applications',
        error: error.response?.data || error.message,
      };
    }
  },

  // Enhanced helper function to format application data - Updated for new API structure
  formatApplicationData: (applications) => {
    if (!Array.isArray(applications)) return [];
    
    return applications.map(app => {
      // Handle the job object structure
      const job = app.job || {};
      
      // Format salary based on new structure
      let salaryDisplay = 'Not disclosed';
      if (job.salary) {
        if (typeof job.salary === 'object' && job.salary.min && job.salary.max) {
          // New format: { min: 50000, max: 70000 }
          salaryDisplay = `${job.currency || 'USD'} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`;
        } else if (typeof job.salary === 'number') {
          // Old format: just a number
          salaryDisplay = `${job.currency || 'USD'} ${job.salary.toLocaleString()}`;
        }
      }

      // Format collaboration hours based on new structure
      let collaborationHours = 'Not specified';
      if (job.collaborationHours) {
        if (typeof job.collaborationHours === 'object' && job.collaborationHours.start && job.collaborationHours.end) {
          // New format: { start: "10:00", end: "18:00", timeZone: "Europe/London" }
          collaborationHours = `${job.collaborationHours.start} - ${job.collaborationHours.end}`;
          if (job.collaborationHours.timeZone) {
            collaborationHours += ` (${job.collaborationHours.timeZone})`;
          }
        } else if (typeof job.collaborationHours === 'string') {
          // Old format: string
          collaborationHours = job.collaborationHours;
        }
      }
      
      return {
        id: app._id,
        jobId: job._id,
        jobTitle: job.title || 'Unknown Position',
        company: job.companyName || 'Unknown Company',
        location: Array.isArray(job.location) ? job.location.join(', ') : (job.location || 'Not specified'),
        jobType: job.jobType || 'Not specified',
        salary: salaryDisplay,
        remotePolicy: job.remotePolicy || 'Not specified',
        status: app.status || 'Pending',
        appliedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Unknown',
        statusUpdatedAt: app.statusUpdatedAt ? new Date(app.statusUpdatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Unknown',
        lastUpdated: app.updatedAt ? new Date(app.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Unknown',
        
        // Application specific details
        coverLetter: app.coverLetter,
        resume: app.resume,
        
        // Job details for expanded view
        jobDescription: job.jobSummary || job.description || 'No description available',
        skills: job.skills || [],
        responsibilities: job.responsibilities || [],
        qualifications: job.qualifications || [],
        tools: job.tools || [],
        visaSponsorship: job.visaSponsorship || false,
        relocationRequired: job.relocationRequired || false,
        relocationAssistance: job.relocationAssistance || false,
        collaborationHours: collaborationHours,
        
        // Contact person details
        contactPerson: job.contactPerson || null,
        
        // Company details
        companyOverview: job.companyOverview,
        organization: job.organization,
        
        // Additional metadata
        postedAt: job.postedAt ? new Date(job.postedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : null,
        isActive: job.active !== false,
        hiresIn: job.hiresIn || [],
      };
    });
  },

  // Helper function to format interview data
  formatInterviewData: (interviews) => {
    if (!Array.isArray(interviews)) return [];
    
    return interviews.map(interview => ({
      id: interview._id,
      jobId: interview.job?._id,
      jobTitle: interview.job?.title || 'Unknown Position',
      recruiterName: interview.recruiter?.fullName || 'Unknown Recruiter',
      date: interview.date ? new Date(interview.date).toLocaleDateString() : 'TBD',
      time: interview.time || 'TBD',
      type: interview.type || 'Unknown',
      status: interview.status || 'Scheduled',
      meetingLink: interview.meetingLink,
    }));
  },

  // Helper function to format visa application data
  formatVisaData: (visaApplications) => {
    if (!Array.isArray(visaApplications)) return [];
    
    return visaApplications.map(visa => ({
      id: visa._id,
      type: visa.type || 'Unknown',
      status: visa.status || 'Pending',
      submittedDate: visa.createdAt ? new Date(visa.createdAt).toLocaleDateString() : 'Unknown',
      recruiterName: visa.recruiter?.fullName || 'Unknown Recruiter',
      documents: visa.documents || [],
    }));
  },
};

export default userService;