import React, { useEffect, useState } from "react";
import { useStateContext } from "../Context";
import sun from "../assets/icons/sun.png";
import cloud from "../assets/icons/cloud.png";
import fog from "../assets/icons/fog.png";
import rain from "../assets/icons/rain.png";
import snow from "../assets/icons/snow.png";
import storm from "../assets/icons/storm.png";
import wind from "../assets/icons/windy.png";

const Forecast = () => {
  const { values } = useStateContext();

  // Fungsi untuk mendapatkan nama hari dari tanggal
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { weekday: "long" });
  };

  // Fungsi untuk memilih ikon berdasarkan kondisi cuaca
  const getWeatherIcon = (conditions) => {
    if (conditions.toLowerCase().includes("cloud")) {
      return cloud;
    } else if (conditions.toLowerCase().includes("rain")) {
      return rain;
    } else if (conditions.toLowerCase().includes("clear")) {
      return sun;
    } else if (conditions.toLowerCase().includes("thunder")) {
      return storm;
    } else if (conditions.toLowerCase().includes("fog")) {
      return fog;
    } else if (conditions.toLowerCase().includes("snow")) {
      return snow;
    } else if (conditions.toLowerCase().includes("wind")) {
      return wind;
    } else {
      return sun; // Default icon
    }
  };

  return (
    <div className="w-full h-screen text-white px-8">
      <h1 className="font-bold text-3xl my-4 text-center">
        Ramalan Cuaca Mingguan
      </h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {values?.slice(0, 7).map((curr, index) => (
          <div
            key={index}
            className="w-[22rem] min-w-[22rem] h-[30rem] glassCard p-4 flex flex-col items-center justify-between"
          >
            {/* Ikon cuaca */}
            <img
              src={getWeatherIcon(curr.conditions)}
              alt="weather_icon"
              className="w-[6rem] h-[6rem] my-4"
            />

            {/* Informasi utama */}
            <div className="text-center">
              <p className="font-bold text-xl">{getDayName(curr.datetime)}</p>
              <p className="text-lg">{curr.datetime}</p>
              <p className="text-5xl font-semibold mt-4">{curr.temp}°C</p>
              <p className="text-lg mt-2">{curr.conditions}</p>
            </div>

            {/* Detail tambahan */}
            <div className="w-full flex justify-between items-center mt-4 gap-4">
              <div className="flex-1 text-center p-2 font-bold bg-cyan-400 shadow rounded-lg">
                Max Temp <span className="font-normal">{curr.max_temp}°C</span>
              </div>
              <div className="flex-1 text-center p-2 font-bold rounded-lg bg-cyan-400">
                Min Temp <span className="font-normal">{curr.min_temp}°C</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
