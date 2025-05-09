import React from "react";
import { Link } from "react-router-dom";

const SideMenu: React.FC = () => (
  <nav className="w-52 bg-gray-100 p-4 min-h-screen">
    <ul className="list-none p-0 m-0">
      <li className="mb-2">
        <Link to="/">Home</Link>
      </li>
      <li className="mb-2">
        <Link to="/trucks">Our Trucks</Link>
      </li>
      <li className="mb-2">
        <Link to="/bookings">Bookings</Link>
      </li>
    </ul>
  </nav>
);

export default SideMenu;
