const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require("cookie-parser");
const exHbs = require("express-handlebars");

const viewRouter = require("./routes/view.routes.js")

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`, //.env.devolepment
});

const {
  expressWinstonLogger,
  expressWinstonErrorLogger,
} = require("./middleware/express_logger_middleware.js");

const PORT = config.get("port") || 3030;

const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./middleware/error_handling_middleware");

const app = express();

app.use(express.json()); //parse JSON data

app.use(cookieParser()); // parse cookies from request headers

// expess-handlebars
const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));

app.use(expressWinstonLogger); // logger

app.use("/", viewRouter) // frontend

app.use("/api", mainRouter); // beckend main Router assosiy route

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
