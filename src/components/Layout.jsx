import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, ScanLine, Calendar, User, ClipboardPlus } from "lucide-react";
import clsx from "clsx";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: Calendar, label: "Lịch thuốc", path: "/calendar" },
    { icon: ScanLine, label: "Quét đơn", path: "/scan" },
    { icon: ClipboardPlus, label: "Lịch sử", path: "/history" },
    { icon: User, label: "Cá nhân", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Container Simulation */}
      <div className="w-full max-w-md bg-[#F2F4F7] min-h-screen shadow-xl relative flex flex-col">
        {/* Header (Zalo Style) */}
        <div className="bg-zalo-primary text-white p-4 pt-8 sticky top-0 z-50 shadow-sm">
          <h1 className="text-lg font-bold">HealFlow</h1>
          <p className="text-xs opacity-90">Trợ lý y tế cá nhân</p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-24">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-md flex justify-between items-end px-2 py-2 pb-5 z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isScan = item.path === "/scan";

            if (isScan) {
              return (
                <div key={item.path} className="relative -top-6 px-2">
                  <button
                    onClick={() => navigate(item.path)}
                    className="w-14 h-14 bg-zalo-primary rounded-full flex items-center justify-center shadow-lg border-[4px] border-[#F2F4F7]"
                  >
                    <Icon size={24} className="text-white" />
                  </button>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center space-y-1 w-16"
              >
                <Icon
                  size={24}
                  className={clsx(
                    isActive ? "text-zalo-primary" : "text-gray-400"
                  )}
                />
                <span
                  className={clsx(
                    "text-[10px]",
                    isActive ? "text-zalo-primary font-medium" : "text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;
