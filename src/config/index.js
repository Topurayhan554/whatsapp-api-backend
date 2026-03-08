require("dotenv").config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 20,
  },

  whatsapp: {
    sessionPath: process.env.SESSION_PATH || "./sessions",
  },
};
