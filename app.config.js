const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const appJson = require("./app.json");

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
      SUPABASE_URL: process.env.SUPABASE_URL ?? "",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? "",
      SENTRY_DSN: process.env.SENTRY_DSN ?? "",
      RECIPE_API_KEY: process.env.RECIPE_API_KEY ?? "",
    },
  },
};
