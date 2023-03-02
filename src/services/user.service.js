const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

exports.getAll = async () => {
  return User.find({}, "-password")
    .then((data) => data)
    .catch((err) => {
      console.log(err);
      return false;
    });
};

exports.getById = async (id) => {
  return User.findById(id, "-password")
    .then((data) => data)
    .catch((err) => {
      console.log(err);
      return false;
    });
};

exports.removeUser = async (id) => {
  return User.findByIdAndRemove(id)
    .then((data) => data)
    .catch((err) => {
      console.log(err);
      return false;
    });
};

exports.updateUser = async (id, data) => {
  const updatedUser = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: bcrypt.hashSync(data.password),
  };
  return User.findByIdAndUpdate(id, updatedUser, { new: true })
    .then((data) => {
      return {
        updated: true,
        user: data,
        message: `User with id: ${id} successfully updated`,
      };
    })
    .catch((err) => {
      return {
        updated: false,
        user: null,
        message: `Couldn't updated user with id: ${id}, please try again`,
      };
    });
};
