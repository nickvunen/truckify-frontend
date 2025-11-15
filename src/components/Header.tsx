import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="Truckify Logo"
            className="w-20 h-20 object-contain"
          />
          <Link to="/dashboard" className="text-2xl font-bold hover:text-blue-100 transition">
            Truckify
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/book"
            target="_blank"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-md"
          >
            Preview Booking Page
          </Link>
          <button className="p-2 hover:bg-blue-700 rounded-lg transition duration-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
