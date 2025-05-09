import React, { useEffect, useState } from "react";

import Calendar from '../components/Calendar';

const StringPage: React.FC = () => {
  const [result, setResult] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/trucks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setResult(data.result))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>String from Backend</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{result}</p>}
      <Calendar />
    </div>
  );
};

export default StringPage;
