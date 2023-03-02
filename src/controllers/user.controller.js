const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const sendRefreshTokenCookie = require("../utils/authUtils");

const userService = require("../services/user.service");

const result = {
  users: false,
  message: null,
};

// Create a new user
exports.register = (req, res) => {
  const body = req.body;

  const newUser = new User({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: bcrypt.hashSync(body.password),
  });

  newUser
    .save()
    .then((user) => {
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      sendRefreshTokenCookie(res, refreshToken);
      res.json({
        ok: true,
        accessToken: accessToken,
        message: "New user successfully created",
      });
    })
    .catch((err) => {
      res.status(500).send({
        ok: false,
        accessToken: false,
        message: err,
      });
    });
};

// Update User
exports.update = (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!id) {
    return res.status(400).json({
      user: false,
      message: "Id not provided",
    });
  }

  const updatedUser = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: bcrypt.hashSync(body.password),
  };

  User.findByIdAndUpdate(id, updatedUser, { new: true }, (err, data) => {
    if (err) {
      return res.status(500).send({
        update: false,
        message: err,
      });
    }
    if (!data)
      return res
        .status(404)
        .send({
          updated: false,
          place: false,
          message: `User with id: ${id} doesn't exist`,
        });

    res.json({
      updated: true,
      user: data,
      message: `User with id: ${id} successfully updated`,
    });
  });
};

// Find all users
exports.list = async (req, res) => {
  let data;
  try {
    data = await userService.getAll();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ...result, message: "Error, something bad happened" });
  }

  if (!data)
    return res
      .status(500)
      .json({ ...result, message: "Error, something bad happened" });

  res.send({
    ...result,
    users: data,
    message: "Find all successfully executed",
  });
};

// Find one by id
exports.byId = async (req, res) => {
  const { id } = req.params;
  let data;
  try {
    data = await userService.getById(id);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ...result, message: "Error, something bad happened" });
  }

  if (!data)
    return res
      .status(404)
      .send({
        updated: false,
        place: false,
        message: `User with id: ${id} doesn't exist`,
      });

  res.send({
    ...result,
    users: data,
    message: "Find by id successfully executed",
  });
};

// Get details of user through token
exports.details = async (req, res) => {
  let data;
  try {
    data = await userService.getById(res.locals._id);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ user: false, message: "Error, something bad happened" });
  }

  if (!data)
    return res
      .status(404)
      .send({
        updated: false,
        place: false,
        message: `User with id: ${id} doesn't exist`,
      });

  res.send({ user: data, message: "Getting details successfully executed" });
};

// Delete User
exports.remove = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      deleted: false,
      message: "Id not provided",
    });
  }

  User.findByIdAndRemove(id, (err, data) => {
    if (err) {
      return res.status(500).send({
        deleted: false,
        message: err,
      });
    }
    if (!data)
      return res
        .status(404)
        .send({
          updated: false,
          place: false,
          message: `User with id: ${id} doesn't exist`,
        });

    res.json({
      deleted: true,
      message: `User with id: ${id} successfully deleted`,
    });
  });
};
