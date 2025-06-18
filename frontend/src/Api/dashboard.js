import API from "./api";

const getAllJobs = async () => {
  try {
    const response = await API.get("/jobs/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error.response?.data || error.message);
    throw error;
  }
}

export { getAllJobs };