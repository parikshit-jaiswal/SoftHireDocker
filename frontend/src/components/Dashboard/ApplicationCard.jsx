import { ChevronRight } from "lucide-react";
const CompanyLogo = ({ background, initial }) => (
  <div
    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
    style={{ backgroundColor: background }}
  >
    {initial}
  </div>
);

const StatusBadge = ({ status, color }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-sm font-medium">{status}</span>
  </div>
);

export const ApplicationCard = ({ application }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 ">
    <div className="flex justify-between mb-2">
      <div className="flex items-start gap-4">
        <CompanyLogo
          background={application.logoBackground}
          initial={application.logoInitial}
        />
        <div>
          <h3 className="font-bold text-lg">{application.position}</h3>
          <p className="text-gray-700">{application.company}</p>
          <p className="text-gray-500 text-sm">
            {application.location}, {application.type}
          </p>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Applied on: {application.appliedDate}
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <StatusBadge
        status={application.status}
        color={application.statusColor}
      />
      <button className="flex items-center text-gray-700 text-sm">
        View Details <ChevronRight size={16} />
      </button>
    </div>
  </div>
);
