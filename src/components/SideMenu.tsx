import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../utils/LanguageContext";

const SideMenu: React.FC = () => {
  const { t } = useLanguage();

  const menuItems = [
    {
      to: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: t("home"),
      end: true,
    },
    {
      to: "/dashboard/trucks",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
      label: t("trucks"),
      end: false,
    },
    {
      to: "/dashboard/bookings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      label: t("bookings"),
      end: false,
      hasAction: true,
    },
    {
      to: "/dashboard/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      label: t("settings"),
      end: false,
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl border-r border-gray-200">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.to} className="relative">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50"
                }`
              }
            >
              <div className="flex items-center space-x-3 flex-1">
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </div>
            </NavLink>
            {item.hasAction && (
              <button
                onClick={() => window.open("/book", "_blank")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
                title={t("addBooking")}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default SideMenu;
