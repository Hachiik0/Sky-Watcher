import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import search from "./assets/icons/search.svg";
import Forecast from "./Pages/Forecast";
import { useStateContext } from "./Context";
import { BackgroundLayout, WeatherCard } from "./Components";

function App() {
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // State untuk menu
  const { weather, thisLocation, place, setPlace } = useStateContext();

  const submitCity = () => {
    setPlace(input);
    setInput("");
  };

  return (
    <Router>
      <div className="w-full h-screen text-white relative">
        {/* Background layout tetap ada di seluruh halaman */}
        <BackgroundLayout />

        {/* Navbar */}
        <nav className="w-full p-3 flex justify-between items-center px-8 bg-cyan-400 shadow-md fixed top-0 z-10">
          <h1 className="font-bold tracking-wide text-3xl">Sky Watcher</h1>

          {/* Kolom pencarian dengan ukuran responsif */}
          <div className="bg-white w-full sm:w-[12rem] md:w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2">
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

          {/* Tombol Hamburger di layar kecil */}
          <button
            className="sm:hidden text-white text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Menu Navigasi - Menyembunyikan di perangkat kecil */}
          <div
            className={`flex flex-col sm:flex-row sm:block gap-4 sm:flex ${
              menuOpen ? "block" : "hidden"
            }`}
          >
            <Link to="/" className="px-4 py-2 bg-blue-600 rounded">
              Home
            </Link>
            <Link to="/forecast" className="px-4 py-2 bg-blue-600 rounded">
              Forecast
            </Link>
          </div>
        </nav>

        <div className="pt-[5rem]">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <main className="w-full flex flex-col items-center py-4 px-4 sm:px-10">
                    <WeatherCard
                      place={thisLocation}
                      windspeed={weather.wspd}
                      humidity={weather.humidity}
                      temperature={weather.temp}
                      heatIndex={weather.heatindex}
                      iconString={weather.conditions}
                      conditions={weather.conditions}
                    />
                  </main>
                </>
              }
            />
            <Route path="/forecast" element={<Forecast />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
