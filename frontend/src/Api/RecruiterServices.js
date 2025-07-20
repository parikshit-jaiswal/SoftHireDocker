import API from "./api";

export const getStats = async () => {
    try {
        const response = await API.get(`/org/stats`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Get Stats Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getRecruiterProfile = async () => {
    try {
        const response = await API.get(`/recruiter/profile`, {
            withCredentials: true
        });
        console.log("Recruiter Profile Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get Recruiter Profile Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateRecruiterProfile = async (data) => {
    try {
        const response = await API.patch(`/recruiter/profile`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Update Recruiter Profile Error:", error.response?.data || error.message);
        throw error;
    }
};