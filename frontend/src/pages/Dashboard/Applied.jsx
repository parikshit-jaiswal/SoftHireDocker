import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { applications, archiveApplications } from "@/constants/dashboard";
export default function JobApplicationDashboard() {
  const [activeTab, setActiveTab] = useState("Ongoing");
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Application</h2>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                className={`py-2 px-1 font-medium ${
                  activeTab === "Ongoing"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("Ongoing")}
              >
                Ongoing
              </button>
              <button
                className={`py-2 px-1 font-medium ${
                  activeTab === "Archived"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("Archived")}
              >
                Archived
              </button>
            </div>
          </div>

          {/* Application Cards */}
          {activeTab === "Ongoing" ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 ${app.logoColor} text-white rounded-full flex items-center justify-center text-xl font-bold mr-4`}
                    >
                      {app.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{app.position}</h3>
                      <p className="text-gray-600">{app.company}</p>
                      <p className="text-gray-500 text-sm">{app.location}</p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`w-2 h-2 ${app.statusColor} rounded-full mr-2`}
                        ></span>
                        <span className="text-sm">{app.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500 mb-2">
                      Applied on: {app.applied}
                    </p>
                    <button className="flex items-center text-gray-600">
                      <span className="mr-1 text-sm">View Details</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ):(
            <div className="space-y-4">
            {archiveApplications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 ${app.logoColor} text-white rounded-full flex items-center justify-center text-xl font-bold mr-4`}
                  >
                    {app.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{app.position}</h3>
                    <p className="text-gray-600">{app.company}</p>
                    <p className="text-gray-500 text-sm">{app.location}</p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`w-2 h-2 ${app.statusColor} rounded-full mr-2`}
                      ></span>
                      <span className="text-sm">{app.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-gray-500 mb-2">
                    Applied on: {app.applied}
                  </p>
                  <button className="flex items-center text-gray-600">
                    <span className="mr-1 text-sm">View Details</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </main>
      </div>
    </div>
  );
}
