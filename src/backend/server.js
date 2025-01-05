import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Tambahkan ini

// Definisikan __dirname untuk modul ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path untuk file JSON yang menyimpan data favorit
const favoritesFilePath = path.join(__dirname, "db.json");

// Fungsi untuk membaca data favorit dari file db.json
const readFavorites = () => {
  try {
    if (!fs.existsSync(favoritesFilePath)) {
      fs.writeFileSync(
        favoritesFilePath,
        JSON.stringify({ favorites: [] }, null, 2)
      );
    }
    const data = fs.readFileSync(favoritesFilePath, "utf-8");
    return JSON.parse(data).favorites || [];
  } catch (error) {
    console.error("Gagal membaca file JSON:", error);
    return [];
  }
};

// Fungsi untuk menulis data favorit ke file db.json
const writeFavorites = (favorites) => {
  try {
    const data = { favorites };
    fs.writeFileSync(favoritesFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Gagal menulis file JSON:", error);
  }
};

// Mendapatkan semua favorit
app.get("/favorites", (req, res) => {
  try {
    const favorites = readFavorites();
    res.json(favorites);
  } catch (error) {
    res.status(500).send("Gagal mengambil data favorit");
  }
});

// Menambahkan favorit baru
app.post("/favorites", (req, res) => {
  const newFavorite = req.body;

  if (!newFavorite || !newFavorite.id || !newFavorite.location) {
    return res.status(400).send("Data favorit tidak valid");
  }

  const favorites = readFavorites();
  favorites.push(newFavorite);
  writeFavorites(favorites);

  res.status(201).json(newFavorite);
});

// Memperbarui favorit berdasarkan ID
app.put("/favorites/:id", (req, res) => {
  const { id } = req.params;
  const updatedFavorite = req.body;

  if (!updatedFavorite || isNaN(parseInt(id))) {
    return res.status(400).send("Favorit atau ID tidak valid");
  }

  const favorites = readFavorites();
  const favoriteIndex = favorites.findIndex(
    (fav) => fav.id === parseInt(id, 10)
  );

  if (favoriteIndex === -1) {
    return res.status(404).send("Favorite not found");
  }

  favorites[favoriteIndex] = {
    ...favorites[favoriteIndex],
    ...updatedFavorite,
  };
  writeFavorites(favorites);

  res.json(favorites[favoriteIndex]);
});

// Menghapus favorit berdasarkan ID
app.delete("/favorites/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.status(400).send("ID favorit tidak valid");
  }

  let favorites = readFavorites();
  const initialLength = favorites.length;
  favorites = favorites.filter((favorite) => favorite.id !== parseInt(id, 10));

  if (favorites.length === initialLength) {
    return res.status(404).send("Favorite not found");
  }

  writeFavorites(favorites);
  res.status(200).send("Favorite removed");
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
