const { AbstractError } = require('./abstract_error');

class databaseError extends AbstractError {
  statusCode = 500;
  defaultCustomMessage = 'Something went wrong exists';
  constructor(message, customMessage) {
    super(message);
  }
}

module.exports = databaseError;
