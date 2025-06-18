import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { DemoFormSubmit } from "../../Api/contact"; // Adjust the path if needed
import { toast } from "react-toastify";


const ScheduleDemoForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    date: "",
    time: "",
    phone: "",
    comments: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please verify that you are not a robot.");
      return;
    }

    // Split phone into countryCode and phoneNumber
    const phoneMatch = formData.phone.match(/^(\+\d{1,4})[-\s]?(\d{6,15})$/);
    if (!phoneMatch) {
      toast.error("Please enter a valid phone number with country code (e.g. +91-9876543210)");
      return;
    }

    const payload = {
      ...formData,
      countryCode: phoneMatch[1],
      phoneNumber: phoneMatch[2],
      recaptchaToken: captchaToken,
    };

    setLoading(true);
    try {
      const response = await DemoFormSubmit(payload);
      // console.log("Success:", response);
      toast.success("Demo Scheduled Successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        organization: "",
        date: "",
        time: "",
        phone: "",
        comments: "",
      });
      recaptchaRef.current.reset();
      setCaptchaToken(null);
    } catch (error) {
      toast.error("Error scheduling demo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-10 rounded-2xl shadow-2xl w-full mt-12">
      <div className="md:w-1/2 pr-8">
        <h2 className="md:text-5xl text-3xl font-bold mb-6 text-gray-800">
          Schedule a Demo Now
        </h2>
        <ul className="text-gray-700 space-y-4 pt-10 list-disc pl-6">
          <li className="md:text-xl text-lg font-medium p-2">
            Get a personalized walkthrough of our platform.
          </li>
          <li className="md:text-xl text-lg font-medium p-2">
            See how our features can benefit your business.
          </li>
          <li className="md:text-xl text-lg font-medium p-2">
            Ask questions and get expert insights.
          </li>
        </ul>
      </div>

      <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="John"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-base"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-base"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Email</label>
            <input
              type="email"
              name="email"
              placeholder="yZ7Jf@example.com"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Organization</label>
            <input
              type="text"
              name="organization"
              placeholder="Your Organization Name"
              value={formData.organization}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91-9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Any special requirements?"
              className="p-3 border border-gray-300 rounded-lg text-base"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6Lez5SMrAAAAAK4-qPMmfAJ-bSxnIOtGLxcFVfKo"
              onChange={(token) => setCaptchaToken(token)}
              ref={recaptchaRef}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white p-3 rounded-lg w-full font-semibold text-lg transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Schedule Demo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleDemoForm;
