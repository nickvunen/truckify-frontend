import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, getCamper, getAttributes } from "../../utils/api";
import { Camper, Attribute } from "../../utils/types";
import { useLanguage } from "../../utils/LanguageContext";

const ClientInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bookingData, setBookingData] = useState<any>(null);
  const [camper, setCamper] = useState<Camper | null>(null);
  const [selectedAttributesList, setSelectedAttributesList] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerMessage: "",
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem("bookingData");
    if (!storedData) {
      navigate("/book");
      return;
    }
    const data = JSON.parse(storedData);
    setBookingData(data);
    loadCamperData(data);
  }, []);

  const loadCamperData = async (data: any) => {
    setLoading(true);
    try {
      const camperData = await getCamper(data.camperId);
      setCamper(camperData);

      if (data.selectedAttributes && data.selectedAttributes.length > 0) {
        const allAttributes = await getAttributes();
        const selected = allAttributes.filter((attr) =>
          data.selectedAttributes.includes(attr.id)
        );
        setSelectedAttributesList(selected);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const booking = {
        camper_id: bookingData.camperId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone || undefined,
        customer_message: formData.customerMessage || undefined,
        selected_attributes: bookingData.selectedAttributes || [],
      };

      const result = await createBooking(booking);
      sessionStorage.setItem("confirmedBooking", JSON.stringify(result));
      sessionStorage.removeItem("bookingData");
      navigate("/book/confirmation");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      alert(error.message || "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/book/attributes");
  };

  const calculateDays = () => {
    if (!bookingData) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalPrice = bookingData
    ? bookingData.basePrice + (bookingData.attributesPrice || 0)
    : 0;
  const days = calculateDays();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          {t("almostThere")}
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
          <div className="w-16 h-1 bg-green-500"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-600">Add-ons</span>
          </div>
          <div className="w-16 h-1 bg-blue-600"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">Info</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("fullName")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("emailAddress")} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("phoneNumber")}
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+31 6 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("message")}
                </label>
                <textarea
                  value={formData.customerMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, customerMessage: e.target.value })
                  }
                  rows={4}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special requests or questions?"
                />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please note: This is a booking request. You will receive a
                      confirmation email with further details and payment
                      instructions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
                >
                  {t("back")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t("loading") + "..." : t("completeBooking")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t("bookingSummary")}
            </h3>

            {camper && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div
                  className="h-32 rounded-lg mb-3"
                  style={{
                    backgroundColor: camper.color,
                    backgroundImage:
                      camper.images && camper.images[0]
                        ? `url(${camper.images[0]})`
                        : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <h4 className="font-bold text-gray-800">{camper.name}</h4>
              </div>
            )}

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div>
                <div className="text-sm text-gray-600">Check-in</div>
                <div className="font-semibold text-gray-800">
                  {new Date(bookingData?.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Check-out</div>
                <div className="font-semibold text-gray-800">
                  {new Date(bookingData?.endDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold text-gray-800">
                  {days} {days === 1 ? "day" : "days"}
                </div>
              </div>
            </div>

            {selectedAttributesList.length > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Add-ons
                </div>
                {selectedAttributesList.map((attr) => (
                  <div
                    key={attr.id}
                    className="flex justify-between text-sm text-gray-600 mb-1"
                  >
                    <span>{attr.name}</span>
                    <span>€{(attr.price * days).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>{t("camperRental")}</span>
                <span className="font-semibold">
                  €{bookingData?.basePrice.toFixed(2)}
                </span>
              </div>
              {bookingData?.attributesPrice > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Add-ons</span>
                  <span className="font-semibold">
                    €{bookingData.attributesPrice.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t-2 border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-blue-600">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Powered by Truckify */}
      <div className="mt-12 flex justify-end">
        <div className="text-xs text-gray-400">
          Powered by <span className="font-semibold text-gray-500">Truckify</span>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoPage;

