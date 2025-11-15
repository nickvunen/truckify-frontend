import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Booking } from "../../utils/types";
import { useLanguage } from "../../utils/LanguageContext";

const ClientConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const storedBooking = sessionStorage.getItem("confirmedBooking");
    if (!storedBooking) {
      navigate("/book");
      return;
    }
    setBooking(JSON.parse(storedBooking));
  }, []);

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Animation */}
      <div className="text-center mb-8">
        <div className="inline-block mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
              <svg
                className="w-12 h-12 text-white"
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
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800">
          {isConfirmed ? t("bookingConfirmed") + " 🎉" : t("bookingReceived") + " 📋"}
        </h1>
      </div>

      {/* Confirmation Details */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="border-l-4 border-blue-600 bg-blue-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Confirmation email sent to:</strong>{" "}
                {booking.customer_email}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Please check your inbox (and spam folder) for booking details and
                next steps.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("bookingDetails")}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Booking ID</div>
              <div className="font-bold text-gray-800 text-lg">
                #{booking.id}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    isConfirmed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {isConfirmed ? "Confirmed" : "Reserved"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600 mb-1">{t("customerName")}</div>
            <div className="font-semibold text-gray-800">
              {booking.customer_name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">{t("checkIn")}</div>
              <div className="font-semibold text-gray-800">
                {new Date(booking.start_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">{t("checkOut")}</div>
              <div className="font-semibold text-gray-800">
                {new Date(booking.end_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {booking.customer_message && (
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600 mb-1">Your Message</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {booking.customer_message}
              </div>
            </div>
          )}

          <div className="border-t-2 border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">
                Total Amount
              </span>
              <span className="text-3xl font-bold text-blue-600">
                €{booking.total_price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Payment instructions will be sent to your email
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white mb-6">
        <h3 className="text-2xl font-bold mb-4">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
              1
            </div>
            <div>
              <div className="font-semibold">Check Your Email</div>
              <div className="text-blue-100 text-sm">
                You'll receive a confirmation email with all booking details
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
              2
            </div>
            <div>
              <div className="font-semibold">
                {isConfirmed ? "Complete Payment" : "Wait for Confirmation"}
              </div>
              <div className="text-blue-100 text-sm">
                {isConfirmed
                  ? "Follow the payment instructions in your email"
                  : "We'll review your booking and send you a confirmation"}
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
              3
            </div>
            <div>
              <div className="font-semibold">Prepare for Your Adventure</div>
              <div className="text-blue-100 text-sm">
                Get ready for an amazing trip!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => {
            sessionStorage.removeItem("confirmedBooking");
            navigate("/book");
          }}
          className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition shadow-md"
        >
          Make Another Booking
        </button>
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
        >
          Print Confirmation
        </button>
      </div>

      {/* Contact Info */}
      <div className="mt-8 text-center text-gray-600">
        <p className="mb-2">Need help? Have questions?</p>
        <p className="text-sm">
          Contact us and we'll be happy to assist you with your booking.
        </p>
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

export default ClientConfirmationPage;

