const express = require("express");
const dotenv = require("dotenv");

// Ladataan ympäristömuuttujat config.env-tiedostosta
dotenv.config({ path: "./config/config.env" });

const app = express();

const PORT = process.env.PORT || 5000;

// Käynnistetään palvelin
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
