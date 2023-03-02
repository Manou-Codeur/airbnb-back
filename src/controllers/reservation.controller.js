const Reservation = require("../models/reservation.model");

const result = {
  reservations: false,
  message: null,
};

exports.createReservation = (req, res) => {
  const data = { ...req.body, customer: res.locals._id };

  Reservation.create(data)
    .then((reservation) => {
      res.json({
        ...result,
        message: "Successfully created a new reservation",
        reservations: reservation,
      });
    })
    .catch((err) => res.status(500).send(err));
};

exports.getReservations = (req, res) => {
  Reservation.find()
    .populate("customer", ["email", "firstName", "lastName", "_id"])
    .populate("owner", ["email", "firstName", "lastName", "_id"])
    .populate("place", ["title", "_id"])
    .then((reservations) =>
      res.send({
        ...result,
        message: "Successfully fetched all Reservations",
        reservations: reservations,
      })
    )
    .catch((err) => res.status(500).send(err));
};

exports.getReservationById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ placeType: false, message: "Id not provided" });
  }

  Reservation.findById(id)
    .populate("customer", ["email", "firstName", "lastName", "_id"])
    .populate("place", ["title", "_id"])
    .then((reservation) => {
      if (!reservation)
        return res
          .status(404)
          .send({
            message: `Reservation with id: ${id} doesn't exist`,
            reservation: false,
          });
      return res.send({
        message: `Reservation with id: ${id} successfully fetched`,
        reservation: reservation,
      });
    })
    .catch((err) => res.status(500).send(err));
};

exports.getUserReservations = (req, res) => {
  const id = res.locals._id;

  if (!id) {
    return res
      .status(400)
      .json({ reservations: false, message: "Id not provided" });
  }

  Reservation.find({ customer: id })
    .populate("owner", ["email", "firstName", "lastName", "_id"])
    .populate("place", ["title", "_id"])
    .then((reservations) => {
      if (!reservations)
        return res
          .status(404)
          .send({ message: `Reservations not found`, reservations: false });
      return res.send({
        message: `Reservations for customer with id: ${res.locals._id} successfully fetched`,
        reservations: reservations,
      });
    })
    .catch((err) => res.status(500).send(err));
};

exports.getUserReservationsRequests = (req, res) => {
  const id = res.locals._id;

  if (!id) {
    return res
      .status(400)
      .json({ reservations: false, message: "Id not provided" });
  }

  Reservation.find({ owner: id })
    .populate("customer", ["email", "firstName", "lastName", "_id"])
    .populate("place", ["title", "_id"])
    .then((reservations) => {
      if (!reservations)
        return res
          .status(404)
          .send({ message: `Reservations not found`, reservations: false });
      return res.send({
        message: `Reservations for owner with id: ${res.locals._id} successfully fetched`,
        reservations: reservations,
      });
    })
    .catch((err) => res.status(500).send(err));
};

exports.updateReservation = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ updated: false, reservation: false, message: "Id not provided" });
  }

  Reservation.findByIdAndUpdate([id], req.body, { new: true }, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ updated: false, reservation: false, message: err });
    }

    res.json({
      updated: true,
      reservation: data,
      message: `Reservation with id: ${id} successfully updated`,
    });
  });
};

exports.deleteReservation = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ deleted: false, message: "Id not provided" });
  }

  Reservation.findByIdAndRemove([id], {}, (err, data) => {
    if (err) return res.status(500).send({ deleted: false, message: err });

    return res.json({
      deleted: true,
      message: `Reservation with id: ${id} successfully deleted`,
    });
  });
};
