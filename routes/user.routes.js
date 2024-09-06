const express = require("express");
const {
  getAllUsers,
  getUserById,
  addNewUser,
  updateUserById,
  deleteUserById,
  loginUser,
  logOutUser,
  refreshTokenUser,
  userActivate,
} = require("../controllers/user.controller");

const router = express.Router();
const userPolise = require("../middleware/user_police"); // guard qo'riqchi
const userRolesPolice = require("../middleware/user_role_police");


router.get("/", userPolise, getAllUsers);
router.get("/:id", userRolesPolice(["READ"]), getUserById);
router.get("/activate/:link", userActivate);
router.post("/create", addNewUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/refresh", refreshTokenUser);
router.patch("/update/:id", updateUserById);
router.delete("/delete/:id", deleteUserById);

module.exports = router;
