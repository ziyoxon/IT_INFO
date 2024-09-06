const express = require("express");
const {
  getAllDescriptionQAs,
  getDescriptionQAById,
  addNewDescriptionQA,
  updateDescriptionQAById,
  deleteDescriptionQAById,
} = require("../controllers/descriptionQA.controller");

const router = express.Router();

router.get("/", getAllDescriptionQAs);
router.get("/:id", getDescriptionQAById);
router.post("/create", addNewDescriptionQA);
router.patch("/update/:id", updateDescriptionQAById);
router.delete("/delete/:id", deleteDescriptionQAById);

module.exports = router;
