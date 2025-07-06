const { User } = require("../models");

exports.getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.userId, {
    attributes: [
      "id",
      "email",
      "username",
      "monthlyLimit",
      "dob",
      "theme",
      "currency",
      "createdAt",
    ],
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // comes from auth middleware
    const updates = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update(updates);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        email: user.email,
        username: user.username,
        monthlyLimit: user.monthlyLimit,
        dob: user.dob,
        theme: user.theme,
        currency: user.currency,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
