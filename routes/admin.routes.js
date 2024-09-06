const express = require("express");
const {
  getAllAdmins,
  getAdminById,
  addNewAdmin,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logOutAdmin,
  refreshTokenAdmin,
  adminActivate,
} = require("../controllers/admin.controller");

const router = express.Router();
const adminPolise = require("../middleware/admin_police"); // guard qo'riqchi
const adminRolePolice = require("../middleware/admin_role_police"); // admin rollari


router.get("/", adminPolise, getAllAdmins);
router.get("/:id", adminRolePolice(["READ"]), getAdminById);
router.get("/activate/:link", adminActivate);
router.post("/create", addNewAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logOutAdmin);
router.post("/refresh", refreshTokenAdmin);
router.patch("/update/:id", updateAdminById);
router.delete("/delete/:id", deleteAdminById);

module.exports = router;
