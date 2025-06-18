import API from "./api";

// Candidate Signup
export const createJob = async (jobData) => {
    try {
        const response = await API.post('/org/jobs', jobData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Create Job Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateJob = async (jobData, _id) => {
    try {
        const response = await API.put(`/org/jobs/${_id}`, jobData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Update Job Error:", error.response?.data || error.message);
        throw error;
    }
};
export const deleteJob = async (id) => {
    try {
        const response = await API.delete(`/org/jobs/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Delete Job Error:", error.response?.data || error.message);
        throw error;
    }
};


export const getJobs = async () => {
    try {
        const response = await API.get(`/org/all`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Get Jobs Error:", error.response?.data || error.message);
        throw error;
    }
};
