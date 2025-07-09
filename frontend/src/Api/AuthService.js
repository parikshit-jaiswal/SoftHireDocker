import API from "./api";

export const signup = async (userData) => {
  try {
    const response = await API.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await API.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("OTP Verification Error:", error.response?.data || error.message);
    throw error;
  }
}

export const LoginDetails = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot Password Error:", error.response?.data || error.message);
    throw error;
  }
}

export const OTPVerification = async (email, otp) => {
  try {
    const response = await API.post("/auth/verify-reset-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("OTP Verification Error:", error.response?.data || error.message);
    throw error;
  }
}

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await API.post("/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error.response?.data || error.message);
    throw error;
  }
};


export const SubmitRecruiterInfo = async (recruiter) => {
  try {
    const response = await API.post("/auth/submit-recruiter-details", recruiter);
    return response.data;
  } catch (error) {
    console.error("Submit Recruiter Info Error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await API.post("/auth/logout", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    throw error;
  }
};

