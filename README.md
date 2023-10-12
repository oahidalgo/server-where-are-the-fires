# Wildfire Geocoding Project

This project is a Node.js application that handles the geocoding of wildfire events using data from external sources, such as NASA's EONET API. Below are the steps for installing and configuring the project in your environment.

## Prerequisites

Make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/): JavaScript runtime platform.
- [npm](https://www.npmjs.com/): Node.js package manager.

## Installation

Install Dependencies:

Navigate to the project's root directory and install the dependencies using npm:
cd [DIRECTORY_NAME]
npm install

Configure Environment Variables:

Create a .env file in the project's root directory and configure the necessary environment variables. You can use the provided config.env file as a reference. Make sure to configure:

PORT: The port on which the application will run.
API_VERSION: The API version.
EONET_API_CLOSED_WF: The URL of the EONET API for wildfire events.
Other necessary environment variables.

Run the Application:

Start the application using the following command: npm run start:dev

The application will be accessible at http://localhost:3000 or the port you've configured.

Using the Application:

Access the wildfire geocoding functionality through the defined routes. Refer to the documentation provided in the corresponding files, such as wildfireRoutes.js and wildfireController.js, for more details on how to use the API.

File Structure
app.js: The main file that configures the Express application.
wildfireController.js: Controller for handling wildfire events and geocoding.
wildfireRoutes.js: Route definitions for accessing wildfire functionality.
wildfireService.js: Service responsible for data retrieval and geocoding.
AppError.js: Custom error class used in the application.
Other utility and configuration files.
