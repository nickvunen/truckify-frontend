import React, { useState, useEffect } from "react";
import { getCalendarData, updateBooking } from "../utils/api";
import { Booking, Camper } from "../utils/types";

const HomePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [campers, setCampers] = useState<Camper[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadCalendarData();
  }, [year, month]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const data = await getCalendarData(year, month + 1);
      setCampers(data.campers);
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "partially_paid":
        return "bg-yellow-500";
      case "not_paid":
        return "bg-red-500";
      case "refunded":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const getBookingsForCamperAndDay = (camperId: number, day: number) => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];

    return bookings.filter((booking) => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const currentDate = new Date(dateStr);

      return (
        booking.camper_id === camperId &&
        currentDate >= startDate &&
        currentDate <= endDate &&
        booking.status !== "cancelled"
      );
    });
  };

  const handleUpdateBooking = async (
    bookingId: number,
    updates: Partial<Booking>
  ) => {
    try {
      await updateBooking(bookingId, updates);
      await loadCalendarData();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Month Navigation and Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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
          </button>
          <div className="text-2xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Paid</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Partially Paid</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Not Paid</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span>Refunded</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="min-w-[1000px] overflow-x-auto">
          {/* Header Row - Always visible */}
          <div className="grid grid-cols-[120px_repeat(31,_1fr)] border-b-2 border-gray-300">
            <div className="p-3 font-bold text-gray-700 bg-gray-50 sticky left-0 z-10 text-sm">
              Truck
            </div>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div
                key={i}
                className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-50"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Truck Rows or Empty State */}
          {campers.length === 0 ? (
            <div className="border-b border-gray-200">
              <div className="p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              No trucks yet
            </h3>
            <button
                  onClick={() => window.location.href = '/dashboard/trucks'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Add Truck
                </button>
              </div>
            </div>
          ) : (
            campers.map((camper) => (
              <div
                key={camper.id}
                className="grid grid-cols-[120px_repeat(31,_1fr)] border-b border-gray-200"
              >
                <div
                  className="p-3 font-medium sticky left-0 z-10 bg-white border-r border-gray-200"
                  style={{ borderLeftColor: camper.color, borderLeftWidth: 4 }}
                >
                  <div className="text-xs font-semibold">{camper.name}</div>
                  <div className="text-xs text-gray-500">
                    €{camper.price_per_day}/day
                  </div>
                </div>
                {Array.from({ length: daysInMonth }, (_, day) => {
                  const dayBookings = getBookingsForCamperAndDay(
                    camper.id,
                    day + 1
                  );
                  const booking = dayBookings[0];

                  return (
                    <div
                      key={day}
                      className="relative h-20 border-r border-gray-100 group"
                    >
                      {booking && (
                        <div
                          className={`absolute inset-0 ${getPaymentStatusColor(
                            booking.payment_status
                          )} bg-opacity-20 border-l-4 ${getPaymentStatusColor(
                            booking.payment_status
                          )} cursor-pointer hover:bg-opacity-30 transition`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="p-1 text-xs font-semibold truncate">
                            {booking.customer_name}
                          </div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-20 left-0 top-full mt-1 w-64">
                            <div className="font-semibold mb-1">
                              {booking.customer_name}
                            </div>
                            <div>Status: {booking.status}</div>
                            <div>
                              Payment: {booking.payment_status.replace("_", " ")}
                            </div>
                            <div>
                              {new Date(booking.start_date).toLocaleDateString()}{" "}
                              - {new Date(booking.end_date).toLocaleDateString()}
                            </div>
                            <div className="mt-1 font-semibold">
                              €{booking.total_price}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Booking Details
                </h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Customer Name
                </label>
                <div className="text-lg">{selectedBooking.customer_name}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Email
                  </label>
                  <div>{selectedBooking.customer_email}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Phone
                  </label>
                  <div>{selectedBooking.customer_phone || "N/A"}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Check-in
                  </label>
                  <div>
                    {new Date(selectedBooking.start_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Check-out
                  </label>
                  <div>
                    {new Date(selectedBooking.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Total Price
                </label>
                <div className="text-2xl font-bold text-blue-600">
                  €{selectedBooking.total_price}
                </div>
              </div>

              {selectedBooking.customer_message && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Message
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.customer_message}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">
                    Booking Status
                  </label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) =>
                      handleUpdateBooking(selectedBooking.id, {
                        status: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="reserved">Reserved</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">
                    Payment Status
                  </label>
                  <select
                    value={selectedBooking.payment_status}
                    onChange={(e) =>
                      handleUpdateBooking(selectedBooking.id, {
                        payment_status: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="not_paid">Not Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

