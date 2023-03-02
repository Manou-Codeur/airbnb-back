const express = require("express");
const router = express.Router();

const {
  register,
  list,
  byId,
  update,
  remove,
  details,
} = require("../controllers/user.controller");
const { isAuth } = require("../middlewares/auth.middlware");
const {
  validation,
  checkIdentity,
} = require("../middlewares/expressValidators.middlware");

router.post("/users", checkIdentity, validation, register);
router.get("/users", isAuth, list);
router.get("/user", isAuth, details);
router.get("/users/:id", isAuth, byId);
router.put("/users/:id", isAuth, update);
router.delete("/users/:id", isAuth, remove);

module.exports = router;
