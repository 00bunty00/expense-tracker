const sequelize = require("../config/db");
const PaymentMode = require("../models/paymentMode.model");
const ExpenseCategory = require("../models/category.model");

const seedData = async () => {
  try {
    // Disable FK checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await sequelize.sync({ force: true }); // or alter: true if needed

    // Enable FK checks again
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // Seed Payment Modes
    const paymentModes = [
      "Cash",
      "UPI/Net Banking",
      "Credit Card",
      "Debit Card",
    ];
    for (const name of paymentModes) {
      await PaymentMode.findOrCreate({ where: { name } });
    }

    // Seed Expense Categories
    const categories = [
      "Food",
      "Transport",
      "Health",
      "Utilities",
      "Education",
      "Entertainment",
      "Investment",
      "Shopping",
      "Bills",
      "Travel",
      "Rent",
      "Salary",
      "Others",
    ];
    for (const name of categories) {
      await ExpenseCategory.findOrCreate({ where: { name } });
    }

    console.log("✅ Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedData();
