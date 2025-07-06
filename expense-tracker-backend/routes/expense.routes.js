const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const authenticate = require("../middleware/auth.middleware");
const {
  validateAddExpenses,
  validateGetExpenses,
  validateUpdateExpense,
  validateDeleteExpense,
} = require("../middleware/expense.validator");
const validateResult = require("../middleware/validateResult");
const upload = require("../middleware/upload.middleware");

router.post(
  "/AddExpenses",
  authenticate,
  validateAddExpenses,
  validateResult,
  expenseController.addExpenses
);

router.post(
  "/GetExpenses",
  authenticate,
  validateGetExpenses,
  validateResult,
  expenseController.getExpenses
);

router.patch(
  "/updateExpense/:id",
  authenticate,
  validateUpdateExpense,
  validateResult,
  expenseController.updateExpense
);

router.delete(
  "/deleteExpense/:id",
  authenticate,
  validateDeleteExpense,
  validateResult,
  expenseController.deleteExpense
);

router.get("/export", authenticate, expenseController.exportExpenses);

router.post(
  "/import",
  authenticate,
  upload.single("file"),
  expenseController.importExpenses
);

module.exports = router;
