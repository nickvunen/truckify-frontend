import React, { useEffect } from "react";

import BookingList from "../components/BookingList";
import { Booking } from "../utils/types";

type BookingResponse = {
  bookings: Booking[];
};

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<BookingResponse>;
      })
      .then((data) => {
        setBookings(data.bookings);
      });
  }, [bookings]);

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-8">
        Current Bookings
      </h2>
      <BookingList bookings={bookings} />
    </div>
  );
};

export default BookingPage;
