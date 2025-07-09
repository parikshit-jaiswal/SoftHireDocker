import React, { useState } from "react";
import { signup } from "@/Api/AuthService";
import { Navigate, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";

const CandidateSignUpPage = () => {

    const { user } = useSelector((state) => state.auth);
    const isRecruiter = user?.role === 'recruiter';
    const isUser = user?.role === 'candidate';

    // if (isUser) {
    //     // TODO
    //     return <Navigate to="/dashboard" replace />;
    // }
    if (isRecruiter) {
        return <Navigate to="/recruiter" replace />;
    }

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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

        const requestBody = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: "candidate",
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
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Image */}
            <div className="md:w-1/2 w-full bg-colors-customBlue flex justify-center items-center p-6">
                <img src="/Auth/signup.png" alt="Signup" className="w-3/4 max-w-md" />
            </div>

            {/* Signup Form */}
            <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                        Get Started Now
                    </h1>

                    {message && (
                        <p className={`text-center text-lg mb-4 ${message.includes("❌") ? "text-red-500" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block text-xl font-bold mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-xl font-bold mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4 relative">
                            <label className="block text-xl font-bold mb-1">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full p-3 pr-10 border rounded-lg"
                                required
                            />
                            <div
                                className="absolute top-[52%] right-4 transform -translate-y-1/2 cursor-pointer text-gray-600 text-lg mt-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-red-400 hover:bg-red-500 text-white py-3 rounded-md font-medium"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Submit"}
                        </button>
                    </form>

                    <div className="text-center mt-4 mb-4 text-gray-500">or</div>

                    {/* Google Signup Button */}

                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const res = await axios.post(
                                    `${import.meta.env.VITE_SERVER_URL}/api/auth/google-login`,
                                    { token: credentialResponse.credential, role: "candidate" },
                                    { withCredentials: true } // This is the ID token
                                );

                                const { message, user } = res.data;
                                // localStorage.setItem("token", user._id); // or token, depending on backend
                                if (user?.role === "candidate") {
                                    navigate("/dashboard");
                                } else {
                                    navigate("/recruiter");
                                }
                            } catch (err) {
                                console.error("Google sign-up failed ❌", err);
                                setMessage("Google sign-up failed ❌");
                            }
                        }}
                        onError={() => {
                            setMessage("Google sign-up failed ❌");
                        }}
                    />



                    <div className="text-center mt-6 space-y-2">
                        <div>
                            Have an account?{" "}
                            <a href="/login" className="text-blue-600 font-medium">
                                Sign In
                            </a>
                        </div>
                        {/* <div>
                            Are you a recruiter?{" "}
                            <a href="/recruiter/signup" className="text-blue-600 font-medium">
                                Sign up here
                            </a>
                        </div> */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CandidateSignUpPage;
