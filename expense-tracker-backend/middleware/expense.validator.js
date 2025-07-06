const { body, param } = require("express-validator");
const { ExpenseCategory } = require("../models");
const { PaymentMode } = require("../models");

exports.validateAddExpenses = [
  body().isArray().withMessage("Payload must be an array of expenses").bail(),
  body("*.title").isString().notEmpty().withMessage("Title is required").bail(),
  body("*.amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number > 0")
    .bail(),
  body("*.date")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format")
    .bail(),

  // body("*.category").isIn(ALLOWED_CATEGORIES).withMessage("Invalid category"),
  body("*.categoryId")
    .isUUID()
    .withMessage("Invalid categoryId format")
    .bail()
    .custom(async (value) => {
      const exists = await ExpenseCategory.findByPk(value);
      if (!exists) {
        throw new Error("Category does not exist");
      }
      return true;
    }),

  body("*.paymentModeId")
    .optional()
    .isUUID()
    .withMessage("Invalid paymentModeId format")
    .bail()
    .custom(async (value) => {
      const exists = await PaymentMode.findByPk(value);
      if (!exists) {
        throw new Error("Payment mode does not exist");
      }
      return true;
    }),
];

exports.validateGetExpenses = [
  body("sortBy")
    .optional()
    .isIn(["date", "amount"])
    .withMessage("Invalid sortBy field"),
  body("order")
    .optional()
    .isIn(["ASC", "DESC", "asc", "desc"])
    .withMessage("Invalid order value"),
  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("Invalid categoryId format")
    .custom(async (value) => {
      const exists = await ExpenseCategory.findByPk(value);
      if (!exists) {
        throw new Error("Category does not exist");
      }
      return true;
    }),
  body("paymentModeId")
    .optional()
    .isUUID()
    .withMessage("Invalid paymentModeId format")
    .custom(async (value) => {
      const exists = await PaymentMode.findByPk(value);
      if (!exists) {
        throw new Error("Payment mode does not exist");
      }
      return true;
    }),
  body("startDate")
    .optional()
    .custom((value) => {
      if (value === "") return true;
      return !isNaN(Date.parse(value));
    })
    .withMessage("Invalid startDate"),

  body("endDate")
    .optional()
    .custom((value) => {
      if (value === "") return true;
      return !isNaN(Date.parse(value));
    })
    .withMessage("Invalid endDate"),
  body("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  body("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

exports.validateUpdateExpense = [
  param("id").isUUID().withMessage("Invalid expense ID"),
  body("title").optional().isString().notEmpty().withMessage("Invalid title"),
  body("amount").optional().isFloat({ gt: 0 }).withMessage("Invalid amount"),
  body("date").optional().isISO8601().withMessage("Invalid date"),

  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("Invalid categoryId format")
    .bail()
    .custom(async (value) => {
      const exists = await ExpenseCategory.findByPk(value);
      if (!exists) throw new Error("Category does not exist");
      return true;
    }),

  body("paymentModeId")
    .optional()
    .isUUID()
    .withMessage("Invalid paymentModeId format")
    .bail()
    .custom(async (value) => {
      const exists = await PaymentMode.findByPk(value);
      if (!exists) throw new Error("Payment mode does not exist");
      return true;
    }),
];

exports.validateDeleteExpense = [
  param("id").isUUID().withMessage("Invalid expense ID"),
];
