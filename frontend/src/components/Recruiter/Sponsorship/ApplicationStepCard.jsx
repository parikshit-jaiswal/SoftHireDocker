import { ArrowLeft, CircleAlert } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ApplicationStepCard({ step, readOnly = false }) {
    const navigate = useNavigate();
    return (
        <li
            onClick={readOnly ? undefined : () => navigate(step.to)}
            className={`flex items-center justify-between py-5 px-4 md:px-6 m-2 rounded-lg ${readOnly ? 'cursor-default' : 'hover:bg-gray-50 cursor-pointer'
                }`}
        >
            <div className="flex items-center gap-3 md:gap-4">
                {step.status === "completed" ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 border border-green-200">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 10.5l3.5 3.5 6-7" /></svg>
                    </span>
                ) : (
                    <img className="w-7 h-7" src="/caution.svg" alt="" />
                )}
                <span className="font-medium text-gray-900 text-base md:text-lg">{step.label}</span>
            </div>
            <div>
                {step.status === "completed" ? (
                    <button
                        disabled={readOnly}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${readOnly
                                ? 'text-gray-400 border border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'text-blue-500 border border-blue-200 bg-blue-50 hover:bg-blue-100'
                            }`}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 13.5V14h.5l9.85-9.85-1.5-1.5L2 12.5v1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Edit
                    </button>
                ) : (
                    <button
                        disabled={readOnly}
                        className={`flex items-center gap-1 px-[0.7rem] py-2 rounded-lg font-medium text-sm transition-colors ${readOnly
                                ? 'text-gray-400 border border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'text-blue-500 border border-blue-200 bg-blue-50 hover:bg-blue-100'
                            }`}
                    >
                        <ArrowLeft size={20} />
                        Start
                    </button>
                )}
            </div>
        </li>
    );
}