import React, { useEffect, useState } from "react";
import { Truck } from "../utils/types";

type TrucksResponse = {
  trucks: Truck[];
}

const TrucksPage: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch("http://localhost:8000/trucks");
        if (!response.ok) {
          throw new Error("Failed to fetch trucks");
        }
        const data = await response.json();
        setTrucks(data.trucks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-8">
        Our trucks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trucks.map((truck) => (
          <div key={truck.id} className="border p-4 rounded shadow">
            <img
              src={truck.image}
              alt={`Truck ${truck.license}`}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="text-lg font-bold">License: {truck.license}</h2>
            <p>Price: €{truck.price_per_day},-</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrucksPage;
