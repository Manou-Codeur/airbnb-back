const { startSession } = require("mongoose");

const PlaceType = require("../models/placeType.model");
const Place = require("../models/place.model");
const User = require("../models/user.model");

const result = {
  placeTypes: false,
  message: null,
};

exports.createPlaceType = (req, res) => {
  PlaceType.create(req.body)
    .then((placeType) => {
      res.json({
        ...result,
        message: "Successfully created a new place types",
        placeTypes: placeType,
      });
    })
    .catch((err) => res.status(500).send(err));
};

exports.getPlaceTypes = (req, res) => {
  PlaceType.find()
    .then((placeTypes) =>
      res.send({
        ...result,
        message: "Successfully fetched all place types",
        placeTypes: placeTypes,
      })
    )
    .catch((err) => res.status(500).send(err));
};

exports.getPlaceTypeById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ placeType: false, message: "Id not provided" });
  }

  PlaceType.findById(id)
    .then((placeType) => {
      if (!placeType)
        return res.status(404).send({
          message: `Place type with id: ${id} doesn't exist`,
          placeType: false,
        });
      return res.send({
        message: `Place type with id: ${id} successfully fetched`,
        placeType: placeType,
      });
    })
    .catch((err) => res.status(500).send(err));
};

exports.updatePlaceType = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ updated: false, placeType: false, message: "Id not provided" });
  }

  PlaceType.findByIdAndUpdate([id], req.body, { new: true }, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ updated: false, placeType: false, message: err });
    }

    res.json({
      updated: true,
      placeType: data,
      message: `Place type with id: ${id} successfully updated`,
    });
  });
};

exports.deletePlaceType = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ deleted: false, message: "Id not provided" });
  }

  // If a place with this type exists, then it can't be deleted
  Place.find({ type: id })
    .then((r) => {
      if (r.length > 0) {
        return res.status(400).json({
          deleted: false,
          message:
            "Cannot delete this place type, Places with this type already exist",
        });
      } else {
        PlaceType.findByIdAndRemove([id], {}, (err, data) => {
          if (err)
            return res.status(500).send({ deleted: false, message: err });
          return res.json({
            deleted: true,
            message: `Place type with id: ${id} successfully deleted`,
          });
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({ deleted: false, message: err });
    });
};

exports.createPlace = async (req, res) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const newPlace = await Place.create(
      [{ ...req.body, owner: res.locals._id }],
      { session }
    );
    await User.findByIdAndUpdate(
      [res.locals._id],
      { $push: { places: newPlace[0]._id } },
      { session }
    );

    // commit the changes if everything was successful
    await session.commitTransaction();
    return res.json({
      place: newPlace[0],
      message: "New place created successfully!",
    });
  } catch (err) {
    // this will roll back any changes made in the database
    await session.abortTransaction();
    console.log(err);
  } finally {
    // ending the session
    session.endSession();
  }
  return res.status(500).json({
    place: false,
    message: "Something bad happened, please try again",
  });
};

exports.getPlaces = (req, res) => {
  Place.find(
    {},
    {
      rate: {
        $divide: [
          { $sum: "$rating.rate" },
          {
            $cond: [
              { $eq: [{ $size: "$rating" }, 0] },
              1,
              { $size: "$rating" },
            ],
          },
        ],
      },
      title: 1,
      type: 1,
      owner: 1,
      pricing: 1,
      images: 1,
      capacity: 1,
      description: 1,
      address: 1,
    }
  )
    .populate("owner", "-password -isAdmin -places")
    .populate("type")
    .then((places) =>
      res.send({
        ...result,
        message: "Successfully fetched all places",
        places: places,
      })
    )
    .catch((err) => res.status(500).send(err));
};

exports.getUserPlaces = (req, res) => {
  const id = res.locals._id;

  if (!id) {
    return res.status(400).json({ place: false, message: "Id not provided" });
  }

  User.findById([id])
    .populate({ path: "places", populate: "type" })
    .then((user) => {
      if (!user)
        return res.status(404).json({
          place: false,
          message: `User with the id: ${id} doesn't exist`,
        });
      res.json({
        ...result,
        places: user.places,
        message: "Successfully fetched user's places",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ ...result, message: err, places: false });
    });
};

exports.getOwnPlaces = (req, res) => {
  User.findById([res.locals._id])
    .populate({ path: "places", populate: "type" })
    .then((user) => {
      if (!user)
        return res
          .status(500)
          .json({ place: false, message: `Something extremely bad happened` });
      res.json({
        ...result,
        places: user.places,
        message: "Successfully fetched user's places",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ ...result, message: err, places: false });
    });
};

exports.getPlaceById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ place: false, message: "Id not provided" });
  }

  Place.findById(id)
    .populate("owner", "-password")
    .populate("type")
    .then((place) => {
      if (!place)
        return res.status(404).json({
          place: false,
          message: `The place with the id: ${id} doesn't exist`,
        });
      return res.json({
        place: place,
        message: `Place with id: ${id} successfully fetched`,
      });
    })
    .catch((err) => res.status(500).json({ message: err, place: false }));
};

exports.updatePlace = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ updated: false, place: false, message: "Id not provided" });
  }

  Place.findByIdAndUpdate([id], req.body, { new: true }, (err, data) => {
    if (err)
      return res
        .status(500)
        .send({ updated: false, place: false, message: err });
    if (!data)
      return res.status(404).send({
        updated: false,
        place: false,
        message: `Place with id: ${id} doesn't exist`,
      });
    return res.json({
      updated: true,
      place: data,
      message: `Place with id: ${id} successfully updated`,
    });
  });
};

exports.deletePlace = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ updated: false, place: false, message: "Id not provided" });
  }

  const session = await startSession();
  session.startTransaction();

  try {
    const deletedPlace = await Place.findByIdAndDelete([id], { session });
    if (!deletedPlace)
      return res.status(404).send({
        deleted: false,
        message: `Place with id: ${id} doesn't exist`,
      });
    await User.findByIdAndUpdate(
      [deletedPlace.owner],
      { $pull: { places: deletedPlace._id } },
      { session }
    );

    // commit the changes if everything was successful
    await session.commitTransaction();
    return res.json({ deleted: true, message: "Place successfully deleted" });
  } catch (err) {
    // this will roll back any changes made in the database
    await session.abortTransaction();
    console.log(err);
  } finally {
    // ending the session
    session.endSession();
  }
  return res.status(500).json({
    place: false,
    message: "Something bad happened, please try again",
  });
};
