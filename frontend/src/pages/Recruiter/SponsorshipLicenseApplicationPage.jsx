import React from "react";
import ApplicationProgress from "@/components/Recruiter/Sponsorship/ApplicationProgress";
import ApplicationStepList from "@/components/Recruiter/Sponsorship/ApplicationStepList";

const steps = [
    {
        label: "Getting Started",
        status: "pending",
        to: "/sponsorship-license-application/getting-started",
    },
    {
        label: "About Your Company",
        status: "completed",
        to: "/sponsorship-license-application/about-your-company",
    },
    {
        label: "Company Structure",
        status: "pending",
        to: "/sponsorship-license-application/company-structure",
    },
    {
        label: "Activity & Needs",
        status: "pending",
        to: "/sponsorship-license-application/activity-needs",
    },
    {
        label: "About You",
        status: "pending",
        to: "/sponsorship-license-application/about-you",
    },
    {
        label: "System Access",
        status: "pending",
        to: "/sponsorship-license-application/system-access",
    },
    {
        label: "Supporting Documents",
        status: "pending",
        to: "/sponsorship-license-application/supporting-documents",
    },
    {
        label: "Organisation Size",
        status: "pending",
        to: "/sponsorship-license-application/organisation-size",
    },
    {
        label: "Declaration",
        status: "pending",
        to: "/sponsorship-license-application/declaration",
    },
];

export default function SponsorshipLicenseApplicationPage() {
    return (
        <div className="min-h-screen py-6 px-2 md:px-8 lg:px-24">
            <div className="max-w-5xl mx-auto">
                <h4 className="text-xs font-bold text-primary mb-1 tracking-widest uppercase">
                    SOFTHIRE LTD
                </h4>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    Application
                </h1>
                <p className="text-gray-500 mb-2">Account Created</p>
                <div className="bg-blue-100 text-blue-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                    Complete all steps then submit application.
                </div>
                <ApplicationProgress percent={50} />
                <ApplicationStepList steps={steps} />
            </div>
            {/* Bottom message and buttons */}
            <div className="mt-16 flex flex-col items-center">
                <p className="text-center text-gray-800 text-base mb-4 max-w-2xl">
                    You must click 'Submit' & Pay for Borderless to start working on
                    the application. Finish all steps above to enable the button.
                </p>
                <div className="flex gap-4">
                    <button className="px-6 py-2 rounded-xl bg-blue-50 text-blue-300 font-semibold text-base cursor-not-allowed select-none shadow-none border border-blue-200">
                        Submit
                    </button>
                    <button className="px-6 py-2 rounded-xl bg-blue-50 text-blue-500 font-semibold text-base hover:bg-blue-100 transition-colors border border-blue-200">
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}