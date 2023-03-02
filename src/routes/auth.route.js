const express = require("express");
const router = express.Router();

const { isRefresh, isAuth } = require("../middlewares/auth.middlware");
const {
  loginUser,
  refreshToken,
  logout,
} = require("../controllers/auth.controller.js");

router.post("/auth/login", loginUser);
router.post("/refreshToken", isRefresh, refreshToken);
router.post("/logout", isAuth, logout);

module.exports = router;
