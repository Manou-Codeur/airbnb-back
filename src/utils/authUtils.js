exports.authorized = (next) => (obj, args, ctx, opts) => {
  if (!ctx.res.locals._id) {
    throw new Error("Unauthorized");
  }
  return next(obj, args, ctx, opts);
};

module.exports = sendRefreshTokenCookie = (res, token) => {
  res.cookie("_refresh_cookie", token, {
    httpOnly: true,
    path: "/api/refreshToken",
    sameSite: "Strict",
    maxAge: 604800000,
  });
};
