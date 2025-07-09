import API from "./api";

export const createApplication = async (formData) => {
    try {
        const response = await API.post("/application/apply", formData);
        return response.data;
    } catch (error) {
        console.error("Application Error:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ UPDATED: Better error handling for application status check
export const checkApplicationStatus = async (jobId) => {
    try {
        console.log(`🔍 Checking application status for job: ${jobId}`);
        const response = await API.get(`/application/check/${jobId}`);
        
        console.log('✅ Application status response:', response.data);
        
        return {
            success: true,
            isApplied: response.data.isApplied,
            application: response.data.application
        };
    } catch (error) {
        console.error("❌ Check Application Error:", error);
        
        // Handle different types of errors
        if (error.response) {
            // Server responded with error status
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
            
            return {
                success: false,
                isApplied: false,
                error: error.response.data?.message || `HTTP ${error.response.status}`,
                statusCode: error.response.status
            };
        } else if (error.request) {
            // Request was made but no response received
            console.error("No response received:", error.request);
            return {
                success: false,
                isApplied: false,
                error: "Network error - no response from server"
            };
        } else {
            // Something else happened
            console.error("Request setup error:", error.message);
            return {
                success: false,
                isApplied: false,
                error: error.message
            };
        }
    }
};

// ✅ NEW: Test function to check if API is working
export const testApplicationAPI = async () => {
    try {
        const response = await API.get("/application/test");
        return response.data;
    } catch (error) {
        console.error("Test API Error:", error);
        throw error;
    }
};