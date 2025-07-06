const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("email").isEmail().withMessage("Email must be valid"),

  check("username").notEmpty().withMessage("Username is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("monthlyLimit")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly limit must be a positive number"),

  check("dob")
    .optional()
    .isISO8601()
    .withMessage("DOB must be a valid date (YYYY-MM-DD)"),

  check("theme")
    .optional()
    .isBoolean()
    .withMessage("Theme must be true or false"),

  check("currency")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Currency must be a non-empty string"),

  // Custom middleware to handle result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

exports.profileValidator = [
  check("username")
    .optional()
    .isString()
    .withMessage("Username must be a string"),

  check("monthlyLimit")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly limit must be a positive number"),

  check("dob")
    .optional()
    .isISO8601()
    .withMessage("DOB must be a valid date (YYYY-MM-DD)"),

  check("theme")
    .optional()
    .isBoolean()
    .withMessage("Theme must be true or false"),

  check("currency")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Currency must be a non-empty string"),

  // handle result
  (req, res, next) => {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
