const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const sendRefreshTokenCookie = require("../utils/authUtils");
const throwError = require("../utils/throwError");

exports.login = async (email, password, res) => {
  const user = await User.findOne({ email }, [
    "_id",
    "email",
    "password",
    "firstName",
    "lastName",
    "roles",
  ]);
  if (!user) throwError(404, "User not found");

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) throwError(400, "Invalid password");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  sendRefreshTokenCookie(res, refreshToken);

  return {
    ok: true,
    data: {
      accessToken: accessToken,
      roles: user.roles,
      userId: user._id,
    },
    status: 200,
    message: "Successfully logged in",
  };
};
