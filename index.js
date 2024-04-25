const express = require("express");
const userRoutes = require("./routes/UserRoutes.js");
const sequelize = require("./config/Sequlize.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cronjobs = require('./cron/Cron.js');
require("dotenv").config();
const port = process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const path = require("path");
const { I18n } = require("i18n");

const i18n = new I18n({
  locales: ["en", "hi"],
  directory: path.join(__dirname, "translation"),
  defaultLocale: "en",
});
app.use(i18n.init);
app.use(express.json());
app.use("/", userRoutes);
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
