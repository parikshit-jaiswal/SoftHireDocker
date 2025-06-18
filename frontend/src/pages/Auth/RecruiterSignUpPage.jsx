import React, { useState } from "react";
import { signup } from "@/Api/AuthService";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const RecruiterSignUpPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "recruiter", // Default role fixed as recruiter
        organizationName: "",
        website: "",
        industry: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const requestBody = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: "recruiter",
            organizationName: formData.organizationName.trim(),
            website: formData.website.trim(),
            industry: formData.industry.trim(),
        };

        try {
            const data = await signup(requestBody);
            localStorage.setItem("email", formData.email.trim());
            setMessage("Signup successful! 🎉");
            navigate("/otp");
        } catch (error) {
            setMessage(
                `Error: ${error.response?.data?.message || "Something went wrong"}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side Illustration */}
            <div className="w-1/2 bg-colors-customBlue flex justify-center items-center">
                <img src="/Auth/signup.png" alt="Illustration" className="w-3/4" />
            </div>

            {/* Signup Form */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center pt-10 pb-10">
                <div className="w-4/5 max-w-md">
                    <h1 className="md:text-4xl text-3xl font-bold mb-8 text-center">
                        Get Started Now
                    </h1>

                    {message && (
                        <p
                            className={`text-center text-lg mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-600"
                                }`}
                        >
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block text-xl font-bold">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-xl font-bold">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4 relative">
                            <label
                                htmlFor="password"
                                className="block text-xl font-bold mb-1"
                            >
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg"
                                required
                            />
                            <div
                                className="absolute top-[52%] right-4 transform -translate-y-1/2 cursor-pointer text-gray-600 text-lg mt-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* Recruiter Extra Fields */}
                        <div className="mb-4">
                            <label className="block text-xl font-bold">
                                Organization
                            </label>
                            <input
                                type="text"
                                name="organizationName"
                                placeholder="Enter organization name"
                                value={formData.organizationName}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xl font-bold">Website</label>
                            <input
                                type="text"
                                name="website"
                                placeholder="Enter website URL"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xl font-bold">Industry</label>
                            <input
                                type="text"
                                name="industry"
                                placeholder="Enter industry type"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-red-400 hover:bg-red-500 text-white py-3 rounded-md font-medium flex justify-center"
                            disabled={loading}
                        >
                            {loading ? <span className="loader"></span> : "Submit"}
                        </button>
                    </form>

                    <div className="text-center mt-4 text-gray-500 mb-4">or</div>


                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const { credential } = credentialResponse;
                                const res = await axios.post(
                                    `${import.meta.env.VITE_SERVER_URL}/api/auth/google-login`,
                                    { token: credential, role: "recruiter" },
                                    { withCredentials: true }
                                );

                                const { token, message, user } = res.data;

                                localStorage.setItem("token", token);
                                localStorage.setItem("userId", user._id);
                                setMessage(message);
                                if (user.organizationName) {
                                    navigate("/recruiter");
                                } else {
                                    navigate("/recruiter/info");
                                }
                            } catch (err) {
                                console.error("Google login error", err);
                                setMessage("Google sign-up failed ❌");
                            }
                        }}
                        onError={() => {
                            // console.log("Google Login Failed");
                            setMessage("Google sign-up failed ❌");
                        }}
                    />


                    <div className="text-center mt-6">
                        Have an account?{" "}
                        <a href="/login" className="text-blue-600 font-medium">
                            Sign In
                        </a>
                    </div>

                    {/* New candidate login option */}
                    <div className="text-center mt-4">
                        Are you a candidate?{" "}
                        <a href="/signup" className="text-blue-600 font-medium">
                            Sign In here
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterSignUpPage;
