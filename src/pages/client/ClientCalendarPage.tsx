import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAvailability, getSettings } from "../../utils/api";
import { AvailabilityResult, Settings } from "../../utils/types";
import { useLanguage } from "../../utils/LanguageContext";
import DateRangeCalendar from "../../components/DateRangeCalendar";
import LanguageSwitcher from "../../components/LanguageSwitcher";

interface BookingData {
  camperId: number;
  startDate: string;
  endDate: string;
  basePrice: number;
}

const ClientCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, setLanguage } = useLanguage();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCamper, setSelectedCamper] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (startDate && endDate && startDate <= endDate) {
      loadAvailability();
    }
  }, [startDate, endDate]);

  const loadSettings = async () => {
    try {
      const settingsData = await getSettings();
      setSettings(settingsData);
      // Set booking page language (or default to dashboard language)
      setLanguage(settingsData.booking_page_language || settingsData.language);
      
      // Apply company color to the page
      if (settingsData.company_color) {
        document.documentElement.style.setProperty('--company-color', settingsData.company_color);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const data = await checkAvailability(startDate, endDate);
      setAvailability(data.availability);
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedCamper(null);
  };

  const handleContinue = () => {
    if (!selectedCamper) {
      alert("Please select a truck");
      return;
    }

    const selected = availability.find((a) => a.camper.id === selectedCamper);
    if (!selected) return;

    const bookingData: BookingData = {
      camperId: selectedCamper,
      startDate,
      endDate,
      basePrice: selected.price,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/book/attributes");
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;
  };

  const days = calculateDays();
  const companyColor = settings?.company_color || "#3B82F6";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Logo and Header with Language Switcher */}
      <div className="relative mb-4">
        {/* Language Switcher - Absolute positioned */}
        <div className="absolute top-0 right-0">
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        {settings?.company_logo && (
          <div className="flex justify-center mb-4">
            <img
              src={settings.company_logo}
              alt={settings.business_name || "Logo"}
              className="h-16 w-auto object-contain"
            />
          </div>
        )}
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("bookYourCamper")}
          </h1>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-4 max-w-3xl mx-auto">
        <DateRangeCalendar
          onDateSelect={handleDateSelect}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
        />
      </div>

      {/* Available Campers */}
      {startDate && endDate && startDate <= endDate && (
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : availability.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No trucks available
              </h3>
              <p className="text-gray-500">Try selecting different dates</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availability.map((item) => (
                <div
                  key={item.camper.id}
                  onClick={() => item.available && setSelectedCamper(item.camper.id)}
                  style={{
                    borderColor: selectedCamper === item.camper.id ? companyColor : undefined,
                    backgroundColor: selectedCamper === item.camper.id ? `${companyColor}10` : undefined,
                  }}
                  className={`border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] ${
                    !item.available
                      ? "opacity-50 cursor-not-allowed bg-gray-50"
                      : selectedCamper === item.camper.id
                      ? "shadow-xl"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Camper Image/Icon */}
                      <div
                        className="w-20 h-20 rounded-lg flex items-center justify-center shadow-md"
                        style={{
                          backgroundColor: item.camper.color,
                          backgroundImage:
                            item.camper.images && item.camper.images[0]
                              ? `url(${item.camper.images[0]})`
                              : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {(!item.camper.images || item.camper.images.length === 0) && (
                          <svg
                            className="w-10 h-10 text-white opacity-80"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Camper Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {item.camper.name}
                        </h3>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                          {item.camper.description || "No description available"}
                        </p>
                        {item.camper.facilities && item.camper.facilities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.camper.facilities.slice(0, 4).map((facility, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                              >
                                {facility}
                              </span>
                            ))}
                            {item.camper.facilities.length > 4 && (
                              <span className="text-gray-600 text-xs px-1">
                                +{item.camper.facilities.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Availability */}
                    <div className="text-right ml-4">
                      {item.available ? (
                        <>
                          <div className="text-2xl font-bold text-gray-800">
                            €{item.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            for {days} {days === 1 ? "day" : "days"}
                          </div>
                          <div>
                            <span
                              style={{ backgroundColor: `${companyColor}20`, color: companyColor }}
                              className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                            >
                              {t("available")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="mt-2">
                          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                            {t("notAvailable")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {item.available && (
                      <div className="ml-3">
                        <div
                          style={{
                            borderColor: selectedCamper === item.camper.id ? companyColor : undefined,
                            backgroundColor: selectedCamper === item.camper.id ? companyColor : undefined,
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            selectedCamper === item.camper.id
                              ? "shadow-lg"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedCamper === item.camper.id && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continue Button */}
          {availability.some((a) => a.available) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleContinue}
                disabled={!selectedCamper}
                style={{
                  background: selectedCamper ? `linear-gradient(135deg, ${companyColor} 0%, ${companyColor}dd 100%)` : undefined,
                }}
                className="px-6 py-3 rounded-xl font-bold text-base text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
              >
                <span>{t("continue")}</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {(!startDate || !endDate) && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-blue-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Select your dates to get started
          </h3>
        </div>
      )}

      {/* Footer - Powered by Truckify */}
      <div className="mt-12 flex justify-end">
        <div className="text-xs text-gray-400">
          Powered by <span className="font-semibold text-gray-500">Truckify</span>
        </div>
      </div>
    </div>
  );
};

export default ClientCalendarPage;
