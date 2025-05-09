import React from "react";

import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import StringPage from "./pages/StringPage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex">
        <SideMenu />
        <div className="w-full p-8">
          <StringPage />
        </div>
      </div>
    </div>
  );
};

export default App;
