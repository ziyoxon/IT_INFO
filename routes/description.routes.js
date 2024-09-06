const express = require("express");
const {
  addNewDescription,
  getAllDescription,
  getDescriptionById,
  updateDescriptionById,
  deleteDescriptionById,
} = require("../controllers/description.controller");

const router = express.Router();

router.get("/", getAllDescription);
router.get("/:id", getDescriptionById);
router.post("/create", addNewDescription);
router.patch("/update/:id", updateDescriptionById);
router.delete("/delete/:id", deleteDescriptionById);

module.exports = router;
