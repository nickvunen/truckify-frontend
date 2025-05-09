import React, { useEffect } from "react";
import BookingList from "../components/Booking";

type Booking = {
  id: number;
  start_date: string;
  end_date: string;
  truck_id: number;
  total_price: number;
  confirmed: boolean;
};

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
      <BookingList bookings={bookings} />
    </div>
  );
};

export default BookingPage;
