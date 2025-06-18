import React, { useState, useEffect } from "react";
import { verifyOtp } from "@/Api/AuthService";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ otp: "" });
  const [email, setEmail] = useState(""); // Store email separately
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get email from localStorage or props (if passed)
  useEffect(() => {
    const storedEmail = localStorage.getItem("email"); 
    if (storedEmail) setEmail(storedEmail);
  }, []);

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
    setMessage("");

    try {
      const response = await verifyOtp(email, formData.otp);
      setMessage("OTP Verified Successfully ✅");
      // console.log("OTP Verification Success:", response);
      navigate("/login");
    } catch (error) {
      setMessage(error || "Invalid OTP ❌");
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
            Please Enter the OTP sent to <strong>{email}</strong>
          </p>

          {message && (
            <p className={`text-center text-lg mb-4 ${message.includes("❌") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}

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
              className="w-full bg-red-400 hover:bg-red-500 text-white py-3 rounded-md font-medium flex justify-center"
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Otp;
