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
      <ol className="mt-2 divide-y divide-gray-200 text-sm/6 text-gray-500">
        {bookings.map((booking) => (
          <li className="py-4 sm:flex items-center" key={booking.id}>
            <p className="w-28 ml-6 mt-2 flex-auto sm:mt-0">
              start date: {booking.start_date}
            </p>
            <p className="w-28 ml-6 mt-2 flex-auto sm:mt-0">
              end date: {booking.end_date}
            </p>
            <p className="flex-none font-semibold text-gray-900">
              Truck id: {booking.truck_id}
            </p>
            <p className="flex-none ml-6 w-20 text-right">
              Total price: €{booking.total_price},-
            </p>
            <p className="flex-none ml-6 w-20 text-right">
              {booking.confirmed ? "Confirmed" : "Not confirmed"}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default BookingList;
