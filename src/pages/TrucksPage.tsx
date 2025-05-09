import React, { useEffect, useState } from "react";
import { Truck } from "../utils/types";

type TrucksResponse = {
  trucks: Truck[];
};

const TrucksPage: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [license, setLicense] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<string>("");

  let successfullyAddedTruck = false;

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

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/trucks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          license,
          price_per_day: price,
          image,
          level: "A",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add truck");
      }
      if (response.ok) {
        const data = await response.json();
        successfullyAddedTruck = true;
        console.log("Truck added successfully:", data);
      }

      const newTruck = await response.json();
      setTrucks((prevTrucks) => [...prevTrucks, newTruck]);
      setLicense("");
      setPrice(0);
      setImage("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-8">Our trucks</h2>
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
      <div className="w-full h-30 justify"></div>
      <form onSubmit={handleAddTruck}>
        <h2 className="text-center text-2xl font-bold mb-8">Add a New Truck</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4 rounded shadow">
            <label htmlFor="license" className="text-lg font-bold">
              License:
            </label>
            <input
              type="text"
              id="license"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full h-10 border rounded px-2"
            />
            <label htmlFor="price" className="text-lg font-bold">
              Price per Day:
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-10 border rounded px-2"
            />
            <label htmlFor="image" className="text-lg font-bold">
              Image URL:
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full h-10 border rounded px-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Truck
        </button>
        {successfullyAddedTruck && (
          <p className="text-green-500 mt-2">Truck added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default TrucksPage;
