const express = require("express");
const {
  getAllGuests,
  getGuestById,
  addNewGuest,
  updateGuestById,
  deleteGuestById,
} = require("../controllers/guest.controller");

const router = express.Router();

router.get("/", getAllGuests);
router.get("/:id", getGuestById);
router.post("/create", addNewGuest);
router.patch("/update/:id", updateGuestById);
router.delete("/delete/:id", deleteGuestById);

module.exports = router;
