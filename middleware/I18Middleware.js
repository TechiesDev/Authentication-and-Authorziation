const path = require("path");
const { I18n } = require("i18n");

const i18n = new I18n({
  locales: ["en", "hi"],
  directory: path.join(__dirname, "../translation"),
  defaultLocale: "en",
  objectNotation: true
});

module.exports ={i18n}