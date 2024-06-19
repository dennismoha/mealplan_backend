const { AbstractError } = require('./abstract_error');
console.log('this page visited');
const errorHandler = (err, req, res, next) => {
  console.log('reached here');
  if (err instanceof AbstractError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.log('err is ', err);
  return res.status(400).send({
    errors: [{ message: 'something went wrong!!!' }]
  });
};

module.exports = errorHandler;
