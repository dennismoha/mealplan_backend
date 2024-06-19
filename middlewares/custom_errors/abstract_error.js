//

class AbstractError extends Error {
  constructor(message) {
    super(message);
    // Ensure the abstract class is not instantiated directly
    if (this.constructor === AbstractError) {
      throw new Error('Abstract class cannot be instantiated directly.');
    }

    // Set the name of the error to the name of the concrete subclass
    this.name = this.constructor.name;

    // Capture the stack trace for debugging purposes
    Error.captureStackTrace(this, this.constructor);
  }

  // Method to serialize the error to a standardized format
  serializeErrors() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
      // any additional properties you want to include
    };
  }
}

module.exports = { AbstractError };
