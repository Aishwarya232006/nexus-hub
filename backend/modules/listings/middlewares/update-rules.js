const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const updateListingRules = [
  body("jobCategory")
    .optional()
    .isString()
    .withMessage("Job category must be a string")
    .trim(),

  body("platform")
    .optional()
    .isString()
    .withMessage("Platform must be a string")
    .trim(),

  body("experienceLevel")
    .optional()
    .isIn(["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"])
    .withMessage("Experience level must be valid"),

  body("clientRegion")
    .optional()
    .isString()
    .withMessage("Client region must be a string")
    .trim(),

  body("paymentMethod")
    .optional()
    .isString()
    .withMessage("Payment method must be a string")
    .trim(),

  body("earningsUSD")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Earnings must be a positive number"),

  body("hourlyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  checkValidation,
];

module.exports = updateListingRules;