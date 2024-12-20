import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import search from "./assets/icons/search.svg";
import Forecast from "./Pages/Forecast";
import FavoritesPage from "./Pages/Favorit"; // Import FavoritesPage
import { useStateContext } from "./Context";
import { BackgroundLayout, WeatherCard } from "./Components";

function App() {
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // Mengatur state untuk kontrol menu
  const { weather, thisLocation, place, setPlace } = useStateContext();
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState(""); // State untuk pesan
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const submitCity = () => {
    setPlace(input);
    setInput("");
  };

  const addFavorite = () => {
    if (!favorites.includes(thisLocation) && thisLocation) {
      setFavorites([...favorites, thisLocation]);
      setMessage(`${thisLocation} berhasil ditambahkan ke daftar favorit!`);
      setIsModalOpen(true); // Tampilkan modal
    } else if (thisLocation) {
      setMessage(`${thisLocation} sudah ada di daftar favorit!`);
      setIsModalOpen(true); // Tampilkan modal
    }
  };

  const removeFavorite = (city) => {
    setFavorites(favorites.filter((fav) => fav !== city));
  };

  const selectFavorite = (city) => {
    setPlace(city);
  };

  return (
    <Router>
      <div className="w-full h-screen text-white relative">
        {/* Background layout */}
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
              onClick={() => setMenuOpen(!menuOpen)} // Toggle menu on click
              className={`text-white text-3xl transition-all duration-300 transform ${
                menuOpen ? "rotate-45" : ""
              }`}
            >
              {menuOpen ? "X" : "☰"} {/* Toggle between hamburger and X */}
            </button>
          </div>
        </nav>

        {/* Mobile Menu (Appears when menuOpen is true) */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
            <div className="flex flex-col items-center bg-white p-6 rounded-t-3xl animate-slide-in">
              <Link
                to="/"
                className="px-4 py-2 bg-blue-600 rounded my-2"
                onClick={() => setMenuOpen(false)} // Close the menu on click
              >
                Home
              </Link>
              <Link
                to="/forecast"
                className="px-4 py-2 bg-blue-600 rounded my-2"
                onClick={() => setMenuOpen(false)} // Close the menu on click
              >
                Ramalan
              </Link>
              <Link
                to="/favorites"
                className="px-4 py-2 bg-blue-600 rounded my-2"
                onClick={() => setMenuOpen(false)} // Close the menu on click
              >
                Kota Favorit
              </Link>
              {/* Close button (just the "X") */}
              <button
                onClick={() => setMenuOpen(false)} // Close the menu on button click
                className="mt-4 text-3xl text-black"
              >
                X
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white text-black p-6 rounded shadow-lg text-center">
              <p>{message}</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
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
