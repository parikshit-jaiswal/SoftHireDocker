import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Briefcase,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Profile", icon: User, path: "/dashboard/profile" },
    { name: "Jobs", icon: Briefcase, path: "/dashboard/jobs" },
    { name: "Applied", icon: ClipboardList, path: "/dashboard/applied" },
    { name: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
  ];

  return (
    <div className="w-20 flex flex-col items-center pt-8 border-r border-gray-200 h-screen">
      {navItems.map((item) => {
        const isActive =
          currentPath === item.path ||
          (item.path !== "/dashboard" && currentPath.startsWith(item.path));
        return (
          <Link to={item.path} key={item.name} className="w-full">
            <div
              className={`flex flex-col items-center justify-center py-4 w-full cursor-pointer ${
                isActive ? "border-l-4 border-black bg-gray-100" : ""
              }`}
            >
              <item.icon
                size={24}
                className={isActive ? "text-black" : "text-gray-500"}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-black" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
