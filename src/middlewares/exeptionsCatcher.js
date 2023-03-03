exports.catchExeption = (err, req, res, next) => {
  const status = err.status || err.error?.statusCode || 500;
  const message = err.error?.message || "Server error, please try again";

  if (err) {
    return res.status(status).json({
      ok: false,
      data: null,
      status: status,
      message: message,
    });
  }
  next();
};
