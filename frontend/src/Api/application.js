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