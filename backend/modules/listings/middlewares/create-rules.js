const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const createListingRules = [
  body("jobCategory")
    .notEmpty()
    .withMessage("Job category is required")
    .isString()
    .withMessage("Job category must be a string")
    .trim(),

  body("platform")
    .notEmpty()
    .withMessage("Platform is required")
    .isString()
    .withMessage("Platform must be a string")
    .trim(),

  body("experienceLevel")
    .notEmpty()
    .withMessage("Experience level is required")
    .isIn(["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"])
    .withMessage("Experience level must be valid"),

  body("clientRegion")
    .notEmpty()
    .withMessage("Client region is required")
    .isString()
    .withMessage("Client region must be a string")
    .trim(),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isString()
    .withMessage("Payment method must be a string")
    .trim(),

  body("earningsUSD")
    .notEmpty()
    .withMessage("Earnings USD is required")
    .isFloat({ min: 0 })
    .withMessage("Earnings must be a positive number"),

  body("hourlyRate")
    .notEmpty()
    .withMessage("Hourly rate is required")
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  checkValidation,
];

module.exports = createListingRules;