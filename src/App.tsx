import React from "react";
import { Route, Routes } from "react-router-dom"; // Use BrowserRouter instead of Router
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import BookingPage from "./pages/BookingPage";
import CalendarPage from "./pages/CalendarPage";
import TrucksPage from "./pages/TrucksPage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex">
        <SideMenu />
        <div className="w-full p-8">
          <Routes>
            <Route index element={<CalendarPage />} />
            <Route path="trucks" element={<TrucksPage />} />
            <Route path="bookings" element={<BookingPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
