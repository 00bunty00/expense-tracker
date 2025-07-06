const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monthlyLimit: {
    type: DataTypes.FLOAT,
    allowNull: true, // optional
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true, // optional
  },
  theme: {
    type: DataTypes.BOOLEAN,
    allowNull: true, // optional (e.g. true = dark mode)
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "INR",
  },
});

module.exports = User;
