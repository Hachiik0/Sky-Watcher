import React from "react";
import { useNavigate } from "react-router-dom";

const FavoritesPage = ({ favorites, selectFavorite, removeFavorite }) => {
  const navigate = useNavigate();

  const handleViewWeather = (city) => {
    selectFavorite(city); // Set kota yang dipilih
    navigate("/"); // Arahkan ke halaman Home
  };

  return (
    <div className="w-full h-full flex flex-col items-center py-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Kota Favorite</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-400">Tidak ada kota favorit yang ditambahkan</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
          {favorites.map((city, index) => (
            <div
              key={index}
              className="bg-cyan-600 text-white p-4 rounded shadow-md flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold">{city}</h3>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleViewWeather(city)}
                  className="px-3 py-1 bg-green-500 rounded"
                >
                  Liat cuaca
                </button>
                <button
                  onClick={() => removeFavorite(city)}
                  className="px-3 py-1 bg-red-500 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
