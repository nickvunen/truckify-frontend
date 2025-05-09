import React from "react";
import "./SideMenu.css";

const SideMenu: React.FC = () => (
  <nav className="side-menu">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">String Page</a></li>
      {/* Add more menu items as needed */}
    </ul>
  </nav>
);

export default SideMenu;
