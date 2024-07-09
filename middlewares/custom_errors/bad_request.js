const { StatusCodes } = require("http-status-codes");
const { AbstractError } = require("./abstract_error");

class BadRequestError extends AbstractError {
  statusCode = StatusCodes.BAD_REQUEST;
  defaultCustomMessage = 'Bad request. The request body is missing required fields or contains invalid data.';
  constructor(message, customMessage) {
    super(message);
  }


}

module.exports = BadRequestError;
