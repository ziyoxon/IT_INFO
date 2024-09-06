const express = require("express");
const {
  getAllTags,
  getTagById,
  addNewTag,
  updateTagById,
  deleteTagById,
} = require("../controllers/tag.controller");

const router = express.Router();

router.get("/", getAllTags);
router.get("/:id", getTagById);
router.post("/create", addNewTag);
router.patch("/update/:id", updateTagById);
router.delete("/delete/:id", deleteTagById);

module.exports = router;
