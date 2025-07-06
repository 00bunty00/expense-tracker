const { Expense } = require("../models");
const { Op } = require("sequelize");
const { Parser } = require("json2csv");
const csvParser = require("csv-parser");
const ExpenseCategory = require("../models/category.model");
const PaymentMode = require("../models/paymentMode.model");

exports.addExpenses = async (req, res) => {
  try {
    // const { title, amount, category, date } = req.body;
    const expenses = req.body;
    const userId = req.userId;

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res
        .status(400)
        .json({ message: "Expenses must be a non-empty array" });
    }

    const expensesToCreate = expenses.map((expense) => ({
      title: expense.title,
      amount: expense.amount,
      categoryId: expense.categoryId,
      date: expense.date,
      paymentModeId: expense.paymentModeId ?? "Cash",
      userId,
    }));

    const createdExpenses = await Expense.bulkCreate(expensesToCreate);
    res.status(201).json({
      message: "Expense added successfully",
      expenses: createdExpenses,
    });
  } catch (err) {
    console.error("Add Expenses Error:", err);
    if (
      err.name === "SequelizeDatabaseError" ||
      err.name === "SequelizeValidationError"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid input - check category or mode of payment" });
    }
    res.status(500).json({ message: "Failed to add expenses" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const {
      title,
      categoryId,
      paymentModeId,
      startDate,
      endDate,
      sortBy = "date",
      order = "DESC",
      page = 1,
      limit = 10,
    } = req.body;

    const offset = (page - 1) * limit;
    const userId = req.userId;
    const whereClause = { userId };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    if (paymentModeId) {
      whereClause.paymentModeId = paymentModeId;
    }

    // Fuzzy search on title
    if (title) {
      whereClause.title = {
        [Op.like]: `%${title}%`, // case-insensitive in most DBs like MySQL
      };
    }

    // Date filtering
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: endDate,
      };
    }

    const { rows: expenses, count: total } = await Expense.findAndCountAll({
      where: whereClause,
      include: [
        { model: PaymentMode, as: "paymentMode", attributes: ["name"] },
        { model: ExpenseCategory, as: "category", attributes: ["name"] },
      ],
      order: [[sortBy, order.toUpperCase()]],
      offset,
      limit,
    });

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      expenses,
    });
  } catch (err) {
    console.error("Get Expense Error:", err);
    res.status(500).json({ message: "Failed to fetch expense" });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const expense = await Expense.findOne({
      where: { id, userId: req.userId },
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    await expense.update(updateFields);
    res.json({ message: "Expense updated successfully", expense });
  } catch (err) {
    console.error("Update Expense Error:", err);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOne({
      where: { id, userId: req.userId },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

exports.exportExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.userId },
      order: [["date", "DESC"]],
    });

    const fields = ["title", "amount", "category", "date", "paymentMode"];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses.map((e) => e.toJSON()));

    res.header("Content-Type", "text/csv");
    res.attachment("expenses.csv");
    return res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ message: "Failed to export expenses" });
  }
};

exports.importExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const results = [];

    const stream = req.file.buffer
      .toString("utf-8")
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");

    const bufferStream = require("stream").Readable.from([stream]);

    bufferStream
      .pipe(csvParser())
      .on("data", (row) => {
        results.push({
          title: row.title,
          amount: parseFloat(row.amount),
          categoryId: row.categoryId,
          date: row.date,
          paymentModeId: row.paymentModeId ?? "Cash",
          userId,
        });
      })
      .on("end", async () => {
        await Expense.bulkCreate(results);
        res.json({
          message: "Expenses imported successfully",
          count: results.length,
        });
      });
  } catch (err) {
    console.error("CSV Import Error:", err);
    res.status(500).json({ message: "Failed to import expenses" });
  }
};
