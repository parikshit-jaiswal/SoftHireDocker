import API from "./api";

export const createSponsorshipApplication = async () => {
    try {
        const response = await API.post(`/sponsorship`, {
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Create Sponsorship Application Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateGettingStarted = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/getting-started`, {
            data
        });
        return response.data;
    } catch (error) {
        console.error("Update Getting Started Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getGettingStarted = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/getting-started`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching Getting Started Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateAboutYourCompany = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/about-your-company`, {
            data
        });
        return response.data;
    } catch (error) {
        console.error("Update About Your Company Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAboutYourCompany = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/about-your-company`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching About Your Company Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateCompanyStructure = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/company-structure`, {
            data
        });
        return response.data;
    } catch (error) {
        console.error("Update Company Structure Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getCompanyStructure = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/company-structure`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching Company Structure Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateActivityAndNeeds = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/activity-and-needs`, {
            data
        });
        return response.data;
    } catch (error) {
        console.error("Update Activity and Needs Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getActivityAndNeeds = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/activity-and-needs`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching Activity and Needs Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateAuthorisingOfficer = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/authorising-officer`, {
            data
        });
        return response.data;
    } catch (error) {
        console.error("Update Authorising Officer Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAuthorisingOfficer = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/authorising-officer`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching Authorising Officer Error:", error.response?.data || error.message);
        throw error;
    }
};

export const submitOrUpdateDeclarations = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/declarations`, {
            ...data
        });
        return response.data;
    } catch (error) {
        console.error("Update Declarations Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getDeclarations = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/declarations`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching Declarations Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateOrganizationSize = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/organization-size`, {
            data
        });
        return response.data;
    } catch (error) {
        console.error("Update Declarations Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getOrganizationSize = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/organization-size`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching Declarations Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateSystemAccess = async (id, data) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/system-access`, {
            data
        });
        return response.data;
    } catch (error) {
        console.error("Update System Access Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getSystemAccess = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/system-access`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching System Access Error:", error.response?.data || error.message);
        throw error;
    }
};

export const uploadSingleSupportingDocument = async (id, fieldName, name, file, data) => {
    const formData = new FormData();
    formData.append('fieldName', fieldName);
    formData.append('name', name);
    formData.append('file', file);
    formData.append('data', JSON.stringify(data));
    try {
        const response = await API.patch(
            `/sponsorship/${id}/supporting-documents/upload-one`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Update Supporting Document Error:", error.response?.data || error.message);
        throw error;
    }
};


export const getSupportingDocuments = async (id) => {
    try {
        const response = await API.get(`/sponsorship/${id}/supporting-documents`, {
        });
        return response.data;
    } catch (error) {
        console.error("Fetching Supporting Documents Error:", error.response?.data || error.message);
        throw error;
    }
};

export const submitSupportingDocument = async (id) => {
    try {
        const response = await API.patch(`/sponsorship/${id}/submit-supporting-document`, {
        });
        return response.data;
    } catch (error) {
        console.error("Update Supporting Document Error:", error.response?.data || error.message);
        throw error;
    }
};