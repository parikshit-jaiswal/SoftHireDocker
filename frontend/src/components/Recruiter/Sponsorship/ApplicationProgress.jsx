import React from "react";

export default function ApplicationProgress({ percent }) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-700">Progress</span>
                <span className="text-gray-500 text-xs font-medium">{percent}%</span>
            </div>
            <div className="w-full h-2 bg-blue-100 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full transition-all duration-300" style={{ width: percent + '%' }}></div>
            </div>
        </div>
    );
}
