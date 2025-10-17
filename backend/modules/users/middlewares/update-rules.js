const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const updateUserRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("experienceLevel")
    .optional()
    .isIn(["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"])
    .withMessage("Experience level must be valid"),

  body("hourlyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  body("jobSuccessRate")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Job success rate must be between 0 and 100"),

  body("region")
    .optional()
    .isString()
    .withMessage("Region must be a string")
    .trim(),

  checkValidation,
];

module.exports = updateUserRules;