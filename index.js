const express = require("express");
const userRoutes = require("./routes/UserRoutes.js");
const {sequelize,dbConnection} = require("./config/Sequlize.js");
const bodyParser = require("body-parser");
const {i18n} = require("./middleware/I18Middleware.js")
const cookieParser = require("cookie-parser");
const cronjobs = require('./cron/Cron.js');
require("dotenv").config();
const port = process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(i18n.init);
app.use(express.json());
app.use("/", userRoutes);
dbConnection()
cronjobs;

sequelize
  .sync()
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
