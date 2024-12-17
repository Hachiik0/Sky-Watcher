import React from "react";
import { useStateContext } from "../Context";

const Forecast = () => {
  const { values } = useStateContext();

  // Fungsi untuk mendapatkan nama hari dari tanggal
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { weekday: "long" }); // Bahasa Indonesia
  };

  return (
    <div className="w-full h-screen text-white px-8">
      <h1 className="font-bold text-3xl my-4">Ramalan Cuaca Mingguan</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {values?.slice(0, 7).map((curr, index) => (
          <div
            key={index}
            className="bg-cyan-400 p-4 rounded shadow-md w-[18rem] text-center"
          >
            <p className="font-bold text-xl">{getDayName(curr.datetime)}</p>
            <p className="text-lg">{curr.datetime}</p>
            <p className="text-lg font-semibold">{curr.temp}°C</p>
            <p>{curr.conditions}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
