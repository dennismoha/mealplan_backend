const { AbstractError } = require("./abstract_error");

class BadRequestError extends AbstractError {
  statusCode = 400;
  defaultCustomMessage = 'Bad request. The request body is missing required fields or contains invalid data.';
  constructor(message, customMessage) {
    super(message);
  }


}

module.exports = BadRequestError;
