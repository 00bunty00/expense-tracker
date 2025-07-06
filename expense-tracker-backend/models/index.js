const sequelize = require("../config/db");
const User = require("./user.model");
const Expense = require("./expense.model");
const PaymentMode = require("./paymentMode.model");
const ExpenseCategory = require("./category.model");

module.exports = {
  sequelize,
  User,
  Expense,
  PaymentMode,
  ExpenseCategory,
};
