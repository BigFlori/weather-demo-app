const PORT = 8000;
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.VITE_KEY}&lang=hu`
    );

    if (!response.ok) {
      res.send("Weather API hiba történt.");
    }

    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
