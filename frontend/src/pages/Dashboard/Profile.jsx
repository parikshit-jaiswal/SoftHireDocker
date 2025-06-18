import { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import Overview from "./Profile/Overview";
import EditProfile from "./Profile/EditProfile";
import ResumeUpload from "./Profile/Resume";
import Preferences from "./Profile/Preferences";
import Culture from "./Profile/Culture";

export default function SoftHireProfile() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Profile", "Resume/ CV", "Preferences", "Culture"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Profile content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-8">Edit your SoftHire Profile</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`mr-8 py-4 px-1 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 font-medium text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        {activeTab === "Overview" && <Overview />}
        {activeTab === "Profile" && <EditProfile />}
        {activeTab === "Resume/ CV" && <ResumeUpload />}
        {activeTab === "Preferences" && <Preferences />}
        {activeTab === "Culture" && <Culture />}
      </main>
    </div>
  );
}
