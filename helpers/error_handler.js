const logger = require("../services/logger_service");

const errorHandler = (res, error) => {
  // console.log(error);
  console.error(error);
  res.status(400).send({ error: error.message });
};

module.exports = {
  errorHandler,
};