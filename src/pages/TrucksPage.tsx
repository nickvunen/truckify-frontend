import React, { useEffect, useState } from "react";

interface Truck {
  id: number;
  license: string;
  price: number;
  image: string;
}

const TrucksPage: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch("https://localhost:8000/trucks");
        if (!response.ok) {
          throw new Error("Failed to fetch trucks");
        }
        const data = await response.json();
        setTrucks(data);
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
      <h1>Our Trucks</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trucks.map((truck) => (
          <div key={truck.id} className="border p-4 rounded shadow">
            <img
              src={truck.image}
              alt={`Truck ${truck.license}`}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="text-lg font-bold">License: {truck.license}</h2>
            <p>Price: ${truck.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrucksPage;
