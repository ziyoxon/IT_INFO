const express = require("express");
const {
  getAllDescriptionTopics,
  getDescriptionTopicById,
  addNewDescriptionTopic,
  updateDescriptionTopicById,
  deleteDescriptionTopicById,
} = require("../controllers/descriptionTopic.controller");

const router = express.Router();

router.get("/", getAllDescriptionTopics);
router.get("/:id", getDescriptionTopicById);
router.post("/create", addNewDescriptionTopic);
router.patch("/update/:id", updateDescriptionTopicById);
router.delete("/delete/:id", deleteDescriptionTopicById);

module.exports = router;
