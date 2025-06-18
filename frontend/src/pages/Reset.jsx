import React, { useState, useEffect } from "react";
import { resetPassword } from "@/Api/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Reset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
    else {
      toast.error("Email not found. Please try again.");
      navigate("/forgot");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, formData.password);
      toast.success("Password reset successful! Please login.");
      localStorage.removeItem("email"); // cleanup
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-colors-customBlue flex justify-center items-center">
        <img src="/Group1.png" alt="Illustration" className="w-3/4" />
      </div>

      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <div className="w-4/5 max-w-md">
          <h1 className="md:text-4xl text-3xl font-bold mb-3 text-center">
            Reset Password
          </h1>
          <p className="text-center text-md text-black mb-8">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-xl font-bold mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Your New Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="confirmPassword" className="block text-xl font-bold mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full ${
                loading ? "bg-red-300 cursor-not-allowed" : "bg-red-400 hover:bg-red-500"
              } text-white py-3 rounded-md font-medium`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
