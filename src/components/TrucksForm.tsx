import React from "react";

type Props = {
  onTruckCreated: () => void;
};

const TrucksForm: React.FC<Props> = ({ onTruckCreated }) => {
  const [license, setLicense] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);
  const [image, setImage] = React.useState<string>("");
  const [truckCreated, setTruckCreated] = React.useState(false);

  const onCreateTruck = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/trucks/truck", {
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
        setLicense("");
        setPrice(0);
        setImage("");
        onTruckCreated();

        setTruckCreated(true);
        setTimeout(() => {
          setTruckCreated(false);
        }, 4000);
      }
    } catch (err: any) {
      // setError(err.message);
    }
  };

  return (
    <form
      className="bg-white px-6 space-y-3 py-8 shadow-sm rounded-lg w-xl mx-auto"
      onSubmit={onCreateTruck}
    >
      <div className="sm:col-span-4">
        <label
          htmlFor="license"
          className="block text-sm/6 font-medium text-gray-900"
        >
          License
        </label>
        <div className="mt-1">
          <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2">
            <input
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              type="text"
              name="license"
              id="license"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-4">
        <label
          htmlFor="price_per_day"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Price per day
        </label>
        <div className="mt-1">
          <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2">
            <input
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              type="number"
              name="price_per_day"
              id="price_per_day"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>
      </div>
      <div className="sm:col-span-4">
        <label
          htmlFor="image_url"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Image
        </label>
        <div className="mt-1">
          <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2">
            <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
              URL:
            </div>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              type="text"
              name="username"
              id="username"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-center gap-x-6">
        <button
          type="submit"
          className="rounded-md cursor-pointer ml-auto bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create truck
        </button>

        {truckCreated && (
          <p className="text-green-500 mt-2 text-center">
            Truck created successfully
          </p>
        )}
      </div>
    </form>
  );
};

export default TrucksForm;
