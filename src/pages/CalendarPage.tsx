import React, { useEffect, useState } from "react";

import Calendar from "../components/Calendar";
import TruckList from "../components/TruckList";
import { Dayjs } from "dayjs";

type Truck = {
  level: string;
  image: string;
  license: string;
  price_per_day: number;
  id: number;
};

type TruckAvailabilityResponse = {
  available_trucks: Truck[];
  proposed_trucks: Truck[];
};

const CalendarPage: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  useEffect(() => {
    console.log(startDate, endDate);
    if (!startDate || !endDate) return;

    fetch("http://localhost:8000/availability/trucks_available", {
      method: "POST",
      body: JSON.stringify({ start: startDate, end: endDate }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<TruckAvailabilityResponse>;
      })
      .then((data) => {
        setTrucks(data.available_trucks);
      });
  }, [startDate, endDate]);

  return (
    <div>
      <Calendar
        onSelectStartDate={(date) => setStartDate(date)}
        onSelectEndDate={(date) => setEndDate(date)}
      />
      <div className="w-3xl mx-auto">
        <TruckList trucks={trucks} />
      </div>
    </div>
  );
};

export default CalendarPage;
