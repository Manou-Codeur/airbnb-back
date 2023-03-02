module.exports = (status, message) => {
  throw { status: status, error: new Error(message) };
};
