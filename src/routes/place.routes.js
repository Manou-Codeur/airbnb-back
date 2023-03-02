const express = require("express");
const router = express.Router();

const {
  createPlace,
  getPlaces,
  getUserPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} = require("../controllers/place.controller");
const { isAuth, isAdmin } = require("../middlewares/auth.middlware");

router.post("/places", isAuth, createPlace);
router.get("/places", getPlaces);
router.get("/userPlaces", isAuth, getUserPlaces);
router.get("/ownPlaces", isAuth, getUserPlaces);
router.get("/places/:id", getPlaceById);
router.put("/place/:id", isAuth, updatePlace);
router.delete("/place/:id", isAdmin, isAuth, deletePlace);

module.exports = router;
