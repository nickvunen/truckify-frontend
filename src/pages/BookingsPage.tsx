import React, { useState, useEffect } from "react";
import { getBookings, getCampers, updateBooking } from "../utils/api";
import { Booking, Camper } from "../utils/types";

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [campers, setCampers] = useState<Camper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, campersData] = await Promise.all([
        getBookings(),
        getCampers(),
      ]);
      setBookings(bookingsData);
      setCampers(campersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCamperName = (camperId: number) => {
    const camper = campers.find((c) => c.id === camperId);
    return camper?.name || "Unknown Truck";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      reserved: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      not_paid: "bg-red-100 text-red-800",
      partially_paid: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const handleUpdateBooking = async (
    bookingId: number,
    updates: Partial<Booking>
  ) => {
    try {
      await updateBooking(bookingId, updates);
      await loadData();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "active") return ["reserved", "confirmed"].includes(booking.status);
    return booking.status === filter;
  });

  const sortedBookings = [...filteredBookings].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Bookings</option>
              <option value="active">Active</option>
              <option value="reserved">Reserved</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => window.open('/book', '_blank')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition shadow-lg flex items-center space-x-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Booking</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
            <div className="text-sm text-blue-600 font-semibold">Total</div>
            <div className="text-3xl font-bold text-blue-700">
              {bookings.length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm">
            <div className="text-sm text-green-600 font-semibold">
              Confirmed
            </div>
            <div className="text-3xl font-bold text-green-700">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 shadow-sm">
            <div className="text-sm text-yellow-600 font-semibold">
              Reserved
            </div>
            <div className="text-3xl font-bold text-yellow-700">
              {bookings.filter((b) => b.status === "reserved").length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm">
            <div className="text-sm text-purple-600 font-semibold">Revenue</div>
            <div className="text-3xl font-bold text-purple-700">
              €
              {bookings
                .filter((b) => b.status !== "cancelled")
                .reduce((sum, b) => sum + b.total_price, 0)
                .toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {sortedBookings.length === 0 ? (
          <div className="p-12 text-center">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600">
              No bookings found
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Truck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCamperName(booking.camper_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {new Date(booking.start_date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        to {new Date(booking.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      €{booking.total_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadge(
                          booking.payment_status
                        )}`}
                      >
                        {booking.payment_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Booking #{selectedBooking.id}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Customer Name
                  </label>
                  <div className="text-lg">{selectedBooking.customer_name}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Truck
                  </label>
                  <div className="text-lg">
                    {getCamperName(selectedBooking.camper_id)}
                  </div>
                </div>
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

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700">
                      Base Price
                    </label>
                    <div className="text-xl font-bold text-blue-900">
                      €{selectedBooking.base_price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700">
                      Extras
                    </label>
                    <div className="text-xl font-bold text-blue-900">
                      €{selectedBooking.attributes_price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700">
                      Total
                    </label>
                    <div className="text-2xl font-bold text-blue-900">
                      €{selectedBooking.total_price.toFixed(2)}
                    </div>
                  </div>
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

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                <div>
                  Created:{" "}
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </div>
                <div>
                  Last Updated:{" "}
                  {new Date(selectedBooking.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Powered by Truckify */}
      <div className="flex justify-end">
        <div className="text-xs text-gray-400">
          Powered by <span className="font-semibold text-gray-500">Truckify</span>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;

