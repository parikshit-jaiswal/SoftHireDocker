import React from "react";
import { Linkedin, Github } from "lucide-react"; // Import your icons properly

const Overview = () => {
  const handleResumeClick = () => {
    // Handle resume download or redirection
    const resumeUrl = localStorage.getItem("resume");
    if (resumeUrl) {
      window.open(resumeUrl, "_blank"); // Opens the resume in a new tab
    } else {
      alert("No resume URL found in localStorage.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">What Recruiters will see</h2>

      {/* Profile Preview Card */}
      <div className="border border-gray-200 rounded-lg p-8 bg-white">
        {/* User Info */}
        <div className="flex items-start mb-8">
          <div className="mr-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img
                src="/api/placeholder/96/96"
                alt="Jenna Doe"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Jenna Doe</h3>
              <div className="flex items-center space-x-2">
                <Linkedin size={20} className="text-gray-600" />
                <Github size={20} className="text-gray-600" />
                <button
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded"
                  onClick={handleResumeClick}
                >
                  Resume
                </button>
              </div>
            </div>
            <div className="flex items-center mt-2 mb-2">
              <span className="text-gray-700">Manchester, UK</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-700">0.5 hours ahead</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-700">Open to remote</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Active Today
            </span>
          </div>
        </div>

        {/* Looking for */}
        <div className="mb-8">
          <h4 className="text-sm text-gray-500 mb-2">Looking for</h4>
          <div className="pl-4 border-l-2 border-gray-300">
            <p className="text-gray-700">
              I am looking for a UI/UX design internship where I can apply my
              passion for clean, user-centered design to create intuitive user
              interfaces. I enjoy working with cross-functional teams and
              constantly seek opportunities to learn and grow in fast-paced
              environments.
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h4 className="text-sm text-gray-500 mb-2">Achievements</h4>
          <div className="pl-4 border-l-2 border-gray-300">
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                Designed the onboarding experience for a fintech app with 20K+
                users
              </li>
              <li>Winner of the UI Sprint Challenge 2024 by DesignX</li>
            </ul>
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h4 className="text-sm text-gray-500 mb-2">Education</h4>
          <div>
            <p className="font-medium">Bachelor's, Design & Technology</p>
            <p className="text-gray-700">National Institute of Design • 2026</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h4 className="text-sm text-gray-500 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Figma",
              "Adobe XD",
              "Prototyping",
              "Design Thinking",
              "HTML",
              "UI/UX Design",
            ].map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Ideal Next Opportunity */}
        <div>
          <h4 className="text-lg font-medium mb-4">Ideal Next Opportunity</h4>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm text-gray-500 mb-2">Desired Salary</h5>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm inline-block">
                Flexible
              </div>
            </div>

            <div>
              <h5 className="text-sm text-gray-500 mb-2">Desired Role</h5>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm inline-block">
                UI/UX Designer
              </div>
            </div>

            <div>
              <h5 className="text-sm text-gray-500 mb-2">Remote Work</h5>
              <div className="flex space-x-2">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Onsite
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-700">
                  Remote
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm text-gray-500 mb-2">Desired Location</h5>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm inline-block">
                Manchester
              </div>
            </div>

            <div>
              <h5 className="text-sm text-gray-500 mb-2">
                Desired Company Size
              </h5>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm inline-block">
                1000+
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
