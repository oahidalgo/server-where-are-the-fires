const geocodingService = require("../services/wildfireService.js");
const catchHandler = require("../utils/catchHandler");
const AppError = require("./../utils/appError");
const { parseMonth } = require("../utils/dateUtils");

exports.geocodeWildfireEvents = catchHandler(async (req, res, next) => {
  let { month, year } = req.query;

  //Mandatory params
  if (!month || !year) {
    return next(
      new AppError(
        "You should provide month and year to obtain wildfire events",
        400
      )
    );
  }

  //converting to 3 digit month
  month = parseMonth(month);
  //If user enters a non valid month
  if (month === -1) {
    return next(
      new AppError(
        `Invalid month '${month}'. Please provide a valid month. ("JAN","FEB","MAR"...)`,
        400
      )
    );
  }

  //If year is not a number, and its outside the "limits"
  if (
    isNaN(year) ||
    parseInt(year) < process.env.START_YEAR_LIMIT ||
    parseInt(year) > new Date().getFullYear()
  ) {
    return next(
      new AppError(
        `Invalid year. Please provide a valid year between '${
          process.env.START_YEAR_LIMIT
        } - ${new Date().getFullYear()}'`,
        400
      )
    );
  }

  // Get wildfire events from NASA EONET API
  const wildfireEvents = await geocodingService.fetchWildfireEvents();

  // Filter events by year/month
  const filteredEvents = wildfireEvents.filter((event) => {
    //If event has the "closed" property if will be filtered
    if (event.properties.closed) {
      const eventDate = new Date(event.properties.closed);
      return (
        eventDate.getUTCMonth() === month &&
        eventDate.getUTCFullYear() === parseInt(year)
      );
    }
    return false;
  });

  //Geocodification of events
  const geocodedEvents = await geocodingService.geocodeMultiple(filteredEvents);

  res.json(geocodedEvents);
});
