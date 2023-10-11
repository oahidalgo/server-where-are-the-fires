const express = require("express");
const wildfireController = require("../controllers/wildfireController");
const router = express.Router();

//Unique route to get closed wildfire events
router.get("/", wildfireController.geocodeWildfireEvents);

module.exports = router;
