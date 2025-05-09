import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Use BrowserRouter instead of Router
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import CalendarPage from "./pages/CalendarPage";
import TrucksPage from "./pages/TrucksPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex">
          <SideMenu />
          <div className="w-full p-8">
            <CalendarPage />
            <TrucksPage />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
