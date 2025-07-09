import axios from 'axios';

// Use the same approach as other services
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const jobPreferencesAPI = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
jobPreferencesAPI.interceptors.request.use(
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
jobPreferencesAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const jobPreferencesService = {
  // Get current user's job preferences
  getJobPreferences: async () => {
    try {
      const response = await jobPreferencesAPI.get('/job-preferences');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job preferences',
        error: error.response?.data || error.message,
      };
    }
  },

  // Save or create job preferences
  saveJobPreferences: async (preferencesData) => {
    try {
      const response = await jobPreferencesAPI.post('/job-preferences', preferencesData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save job preferences',
        error: error.response?.data || error.message,
      };
    }
  },

  // Update job preferences
  updateJobPreferences: async (preferencesData) => {
    try {
      const response = await jobPreferencesAPI.put('/job-preferences', preferencesData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update job preferences',
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete job preferences
  deleteJobPreferences: async () => {
    try {
      const response = await jobPreferencesAPI.delete('/job-preferences');
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete job preferences',
        error: error.response?.data || error.message,
      };
    }
  },

  // Helper function to format preferences data for display
  formatPreferencesForDisplay: (preferences) => {
    if (!preferences) return null;

    // Map backend values to frontend display format
    const openToMap = {
      "Full-time Employee": "fullTime",
      "Contractor": "contractor",
      "Co-founder": "cofounder",
      "Freelancer": "freelancer",
      "Internship": "internship",
      "Part-time": "partTime",
      "Consultant": "consultant",
    };

    // Convert openTo array back to object format
    const openToObject = {
      fullTime: false,
      contractor: false,
      cofounder: false,
      freelancer: false,
      internship: false,
      partTime: false,
      consultant: false,
    };

    if (preferences.openTo && Array.isArray(preferences.openTo)) {
      preferences.openTo.forEach(item => {
        const key = openToMap[item];
        if (key) {
          openToObject[key] = true;
        }
      });
    }

    // Convert company size preferences back to object format
    const companySizePreferencesObject = {
      Seed: "Ideal",
      Early: "Ideal",
      "Mid-size": "Ideal",
      Large: "Ideal",
      "Very Large": "Ideal",
      Massive: "Ideal",
      Startup: "Ideal",
      "Public Company": "Ideal",
    };

    if (preferences.companySizePreferences && Array.isArray(preferences.companySizePreferences)) {
      preferences.companySizePreferences.forEach(item => {
        if (item.size) {
          if (item.ideal) {
            companySizePreferencesObject[item.size] = "Ideal";
          } else if (item.interested) {
            companySizePreferencesObject[item.size] = "Yes";
          } else {
            companySizePreferencesObject[item.size] = "No";
          }
        }
      });
    }

    return {
      needsSponsorship: preferences.needsSponsorship ? "Yes" : "No",
      authorizedToWork: preferences.authorizedToWork ? "Yes" : "No",
      jobType: preferences.jobType || "",
      openTo: openToObject,
      workLocation: preferences.workLocation || "",
      openToRemote: preferences.openToRemote || false,
      remotePreference: preferences.remotePreference || "",
      salaryCurrency: preferences.salaryCurrency || "USD",
      desiredSalary: preferences.desiredSalary ? preferences.desiredSalary.toString() : "",
      companySizePreferences: companySizePreferencesObject,
    };
  },

  // Helper function to transform form data for API submission
  transformFormDataForAPI: (formData) => {
    // Map job types with correct values for backend
    const openToMap = {
      fullTime: "Full-time Employee",
      contractor: "Contractor",
      cofounder: "Co-founder",
      freelancer: "Freelancer",
      internship: "Internship",
      partTime: "Part-time",
      consultant: "Consultant",
    };

    // Format remote preference
    let formattedRemotePreference = formData.remotePreference;
    if (formData.remotePreference === "Remote only") {
      formattedRemotePreference = "Remote Only";
    }

    return {
      needsSponsorship: formData.needsSponsorship === "Yes",
      authorizedToWork: formData.authorizedToWork === "Yes",
      jobType: formData.jobType,
      openTo: Object.keys(formData.openTo)
        .filter((key) => formData.openTo[key])
        .map((type) => openToMap[type] || type),
      workLocation: formData.workLocation,
      openToRemote: formData.openToRemote,
      remotePreference: formData.openToRemote ? formattedRemotePreference : undefined,
      desiredSalary: formData.desiredSalary ? Number(formData.desiredSalary) : undefined,
      salaryCurrency: formData.salaryCurrency || "USD",
      companySizePreferences: Object.entries(formData.companySizePreferences).map(
        ([size, preference]) => ({
          size: size,
          ideal: preference === "Ideal",
          interested: preference === "Ideal" || preference === "Yes",
        })
      ),
    };
  },
};

export default jobPreferencesService;