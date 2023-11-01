const axios = require("axios");
const isoCountries = require("../data/iso3166.json");
const AppError = require("../utils/appError");

// Var to store data in memory
let cachedWildfireEvents = null;

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

  //Calling EONET service
  const response = await axios.get(process.env.EONET_API_CLOSED_WF, { params });

  //Validating the response, the parent fn will be catch the error in case of it
  if (response.status != 200)
    throw new AppError(
      "An error ocurred while retrieving data from EONET API",
      500
    );

  const features = response.data.features;
  // Saving data in memory to not make multiple requests
  cachedWildfireEvents = features;

  return features;
}

// Geocodify coordinates for "Point" types
async function geocodePointFeature(feature) {
  const [lon, lat] = feature.geometry.coordinates;
  const apiUrl = `${process.env.MAPBOX_API_URL}${lon},${lat}.json`;
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;

  const params = {
    access_token: accessToken,
  };

  //Calling mapbox API to get features
  const response = await axios.get(apiUrl, { params });
  const mapFeatures = response.data.features;
  //Each features has inner objects that represent full address, country, city, state, etc.
  //We are only interested in country inner object
  const country = mapFeatures.find((feature) => feature.id.includes("country"));
  const countryCode = country
    ? getCountryCode(country?.place_name)
    : process.env.COUNTRY_NOT_FOUND_CODE;

  return {
    id: feature?.properties?.id || 0,
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
