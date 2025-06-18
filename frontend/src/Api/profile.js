import API from "./api";

const editProfile = async (formData) => {
  try {
    const response = await API.post("/profile", formData);
    return response.data;
  } catch (error) {
    console.error("Edit Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

const resumeUpload = async (formData) => {
  try {
    const response = await API.post("/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // if your API requires cookies/session
    });
    return response.data;
  } catch (error) {
    console.error(
      "Resume Upload Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const profileImageUpload = async (formData) => {
  try {
    const response = await API.post("/profile/upload-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // if your API requires cookies/session
    });
    return response.data;
  } catch (error) {
    console.error(
      "Resume Upload Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const jobCulture = async (formData) => {
  try {
    const response = await API.post("/job-expectations", formData);
    return response.data;
  } catch (error) {
    console.error("Culture Error:", error.response?.data || error.message);
    throw error;
  }
};

const jobPreferences = async (formData) => {
  try {
    const response = await API.post("/job-preferences", formData);
    return response.data;
  } catch (error) {
    console.error(
      "Job Preferences Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getProfile = async () => {
  try {
    const response = await API.get("");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching jobs:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export {
  resumeUpload,
  jobPreferences,
  editProfile,
  profileImageUpload,
  jobCulture,
  getProfile,
};
