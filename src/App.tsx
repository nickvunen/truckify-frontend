import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Dashboard Components
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import HomePage from "./pages/HomePage";
import TrucksPage from "./pages/TrucksPage";
import BookingsPage from "./pages/BookingsPage";
import SettingsPage from "./pages/SettingsPage";

// Client Booking Flow Components
import ClientCalendarPage from "./pages/client/ClientCalendarPage";
import ClientAttributesPage from "./pages/client/ClientAttributesPage";
import ClientInfoPage from "./pages/client/ClientInfoPage";
import ClientConfirmationPage from "./pages/client/ClientConfirmationPage";

// Dashboard Layout
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <div className="flex flex-1">
      <SideMenu />
      <div className="flex-1 p-8">{children}</div>
    </div>
  </div>
);

// Client Booking Layout (clean, minimal)
const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="container mx-auto px-4 py-8">{children}</div>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <HomePage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/trucks"
        element={
          <DashboardLayout>
            <TrucksPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/bookings"
        element={
          <DashboardLayout>
            <BookingsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        }
      />

      {/* Client Booking Flow Routes */}
      <Route
        path="/book"
        element={
          <ClientLayout>
            <ClientCalendarPage />
          </ClientLayout>
        }
      />
      <Route
        path="/book/attributes"
        element={
          <ClientLayout>
            <ClientAttributesPage />
          </ClientLayout>
        }
      />
      <Route
        path="/book/info"
        element={
          <ClientLayout>
            <ClientInfoPage />
          </ClientLayout>
        }
      />
      <Route
        path="/book/confirmation"
        element={
          <ClientLayout>
            <ClientConfirmationPage />
          </ClientLayout>
        }
      />

      {/* Default redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
