import React from "react";
import ApplicationStepCard from "@/components/Recruiter/Sponsorship/ApplicationStepCard";

export default function ApplicationStepList({ steps }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-0 md:p-2">
      <ul className="divide-y divide-gray-100">
        {steps.map((step) => (
          <ApplicationStepCard key={step.label} step={step} />
        ))}
      </ul>
    </div>
  );
}
