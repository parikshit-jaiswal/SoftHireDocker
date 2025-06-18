
import React, { useState } from "react";
import { signup, SubmitRecruiterInfo } from "@/Api/AuthService";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RecruiterInfoPage = () => {

    const { user } = useSelector((state) => state.auth);
    const isRecruiter = user?.role === 'recruiter';
    const isUser = user?.role === 'candidate';

    // if (isUser) {
    //     return <Navigate to="/dashboard" replace />;
    // }
    if (isRecruiter) {
        return <Navigate to="/recruiter" replace />;
    }

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
            userId: localStorage.getItem("userId"),
            organizationName: formData.organizationName.trim(),
            website: formData.website.trim(),
            industry: formData.industry.trim(),
        };

        try {
            const data = await SubmitRecruiterInfo(requestBody);
            navigate("/recruiter");
            setMessage("Recruiter info submitted successfully! 🎉");
        } catch (error) {
            // console.log(`Error: ${error.response?.data?.message || "Something went wrong"}`);
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
                        Welcome to SoftHire!
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
                </div>
            </div>
        </div>
    );
};

export default RecruiterInfoPage;
