const axios = require("axios");
const isoCountries = require("../data/iso3166.json");

let cachedWildfireEvents = null; // Variable para almacenar los eventos de incendios forestales en memoria

async function fetchWildfireEvents() {
  //In case cachedWildFireEvents exists its not going to retrieve it from server again
  if (cachedWildfireEvents) {
    process.env.NODE_ENV === "development" && console.log("Using cache data.");
    return cachedWildfireEvents;
  }

  const params = {
    category: process.env.WILDFIRE_CATEGORY,
    status: process.env.WILDFIRE_STATUS,
  };

  const response = await axios.get(process.env.EONET_API_CLOSED_WF, { params });
  const features = response.data.features;
  // Almacena los datos en caché para futuras solicitudes
  cachedWildfireEvents = features;

  return features;
}

// Función para geocodificar un objeto Feature de tipo "Point" usando Mapbox
async function geocodePointFeature(feature) {
  const [lon, lat] = feature.geometry.coordinates;
  const apiUrl = `${process.env.MAPBOX_API_URL}${lon},${lat}.json`;
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;

  const params = {
    access_token: accessToken,
  };

  const response = await axios.get(apiUrl, { params });
  const mapFeatures = response.data.features;
  const country = mapFeatures.find((feature) => feature.id.includes("country"));
  const countryCode = getCountryCode(country?.place_name);

  return {
    title: feature?.properties?.title || "UNAVAILABLE",
    country: countryCode || process.env.COUNTRY_NOT_FOUND_CODE,
  };
}

async function geocodeMultiple(features) {
  const geocodedFeatures = await Promise.all(features.map(geocodePointFeature));
  return geocodedFeatures;
}

function removeSpecialCharactersAndToUpper(text) {
  return text.replace(/[^\w\s]/g, "").toUpperCase();
}

function getCountryCode(countryName) {
  const country = isoCountries.find(
    (country) =>
      removeSpecialCharactersAndToUpper(country.name) ===
      removeSpecialCharactersAndToUpper(countryName)
  );

  return country ? country.code : process.env.COUNTRY_NOT_FOUND_CODE;
}

module.exports = {
  fetchWildfireEvents,
  geocodeMultiple,
};
