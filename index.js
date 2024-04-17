const express = require("express");
const userRoutes = require("./routes/UserRoutes.js");
const sequelize = require("./confir/Sequlize.js");
const cookieParser = require('cookie-parser'); 
require('dotenv').config();
const port = 8080;



const app = express();
app.use(cookieParser()); 

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

