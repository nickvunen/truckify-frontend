import React, { useEffect, useState } from "react";

import Calendar from "../components/Calendar";
import TruckList from "../components/TruckList";

type Truck = {
  level: string;
  image: string;
  license: string;
  price_per_day: number;
  id: number;
};

type TruckAvailabilityResponse = {
  trucks: Truck[];
};

const CalendarPage: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/trucks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<TruckAvailabilityResponse>;
      })
      .then((data) => {
        console.log(data);
        setTrucks([...data.trucks, ...data.trucks])
  });
  }, []);

  return (
    <div>
      <Calendar />
      <div className="w-3xl mx-auto">
        <TruckList trucks={trucks} />
      </div>
    </div>
  );
};

export default CalendarPage;
