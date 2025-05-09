import React from "react";

const Header: React.FC = () => (
  <header className="w-full p-1 bg-blue-500 flex items-center justify-center">
    <img src="/logo.png" alt="Truckify Logo" className="h-35 w-35" />
    {/* <h1 className="text-white text-2xl font-bold text-center">Truckify!</h1> */}
  </header>
);

export default Header;
