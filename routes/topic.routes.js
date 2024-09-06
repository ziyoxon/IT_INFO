const express = require("express");
const { getAllTopics, getTopicById, addNewTopic, updateTopicById, deleteTopicById } = require("../controllers/topic.controller");


const router = express.Router();

router.get("/", getAllTopics);
router.get("/:id", getTopicById);
router.post("/create", addNewTopic);
router.patch("/update/:id", updateTopicById);
router.delete("/delete/:id", deleteTopicById);

module.exports = router;
