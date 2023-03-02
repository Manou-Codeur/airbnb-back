const { verify } = require("jsonwebtoken");

const User = require("../models/user.model.js");
const { login } = require("../services/auth.service.js");
const sendRefreshTokenCookie = require("../utils/authUtils");
const { REFRESH_SECRET } = process.env;

let result = { ok: false, accessToken: null, message: null };

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const logResult = await login(email, password, res);
    res.send(logResult);
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = (req, res) => {
  const token = req.cookies._refresh_cookie;

  if (!token) {
    return res.status(403).json({
      ...result,
      message: "No token provided",
    });
  }

  let payload = null;
  try {
    payload = verify(token, REFRESH_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ ok: false, accessToken: "" });
  }

  User.findById(payload._id)
    .then((user) => {
      if (!user)
        return res.status(400).json({
          ok: false,
          accessToken: null,
          message: "User not found",
        });

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      sendRefreshTokenCookie(res, refreshToken);

      res.json({
        ok: true,
        accessToken: accessToken,
        roles: user.roles,
        userId: user._id,
        message: "Successfully logged in",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        ok: false,
        accessToken: null,
        message: err,
      });
    });
};

exports.logout = (req, res) => {
  sendRefreshTokenCookie(res, "");

  res.json({
    ...result,
    ok: true,
    accessToken: "",
    message: "Successfully logged out",
  });
};
