const { verify } = require("jsonwebtoken");
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;
const User = require("../models/user.model");

exports.isAuth = (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, ACCESS_SECRET);
    res.locals._id = payload._id;
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }

  return next();
};

exports.isAdmin = (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, ACCESS_SECRET);

    User.findById(payload._id, ["-password"]);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }

  return next();
};

exports.isRefresh = (req, res, next) => {
  const token = req.cookies["_refresh_cookie"];

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }

  try {
    verify(token, REFRESH_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }

  return next();
};
