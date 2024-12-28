import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [weather, setWeather] = useState({});
  const [values, setValues] = useState([]);
  const [place, setPlace] = useState("Yogyakarta");
  const [thisLocation, setLocation] = useState("");
  const [favorites, setFavorites] = useState([]); // Menambahkan state untuk favorites

  // Fungsi untuk sinkronisasi dengan db.json dan localStorage
  const fetchFavoritesFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:5000/favorites");
      const dbFavorites = response.data;
      localStorage.setItem("favorites", JSON.stringify(dbFavorites)); // Menyimpan ke localStorage
      setFavorites(dbFavorites); // Memperbarui state favorites
    } catch (error) {
      console.error("Gagal memuat data dari database:", error);
    }
  };

  // Mengambil data favorites dari localStorage saat pertama kali dimuat
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites)); // Memperbarui state dengan data dari localStorage
    }
  }, []);

  // Panggil fungsi sinkronisasi db.json saat aplikasi dimuat
  useEffect(() => {
    fetchFavoritesFromDB();
  }, []);

  // Fungsi untuk mengambil data cuaca dari API
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
        favorites, // Menambahkan favorites ke dalam context
        setFavorites, // Menambahkan setFavorites ke dalam context
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
