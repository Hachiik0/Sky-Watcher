import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import search from "./assets/icons/search.svg";
import Forecast from "./Pages/Forecast";
import FavoritesPage from "./Pages/Favorit";
import { useStateContext } from "./Context";
import { BackgroundLayout, WeatherCard } from "./Components";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // Mengatur state untuk kontrol menu
  const { weather, thisLocation, place, setPlace } = useStateContext();
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    return savedFavorites || [];
  });
  const [message, setMessage] = useState(""); // State untuk pesan
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  // Fungsi untuk menyimpan favorit ke localStorage dan db.json
  const saveFavorites = (favoritesData) => {
    // Simpan data favorit ke localStorage
    localStorage.setItem("favorites", JSON.stringify(favoritesData));

    // Simpan data favorit ke database (db.json)
    axios
      .put(`http://localhost:5000/favorites/${favoritesData.id}`, favoritesData)
      .then(() => {
        console.log("Data berhasil disimpan ke db.json");
      })
      .catch((error) => {
        console.error("Gagal menyimpan data ke database:", error);
      });
  };

  const submitCity = () => {
    setPlace(input);
    setInput("");
  };

  const addFavorite = async () => {
    console.log("thisLocation:", thisLocation); // Periksa nilai thisLocation
    console.log("favorites:", favorites); // Periksa daftar favorit saat ini

    if (thisLocation && !favorites.some((fav) => fav.name === thisLocation)) {
      const newFavorite = {
        id: new Date().getTime(), // Pastikan id valid
        name: thisLocation,
        location: thisLocation,
      };

      const newFavorites = [...favorites, newFavorite];

      try {
        // Mengirim data favorit baru ke server (db.json)
        await axios.post("http://localhost:5000/favorites", newFavorite);

        // Update state favorites setelah data berhasil ditambahkan
        setFavorites(newFavorites);

        // Simpan data favorit ke localStorage
        localStorage.setItem("favorites", JSON.stringify(newFavorites));

        // Tampilkan pesan sukses
        setMessage(
          `${thisLocation} berhasil ditambahkan ke daftar kota favorit!`
        );
        setIsModalOpen(true);
      } catch (error) {
        console.error("Gagal menambahkan data ke database:", error);
        setMessage("Terjadi kesalahan saat menambahkan ke favorit.");
        setIsModalOpen(true);
      }
    } else if (thisLocation) {
      setMessage(`${thisLocation} sudah ada di daftar favorit!`);
      setIsModalOpen(true);
    }
  };

  const removeFavorite = async (id) => {
    console.log("ID favorit yang akan dihapus:", id); // Periksa id yang akan dihapus
    console.log("Tipe data ID:", typeof id); // Memeriksa tipe data ID
    console.log("favorites sebelum dihapus:", favorites);

    // Jika id adalah objek, ambil id.id atau pastikan id tersebut adalah ID yang valid
    const favoriteId = id.id || id; // Mengambil id yang benar jika id adalah objek

    const newFavorites = favorites.filter((fav) => fav.id !== favoriteId);
    saveFavorites(newFavorites); // Menyimpan perubahan favorit

    try {
      await axios.delete(`http://localhost:5000/favorites/${favoriteId}`); // Menggunakan favoriteId yang benar
      setFavorites(newFavorites);
      setMessage("Kota berhasil dihapus!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Gagal menghapus data dari database:", error);
    }
  };

  const selectFavorite = (city) => {
    setPlace(city);
  };

  useEffect(() => {
    // Mengambil data favorit dari db.json saat pertama kali load
    axios
      .get("http://localhost:5000/favorites")
      .then((response) => {
        setFavorites(response.data);
        // Simpan data favorit ke localStorage
        localStorage.setItem("favorites", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Gagal mengambil data dari server:", error);
      });
  }, []);

  return (
    <Router>
      <div className="w-full h-screen text-white relative">
        <BackgroundLayout />

        {/* Navbar */}
        <nav className="w-full p-3 flex justify-between items-center px-4 sm:px-8 bg-cyan-400 shadow-md fixed top-0 z-10">
          <h1 className="font-bold tracking-wide text-3xl">Sky Watcher</h1>

          {/* Search bar */}
          <div className="bg-white w-full sm:w-[12rem] md:w-[15rem] lg:w-[20rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2">
            <img src={search} alt="search" className="w-[1.5rem] h-[1.5rem]" />
            <input
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  submitCity();
                }
              }}
              type="text"
              placeholder="Search city"
              className="focus:outline-none w-full text-[#212121] text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Menu navigation (Visible on Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="px-4 py-2 bg-blue-600 rounded">
              Home
            </Link>
            <Link to="/forecast" className="px-4 py-2 bg-blue-600 rounded">
              Ramalan
            </Link>
            <Link to="/favorites" className="px-4 py-2 bg-blue-600 rounded">
              Kota Favorit
            </Link>
          </div>

          {/* Hamburger menu icon for Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`text-3xl text-white transition-transform duration-300 transform ${
                menuOpen ? "rotate-45" : ""
              }`}
            >
              ☰ {/* Hamburger icon */}
            </button>
          </div>
        </nav>

        {/* Mobile Menu (Appears when menuOpen is true) */}
        <div
          className={`fixed inset-0 w-full bg-black bg-opacity-50 z-20 transition-all duration-300 transform ${
            menuOpen ? "translate-y-0" : "translate-y-full"
          } backdrop-blur-md`} // Glassmorphism effect with backdrop blur
        >
          <div className="flex flex-col items-center bg-white p-6 space-y-4 glassCard">
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 left-4 text-3xl text-black"
            >
              X {/* Close Button (X) */}
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-cyan-400 rounded my-2"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/forecast"
              className="px-4 py-2 bg-cyan-400 rounded my-2"
              onClick={() => setMenuOpen(false)}
            >
              Ramalan
            </Link>
            <Link
              to="/favorites"
              className="px-4 py-2 bg-cyan-400 rounded my-2"
              onClick={() => setMenuOpen(false)}
            >
              Kota Favorit
            </Link>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white text-black p-6 rounded shadow-lg text-center">
              <p>{message}</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-cyan-400 text-white rounded"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="pt-[5rem]">
          <Routes>
            <Route
              path="/"
              element={
                <main className="w-full flex flex-col items-center py-4 px-4 sm:px-10">
                  <WeatherCard
                    place={thisLocation}
                    windspeed={weather.wspd}
                    humidity={weather.humidity}
                    temperature={weather.temp}
                    heatIndex={weather.heatindex}
                    iconString={weather.conditions}
                    conditions={weather.conditions}
                    addFavorite={() => addFavorite(thisLocation)}
                  />
                </main>
              }
            />
            <Route path="/forecast" element={<Forecast />} />
            <Route
              path="/favorites"
              element={
                <FavoritesPage
                  favorites={favorites}
                  selectFavorite={selectFavorite}
                  removeFavorite={removeFavorite}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
