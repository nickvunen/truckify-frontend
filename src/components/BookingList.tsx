type Booking = {
  id: number;
  start_date: string;
  end_date: string;
  truck_id: number;
  total_price: number;
  confirmed: boolean;
};

const BookingList: React.FC<{
  bookings: Booking[];
}> = ({ bookings }) => {
  return (
    <section className="mt-12">
      <ol className="mt-2 divide-y border-gray-200 divide-gray-200 text-sm/6 text-gray-500">
        {bookings.map((booking) => (
          <li className="py-4 sm:flex items-center" key={booking.id}>
            <p className="w-36 font-semibold text-gray-900">
              Truck: {booking.truck_id}
            </p>
            <div className="ml-6 w-48 flex-row">
              <p>{booking.start_date}</p>
              <p>{booking.end_date}</p>
            </div>
            <p className="ml-6 w-48">Total price: €{booking.total_price},-</p>
            <p className="ml-auto text-right">
              {booking.confirmed ? "Confirmed ✅" : "Not confirmed 🚫"}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default BookingList;
