import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, ScanLine, Calendar, User } from "lucide-react";
import clsx from "clsx";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: ScanLine, label: "Quét đơn", path: "/scan" },
    { icon: Calendar, label: "Lịch", path: "/calendar" },
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
        <div className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-md flex justify-around py-3 pb-5 z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center space-y-1"
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
