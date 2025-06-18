import React, { useState, useEffect } from "react";
import { OTPVerification } from "@/Api/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetOTP = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ otp: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Get email from localStorage
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
    setLoading(true);
    try {
      await OTPVerification(email, formData.otp);
      toast.success("OTP verified successfully!");
      navigate("/reset");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
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
            Get Started Now
          </h1>
          <p className="text-center text-md text-black mb-8">
            Please enter the OTP sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label htmlFor="otp" className="block text-xl font-bold mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Your OTP"
                value={formData.otp}
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
              {loading ? "Verifying..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetOTP;
