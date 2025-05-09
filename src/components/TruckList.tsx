type Truck = {
  level: string;
  image: string;
  license: string;
  price_per_day: number;
  id: number;
};

const TruckList: React.FC<{
  trucks: Truck[];
}> = ({ trucks }) => {
  return (
    <section className="mt-12">
      <h2 className="text-base font-semibold text-gray-900">
        Available trucks
      </h2>
      <ol className="mt-2 divide-y divide-gray-200 text-sm/6 text-gray-500">
        {trucks.map((truck) => (
          <li className="py-4 sm:flex items-center" key={truck.id}>
            <img src={truck.image} alt={truck.license} className="w-20" />
            <p className="w-28 ml-6 mt-2 flex-auto sm:mt-0">
              €{truck.price_per_day},- per day
            </p>
            <p className="flex-none font-semibold text-gray-900">
              {truck.license}
            </p>
            <p className="flex-none ml-6 w-20 text-right">{truck.level}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default TruckList;
