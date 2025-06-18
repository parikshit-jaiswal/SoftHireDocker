import { Bell, ChevronDown } from 'lucide-react';

const NavbarDash = () => {
  return (
    <div className="flex justify-between items-center mb-6 p-6 bg-white shadow-md">
      {/* Title */}
      <div className="text-2xl font-bold">SoftHire</div>

      {/* Notification & Profile Section */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="relative">
          <Bell size={24} />
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-2">
          {/* Profile Icon */}
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          {/* Dropdown Arrow */}
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default NavbarDash;
