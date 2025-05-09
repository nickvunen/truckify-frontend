import React from "react";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import StringPage from "./pages/StringPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <SideMenu />
        <div className="page-container">
          <StringPage />
        </div>
      </div>
    </div>
  );
};

export default App;
