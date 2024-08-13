const { StatusCodes } = require('http-status-codes');
const { AbstractError } = require('./abstract_error');
console.log('this page visited');
const errorHandler = (err, req, res, next) => {
  console.log('reached here!!!');
  if (err instanceof AbstractError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.log('err is ', err);
  return res.status(400).send({
    errors: { StatusCodes :StatusCodes.BAD_REQUEST,
      message :'Bad request.' }
  });
};

module.exports = errorHandler;
