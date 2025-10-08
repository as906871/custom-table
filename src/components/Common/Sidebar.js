import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ChevronLeft } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { toggleSidebar } from "../../redux/reducer/sidebarReducer/SidebarReducer";
import { menuItems } from "../../utils/constant";

const Sidebar = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { isOpen: open, position } = useSelector((state) => state.sidebar);
  const sidebarOnRight = position === "right";
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSidebar = () => dispatch(toggleSidebar());

  const drawerWidth = open ? "w-64" : "w-20";

  return (
    <div
      className={`
        ${drawerWidth}
        bg-white shadow-lg fixed h-full z-30 flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarOnRight ? "right-0" : "left-0"}
        ${isMobile && !open ? "-translate-x-full" : "translate-x-0"}
        ${isMobile && !open && sidebarOnRight ? "translate-x-full" : ""}
      `}
    >

      <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 border-b border-gray-200">
        <div
          className={`flex items-center gap-2 sm:gap-3 overflow-hidden transition-all duration-300 ${
            open ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs sm:text-sm">AK</span>
          </div>
          <span className="font-semibold text-sm sm:text-base text-gray-800 whitespace-nowrap">
            Demo Task
          </span>
        </div>

        <button
          onClick={handleToggleSidebar}
          className=" sm:p-2 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          {open ? <ChevronLeft size={20} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className="flex-1 py-1 scrollbar-thin scrollbar-thumb-gray-300">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = location.pathname === item.path;

          return (
            <div
              key={item.label}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleToggleSidebar();
              }}
              className={`
                mx-2  mb-1 flex items-center py-2.5 sm:py-3 rounded-lg cursor-pointer transition-all
                ${
                  isSelected
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${!open && "justify-center"}
              `}
            >
              <div className="relative flex-shrink-0">
                <Icon size={isMobile ? 22 : 24} className="flex-shrink-0" />
                {item.badge && !open && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`${
                  open ? "opacity-100 flex-1" : "opacity-0 w-0"
                } transition-all duration-200 whitespace-nowrap font-medium text-sm sm:text-base`}
              >
                {item.label}
              </span>
              {item.badge && open && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3 sm:p-4">
        <div
          className={`flex items-center gap-2 sm:gap-3 ${
            !open && "justify-center"
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            <span className="text-sm sm:text-base">AS</span>
          </div>
          <div
            className={`${
              open ? "opacity-100" : "opacity-0 w-0"
            } transition-all duration-200 overflow-hidden`}
          >
            <p className="text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">
              Akshay
            </p>
            <p className="text-xs text-gray-500 whitespace-nowrap">
              as90@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;