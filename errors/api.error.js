class ApiError extends Error {
  constructor(status, message) {
    super(); // Katta error JS o'zini errori
    this.status = status;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }

  static unautorized(message) {
    return new ApiError(401, message);
  }

  static internalServerError(message) {
    return new ApiError(500, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static unprocessableEntity(message) {
    return new ApiError(422, message);
  }

  static tooManyRequests(message) {
    return new ApiError(429, message);
  }
}

module.exports = ApiError;
