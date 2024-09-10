const app = require("./app");
const Logger = require("./utils/logger");
const mongoose = require("mongoose");

const { PORT } = require("./config");
const { MONGO_DB } = require("./config/app");

mongoose.connect(
  `${MONGO_DB}`
);

const server = app.listen(PORT, function () {
  Logger.info(`app running on ${PORT}`);
});

process.on("uncaughtException", (err) => {
  Logger.warn("Uncaught Exception!! Shutting down process..");
  Logger.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  Logger.warn("Unhandled Rejection!!" + err);
  // process.exit(1);
});

module.exports = server;
