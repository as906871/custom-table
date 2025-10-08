import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu } from "lucide-react";

import Task from "../Task/TaskDay/TaskDay";
import Task1 from "../Task/Task1";
import Task2 from "../Task/Task2";
import Task3 from "../Task/Task3";

import { setSidebarPosition, toggleSidebar } from "../../redux/reducer/sidebarReducer/SidebarReducer";
import Sidebar from "../Common/Sidebar";

const Home = () => {
  const dispatch = useDispatch();
  const { isOpen: open, position } = useSelector((state) => state.sidebar);
  const sidebarOnRight = position === "right";

  const [isMobile, setIsMobile] = React.useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTogglePosition = () => {
    dispatch(setSidebarPosition(sidebarOnRight ? "left" : "right"));
  };

//   const drawerWidth = open ? "w-64" : "w-20";
  const contentMargin = open
    ? sidebarOnRight
      ? "md:mr-64 mr-0"
      : "md:ml-64 ml-0"
    : sidebarOnRight
    ? "md:mr-20 mr-0"
    : "md:ml-20 ml-0";

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      <Sidebar isMobile={isMobile} />

      {open && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => dispatch(toggleSidebar())}
        ></div>
      )}

      <div className={`${contentMargin} flex-1 transition-all duration-300 ease-in-out min-w-0`}>
        <div className="h-14 sm:h-16 bg-white shadow-sm flex items-center justify-between px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Open menu"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 capitalize truncate">
              {location.pathname.replace("/", "") || "Task"}
            </h1>
          </div>

          <button
            onClick={handleTogglePosition}
            className="p-1.5 sm:p-2 px-2 sm:px-3 lg:px-4 bg-yellow-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden sm:inline">Toggle Sidebar</span>
            <span className="sm:hidden">Toggle</span>
          </button>
        </div>

        <div className="p-3 sm:p-4 lg:p-6 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] text-gray-700 text-sm sm:text-base lg:text-lg overflow-auto">
          <Routes>
            <Route path="/" element={<Task />} />
            <Route path="/task1" element={<Task1 />} />
            <Route path="/task2" element={<Task2 />} />
            <Route path="/task3" element={<Task3 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
