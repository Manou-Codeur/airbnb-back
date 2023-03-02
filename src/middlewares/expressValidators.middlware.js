const { body, validationResult } = require("express-validator");

exports.checkAuth = [
  body("email").isEmail().withMessage("Email not valid"),
  body("password")
    .isStrongPassword({
      minLength: 5,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password not valid"),
];

exports.checkIdentity = [
  body("firstName")
    .isAlphanumeric()
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("First name can't be empty or exceeding 50 characters")
    .notEmpty(),
  body("lastName")
    .isAlphanumeric()
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("Last name can't be empty or exceeding 50 characters")
    .notEmpty(),
];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
