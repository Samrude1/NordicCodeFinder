const NodeGeocoder = require("node-geocoder");

// Käytetään OpenStreetMap / Nominatim -palvelua (ilmainen, ei vaadi API-keytä)
const options = {
  provider: "openstreetmap",
  httpAdapter: "https", // default
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
