const express = require("express");
const {
  getAllQuestionAnswers,
  getQuestionAnswerById,
  addNewQuestionAnswer,
  deleteQuestionAnswerById,
  updateQuestionAnswerById,
} = require("../controllers/questionAnswer.controller");

const router = express.Router();

router.get("/", getAllQuestionAnswers);
router.get("/:id", getQuestionAnswerById);
router.post("/create", addNewQuestionAnswer);
router.patch("/update/:id", updateQuestionAnswerById);
router.delete("/delete/:id", deleteQuestionAnswerById);

module.exports = router;
