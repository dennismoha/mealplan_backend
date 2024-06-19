// ValidationError definition
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 409;
    this.customMessage = this.customMessage || 'conflict';
  }
}

module.exports = { ValidationError };
