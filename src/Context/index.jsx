import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [weather, setWeather] = useState({});
  const [values, setValues] = useState([]);
  const [place, setPlace] = useState("Yogyakarta");
  const [thisLocation, setLocation] = useState("");

  // Tambahkan fungsi untuk sinkronisasi dengan db.json
  const fetchFavoritesFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:5000/favorites");
      const dbFavorites = response.data;
      localStorage.setItem("favorites", JSON.stringify(dbFavorites));
      setFavorites(dbFavorites); // Perbarui state lokal
    } catch (error) {
      console.error("Gagal memuat data dari database:", error);
    }
  };

  // Panggil fungsi ini di dalam useEffect untuk sinkronisasi awal
  useEffect(() => {
    fetchFavoritesFromDB();
  }, []);

  // fetch api
  const fetchWeather = async () => {
    const options = {
      method: "GET",
      url: "https://visual-crossing-weather.p.rapidapi.com/forecast",
      params: {
        aggregateHours: "24",
        location: place,
        contentType: "json",
        unitGroup: "metric",
        shortColumnNames: 0,
      },
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
        "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      const thisData = Object.values(response.data.locations)[0];
      setLocation(thisData.address);
      setValues(thisData.values);
      setWeather(thisData.values[0]);
    } catch (e) {
      console.error(e);
      // if the api throws error.
      alert("Kota Tidak di Temukan");
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [place]);

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <StateContext.Provider
      value={{
        weather,
        setPlace,
        values,
        thisLocation,
        place,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
