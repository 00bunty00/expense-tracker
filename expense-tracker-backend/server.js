const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const expenseRoutes = require("./routes/expense.routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running ✅"));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes);
// Sync DB
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("MySQL DB connected and models synced 🎉");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
