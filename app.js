const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const AppError = require("./src/utils/appError");
const app = express();

// Import route modules
const routes = require("./src/routes/wildfireRoutes");
const globalErrorHandler = require("./src/controllers/errorController");

dotenv.config({ path: "./config.env" });
const apiVersion = process.env.API_VERSION;

// Set security http headers to mitigate attacks against sec.
app.use(helmet());

// Middleware to log HTTP requests in development mode.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from the same API
const limiter = rateLimit({
  max: process.env.MAX_REQUESTS_IP,
  windowMs: process.env.MAX_REQUEST_MINUTES * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

// Parse data from a URL-encoded form
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cors());

// Data sanitization against XSS (Cross-Site Scripting)
app.use(xss());

// Prevent parameter pollution using a whitelist to allow duration param
app.use(
  hpp({
    whitelist: ["month", "year"],
  })
);

// Mounting the wildfireRouter middleware on the specific path
app.use(`/api/${apiVersion}/wildfires`, routes);

// If a route was not found, a JSON response will be thrown
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

// Export the configured Express app
module.exports = app;
