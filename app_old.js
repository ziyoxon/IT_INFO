const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require("cookie-parser");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`, //.env.devolepment
});

const {
  expressWinstonLogger,
  expressWinstonErrorLogger,
} = require("./middleware/express_logger_middleware.js.js");

const logger = require("./services/logger_service.js");

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);

// console.log(config.get("secret"));

// levels
logger.log("info", "Oddiy logger"); // oddiy logda qanaqa leveldaligini yozib qo'yamin
logger.error("Error logger");
logger.debug("Debug logger");
logger.warn("Warn logger");
logger.info("Info logger");
// console.trace("Trace logger");
// console.table([1, 2, 3]);
// console.table([
//   ["Shokir", 22],
//   ["Nodir", 32],
//   ["Qodir", 23],
// ]);

const PORT = config.get("port") || 3030;

const mainRouter = require("./routes/index.routes.js");
const error_handling_middleware = require("./middleware/error_handling_middleware.js");


// process.on("uncaughtException", (exception) => {
//   console.log("uncaughtException:", exception);
//   // process.exit(1)
// });

// process.on("unhandledRejection", (reject) => {
//   console.log("unhandledRejection:", reject);
// });

const app = express();

app.use(express.json()); //parse JSON data

app.use(cookieParser()); // parse cookies from request headers

app.use(expressWinstonLogger); // logger

app.use("/api", mainRouter); // main Router assosiy route

app.use(expressWinstonErrorLogger); // error logger

app.use(error_handling_middleware); // Error Handling eng oxirida bo'lishi kerak

async function start() {
  try {
    await mongoose.connect(config.get("dbAtlasUri"));
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
