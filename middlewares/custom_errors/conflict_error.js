const { AbstractError } = require('./abstract_error');

class conflictError extends AbstractError {
  statusCode = 409;
  defaultCustomMessage = 'resource exists';
  constructor(message, customMessage) {
    super(message);
  }

  // serializeErrors() {
  //   return {
  //     name: this.name,
  //     message: this.message,
  //     stack: this.stack,
  //     // any additional properties you want to include
  //   };
  // }
}

module.exports = conflictError;
