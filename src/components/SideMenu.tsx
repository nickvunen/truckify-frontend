import React from "react";


const SideMenu: React.FC = () => (
  <nav className="w-52 bg-gray-100 p-4 min-h-screen">
    <ul className="list-none p-0 m-0">
      <li className="mb-2">
        <a href="#">
          Home
        </a>
      </li>
      <li className="mb-2">
        <a href="#">
          String Page
        </a>
      </li>
      {/* Add more menu items as needed */}
    </ul>
  </nav>
);

export default SideMenu;
