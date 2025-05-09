import React, { useEffect, useState } from "react";

import Calendar from "../components/Calendar";
import TruckList from "../components/TruckList";
import { Dayjs } from "dayjs";

import { Truck } from "../utils/types";

type TruckAvailabilityResponse = {
  available_trucks: Truck[];
  proposed_trucks: Truck[];
};

const CalendarPage: React.FC = () => {
  const [proposedTrucks, setProposedTrucks] = useState<Truck[]>([]);
  const [availableTrucks, setAvailableTrucks] = useState<Truck[]>([]);

  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) {
      setProposedTrucks([]);
      setAvailableTrucks([]);

      return;
    }

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
        setProposedTrucks(data.proposed_trucks);
        setAvailableTrucks(data.available_trucks);
      });
  }, [startDate, endDate]);

  return (
    <div>
      <Calendar
        onSelectStartDate={(date) => setStartDate(date)}
        onSelectEndDate={(date) => setEndDate(date)}
      />
      <div className="w-3xl mx-auto">
        {availableTrucks.length > 0 && (
          <TruckList title="Available trucks" trucks={availableTrucks} />
        )}
        {proposedTrucks.length > 0 && (
          <TruckList title="Proposed trucks" trucks={proposedTrucks} />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
