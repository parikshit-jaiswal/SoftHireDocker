import API from "./api";

export const getApplicants = async (id, status) => {
    try {
        const query = status ? `?status=${encodeURIComponent(status)}` : '';
        const response = await API.get(`/applications/job/${id}${query}`, {
            withCredentials: true
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Get Applicants Error:", error.response?.data || error.message);
        throw error;
    }
};


export const updateStatus = async (id, status) => {
    try {
        const response = await API.patch(`/applications/${id}/status`, {
            status
        }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Update Status Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getApplicantProfile = async (id) => {
    try {
        const response = await API.get(`/profile/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Get Applicant Profile Error:", error.response?.data || error.message);
        throw error;
    }
};

export const searchApplicants = async (filters, page = 1, limit = 10) => {
    try {
        const response = await API.get('/profile/search-applicants', {
            params: { ...filters, page, limit },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Search Applicants Error:", error.response?.data || error.message);
        throw error;
    }
};


