import React from "react";
import { useDate } from "../Utils/useDate";
import sun from "../assets/icons/sun.png";
import cloud from "../assets/icons/cloud.png";
import fog from "../assets/icons/fog.png";
import rain from "../assets/icons/rain.png";
import snow from "../assets/icons/snow.png";
import storm from "../assets/icons/storm.png";
import wind from "../assets/icons/windy.png";
import "../index.css";

const getWeatherIcon = (iconString) => {
  if (!iconString) return sun;

  const lowerCaseString = iconString.toLowerCase();
  if (lowerCaseString.includes("cloud")) return cloud;
  if (lowerCaseString.includes("rain")) return rain;
  if (lowerCaseString.includes("clear")) return sun;
  if (lowerCaseString.includes("thunder")) return storm;
  if (lowerCaseString.includes("fog")) return fog;
  if (lowerCaseString.includes("snow")) return snow;
  if (lowerCaseString.includes("wind")) return wind;

  return sun; // Default icon
};

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconString,
  conditions,
  addFavorite,
}) => {
  const icon = getWeatherIcon(iconString);
  const { time } = useDate();

  return (
    <div className="w-[22rem] min-w-[22rem] h-[30rem] glassCard p-4 relative">
      {/* Tombol Add Favorite */}
      <button
        onClick={() => {
          if (place) addFavorite();
        }}
        className="absolute top-4 right-4 bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
        title="Add to Favorites"
      >
        +
      </button>

      <div className="flex w-full items-center gap-4 mt-12 mb-4">
        <img src={icon} alt="weather_icon" />
        <p className="font-bold text-5xl flex justify-center items-center">
          {temperature} &deg;C
        </p>
      </div>
      <p className="font-bold text-center text-xl">{place}</p>
      <div className="w-full flex justify-between items-center mt-4">
        <p className="flex-1 text-center p-2">{new Date().toDateString()}</p>
        <p className="flex-1 text-center p-2">{time}</p>
      </div>
      <div className="w-full flex justify-between items-center mt-4 gap-4">
        <div className="flex-1 text-center p-2 font-bold bg-cyan-400 shadow rounded-lg">
          Wind Speed <span className="font-normal">{windspeed} km/h</span>
        </div>
        <div className="flex-1 text-center p-2 font-bold rounded-lg bg-cyan-400">
          Humidity <span className="font-normal">{humidity} gm/m&#179;</span>
        </div>
      </div>
      <div className="w-full p-3 mt-4 flex justify-between items-center">
        <p className="font-semibold text-lg">Heat Index</p>
        <p className="text-lg">{heatIndex ? heatIndex : "N/A"}</p>
      </div>
      <hr className="bg-slate-600" />
      <div className="w-full p-4 flex justify-center items-center text-3xl font-semibold">
        {conditions}
      </div>
    </div>
  );
};

export default WeatherCard;
