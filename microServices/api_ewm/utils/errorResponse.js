class ErrorResponse extends Error {
  constructor(message, statusCode, internalCode = 9999) {
    super(message);
    this.statusCode = statusCode;
    this.internalCode = internalCode;
  }
}

module.exports = ErrorResponse;
