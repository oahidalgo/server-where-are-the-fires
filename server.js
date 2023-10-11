const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// Defining the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
