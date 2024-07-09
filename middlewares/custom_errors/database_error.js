const { AbstractError } = require('./abstract_error');
const { StatusCodes } = require('http-status-codes');

class databaseError extends AbstractError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  defaultCustomMessage = 'Something went wrong exists';
  constructor(message, customMessage) {
    super(message);
  }
}

module.exports = databaseError;
