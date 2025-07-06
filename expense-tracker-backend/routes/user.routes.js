const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const {
  userValidator,
  profileValidator,
} = require("../middleware/user.validator");

router.get("/profile", authenticate, userController.getUserProfile);

router.patch(
  "/profile",
  authenticate,
  profileValidator,
  userController.updateUserProfile
);

module.exports = router;
