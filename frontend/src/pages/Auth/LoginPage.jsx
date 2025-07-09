import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
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
    const location = useLocation();
    
    // ✅ ADD: Get role from URL parameters
    const [userRole, setUserRole] = useState("candidate"); // Default to candidate
    
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ ADD: Extract role from URL parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const roleParam = searchParams.get('role');
        
        if (roleParam === 'recruiter') {
            setUserRole('recruiter');
        } else if (roleParam === 'candidate') {
            setUserRole('candidate');
        }
        // If no role param, default to candidate
    }, [location.search]);

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
            
            // ✅ ADD: Validate role matches
            if (response.user.role !== userRole) {
                setMessage(`❌ This account is registered as ${response.user.role}, but you're trying to login as ${userRole}`);
                setLoading(false);
                return;
            }
            
            setMessage("Login Successful ✅");
            if (response.user.role === "recruiter") {
                dispatch(setAuthUser(response.user));
                return navigate("/recruiter");
            }
            if (response.user.role === "candidate") {
                dispatch(setAuthUser(response.user));
                return navigate("/dashboard");
            }
        } catch (error) {
            setMessage("Invalid Email or Password ❌");
        } finally {
            setLoading(false);
        }
    };

    // ✅ ADD: Get role-specific configuration
    const getRoleConfig = () => {
        if (userRole === 'recruiter') {
            return {
                title: "Login as Recruiter",
                subtitle: "Access your recruitment dashboard to find top talent",
                buttonText: "Login as Recruiter",
                signupText: "Sign up as Recruiter",
                signupLink: "/signup?role=recruiter",
                switchText: "Looking for jobs? Login as Candidate",
                switchLink: "/login?role=candidate",
                roleColor: "text-blue-600",
                // roleIcon: "🏢",
                buttonColor: "bg-blue-500 hover:bg-blue-600"
            };
        } else {
            return {
                title: "Login as Candidate",
                subtitle: "Find your dream job and advance your career",
                buttonText: "Login as Candidate",
                signupText: "Sign up as Candidate",
                signupLink: "/signup?role=candidate",
                switchText: "Looking to hire? Login as Recruiter",
                switchLink: "/login?role=recruiter",
                roleColor: "text-green-600",
                // roleIcon: "👤",
                buttonColor: "bg-red-400 hover:bg-red-500"
            };
        }
    };

    const roleConfig = getRoleConfig();

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left Illustration */}
            <div className="md:w-1/2 w-full bg-colors-customBlue flex justify-center items-center p-4">
                <img src="/Group1.png" alt="Illustration" className="w-3/4" />
            </div>

            {/* Right Login Form */}
            <div className="md:w-1/2 w-full bg-gray-200 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                        Welcome Back!
                    </h1>

                    {/* ✅ ADD: Role-specific header */}
                    <div className="text-center mb-6">
                        <div className={`text-lg font-semibold ${roleConfig.roleColor} flex items-center justify-center gap-2`}>
                            <span className="text-xl">{roleConfig.roleIcon}</span>
                            {roleConfig.title}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{roleConfig.subtitle}</p>
                    </div>

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

                        {/* ✅ UPDATED: Role-specific button */}
                        <button
                            type="submit"
                            className={`w-full py-3 rounded-md font-medium text-white transition-colors ${roleConfig.buttonColor}`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : roleConfig.buttonText}
                        </button>

                        <div className="text-center my-4 text-gray-500">or</div>

                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const { credential } = credentialResponse;
                                    const res = await axios.post(
                                        `${import.meta.env.VITE_SERVER_URL}/api/auth/google-login`,
                                        { 
                                            token: credential,
                                            role: userRole // ✅ ADD: Send role to backend
                                        },
                                        { withCredentials: true }
                                    );

                                    const { token, user } = res.data;

                                    dispatch(setAuthUser(user));
                                    localStorage.setItem("token", token);
                                    if (user?.role === "recruiter") {
                                        return navigate("/recruiter");
                                    } else {
                                        return navigate("/dashboard");
                                    }
                                } catch (err) {
                                    setMessage("Google login failed ❌");
                                }
                            }}
                            onError={() => {
                                setMessage("Google login failed ❌");
                            }}
                        />

                        {/* ✅ UPDATED: Role-specific signup link */}
                        <div className="text-center mt-6">
                            Don't have an account?{" "}
                            <a href={roleConfig.signupLink} className="text-blue-600 font-medium hover:underline">
                                {roleConfig.signupText}
                            </a>
                        </div>

                        {/* ✅ ADD: Role switch option */}
                        <div className="text-center mt-3">
                            <span className="text-gray-600 text-sm">
                                {roleConfig.switchText.split('?')[0]}?{" "}
                            </span>
                            <a href={roleConfig.switchLink} className="text-blue-600 text-sm font-medium hover:underline">
                                {roleConfig.switchText.split('? ')[1]}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
