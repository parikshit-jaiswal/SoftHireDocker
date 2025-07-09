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