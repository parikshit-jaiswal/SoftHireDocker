import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LoginDetails } from "@/Api/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { setAuthUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {

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

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
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

        try {
            const response = await LoginDetails(formData.email, formData.password);
            localStorage.setItem("token", response.token);
            setMessage("Login Successful ✅");
            navigate("/dashboard");
        } catch (error) {
            setMessage("Invalid Email or Password ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left Illustration */}
            <div className="md:w-1/2 w-full bg-colors-customBlue flex justify-center items-center p-4">
                <img src="/Group1.png" alt="Illustration" className="w-3/4" />
            </div>

            {/* Right Login Form */}
            <div className="md:w-1/2 w-full bg-gray-200 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                        Welcome Back!
                    </h1>

                    {message && (
                        <p
                            className={`text-center text-lg mb-4 ${message.includes("❌") ? "text-red-500" : "text-green-500"
                                }`}
                        >
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-xl font-bold mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-6 relative">
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
                                className="absolute top-[52%] right-4 transform -translate-y-1/2 cursor-pointer text-gray-600 text-lg"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>

                            <div className="text-right mt-1">
                                <button
                                    type="button"
                                    className="text-blue-900 text-sm font-medium"
                                    onClick={() => navigate("/forgot")}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-400 hover:bg-red-500 text-white py-3 rounded-md font-medium"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Submit"}
                        </button>

                        <div className="text-center my-4  text-gray-500">or</div>

                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const { credential } = credentialResponse;
                                    const res = await axios.post(
                                        `${import.meta.env.VITE_SERVER_URL}/api/auth/google-login`,
                                        { token: credential },
                                        { withCredentials: true }
                                    );

                                    const { token, user } = res.data;

                                    dispatch(setAuthUser(user));
                                    // console.log(token);
                                    localStorage.setItem("token", token);
                                    if (user?.role === "recruiter") {
                                        return navigate("/recruiter");
                                    } else {
                                        return navigate("/dashboard");
                                    }
                                } catch (err) {
                                    setMessage("Google sign-up failed ❌");
                                }
                            }}
                            onError={() => {
                                setMessage("Google sign-up failed ❌");
                            }}
                        />

                        <div className="text-center mt-6">
                            Don't have an account?{" "}
                            <a href="/signup" className="text-blue-600 font-medium">
                                Sign Up
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
