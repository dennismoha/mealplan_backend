exports.userSignupValidator = (req, res, next) => {
  req.check('userEmail', 'Email connot be empty').notEmpty();
  req
    .check('userEmail', 'Email must be between 3 to 32 characters')
    // eslint-disable-next-line no-useless-escape
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 5,
      max: 32,
    });
  req.check('password', 'Password is required').notEmpty().trim();
  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');
  req
    .check('confirm_password')
    .isLength({ min: 6 })
    .withMessage('confirm_Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');
  req.assert('confirm_password', 'Passwords do not match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.userLoginValidator = (req, res, next) => {
  req
    .check('userEmail', 'Email must be between 3 to 32 characters')
    .notEmpty()
    .trim()
    .escape()
    // eslint-disable-next-line no-useless-escape
    .matches(/.+\@.+\..+/)
    .withMessage('provide a proper email')
    .isLength({
      min: 5,
      max: 32,
    });
  req.check('password', 'Password is required').notEmpty().trim();
  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');
  const errors = req.validationErrors();
  if (errors) {
    console.log('login errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
