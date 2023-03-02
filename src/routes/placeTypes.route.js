const express = require("express");
const router = express.Router();

const {
  createPlaceType,
  updatePlaceType,
  getPlaceTypeById,
  getPlaceTypes,
  deletePlaceType,
} = require("../controllers/place.controller");
const { isAdmin, isAuth } = require("../middlewares/auth.middlware");

router.post("/placeTypes", isAdmin, isAuth, createPlaceType);
router.get("/placeTypes", getPlaceTypes);
router.get("/placeTypes/:id", getPlaceTypeById);
router.put("/placeTypes/:id", isAdmin, isAuth, updatePlaceType);
router.delete("/placeTypes/:id", isAdmin, isAuth, deletePlaceType);

module.exports = router;
