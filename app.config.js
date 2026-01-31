const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const appJson = require("./app.json");

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
    },
  },
};
