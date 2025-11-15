import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAttributes } from "../../utils/api";
import { Attribute } from "../../utils/types";
import { useLanguage } from "../../utils/LanguageContext";

const ClientAttributesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("bookingData");
    if (!storedData) {
      navigate("/book");
      return;
    }
    setBookingData(JSON.parse(storedData));
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    setLoading(true);
    try {
      const data = await getAttributes();
      setAttributes(data);
    } catch (error) {
      console.error("Error loading attributes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttribute = (id: number) => {
    if (selectedAttributes.includes(id)) {
      setSelectedAttributes(selectedAttributes.filter((attrId) => attrId !== id));
    } else {
      setSelectedAttributes([...selectedAttributes, id]);
    }
  };

  const calculateAttributesPrice = () => {
    if (!bookingData) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;

    return selectedAttributes.reduce((total, attrId) => {
      const attr = attributes.find((a) => a.id === attrId);
      return total + (attr ? attr.price * days : 0);
    }, 0);
  };

  const handleContinue = () => {
    const updatedData = {
      ...bookingData,
      selectedAttributes,
      attributesPrice: calculateAttributesPrice(),
    };
    sessionStorage.setItem("bookingData", JSON.stringify(updatedData));
    navigate("/book/info");
  };

  const handleBack = () => {
    navigate("/book");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const attributesPrice = calculateAttributesPrice();
  const totalPrice = bookingData ? bookingData.basePrice + attributesPrice : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          {t("customizeExperience")}
        </h1>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-600">Dates & Truck</span>
          </div>
          <div className="w-16 h-1 bg-blue-600"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">Add-ons</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold">
              3
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-400">Info</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("availableAddOns")}
        </h2>

        {attributes.length === 0 ? (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No add-ons available
            </h3>
            <p className="text-gray-500">
              Continue to the next step to complete your booking
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map((attribute) => (
              <div
                key={attribute.id}
                onClick={() => toggleAttribute(attribute.id)}
                className={`border-2 rounded-xl p-6 cursor-pointer transition ${
                  selectedAttributes.includes(attribute.id)
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {attribute.name}
                    </h3>
                    {attribute.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {attribute.description}
                      </p>
                    )}
                    <div className="text-blue-600 font-semibold">
                      €{attribute.price.toFixed(2)} / day
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                      selectedAttributes.includes(attribute.id)
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAttributes.includes(attribute.id) && (
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t("pricesSummary")}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>{t("camperRental")}</span>
            <span className="font-semibold">€{bookingData?.basePrice.toFixed(2)}</span>
          </div>
          {attributesPrice > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>{t("extras")} ({selectedAttributes.length})</span>
              <span className="font-semibold">€{attributesPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-200 pt-2 mt-2">
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>{t("total")}</span>
              <span className="text-blue-600">€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleBack}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition flex items-center justify-center space-x-2"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>{t("back")}</span>
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center space-x-2"
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

      {/* Skip Option */}
      {attributes.length > 0 && (
        <div className="text-center mt-4">
          <button
            onClick={handleContinue}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium underline"
          >
            Skip and continue without add-ons
          </button>
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

export default ClientAttributesPage;

