const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const PaymentMode = require("./paymentMode.model");
const ExpenseCategory = require("./category.model");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "ExpenseCategories",
      key: "id",
    },
  },
  // category: {
  //   type: DataTypes.ENUM(
  //     "Food",
  //     "Transport",
  //     "Health",
  //     "Utilities",
  //     "Education",
  //     "Entertainment",
  //     "Investment",
  //     "Shopping",
  //     "Bills",
  //     "Travel",
  //     "Rent",
  //     "Salary",
  //     "Others"
  //   ),
  //   allowNull: false,
  // },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  paymentModeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "PaymentModes",
      key: "id",
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

PaymentMode.hasMany(Expense, { foreignKey: "paymentModeId" });
Expense.belongsTo(PaymentMode, {
  foreignKey: "paymentModeId",
  as: "paymentMode",
});

ExpenseCategory.hasMany(Expense, { foreignKey: "categoryId" });
Expense.belongsTo(ExpenseCategory, {
  foreignKey: "categoryId",
  as: "category",
});

module.exports = Expense;
