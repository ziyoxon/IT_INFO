const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Question_Answer = require("../schemas/Question_Answer");
const {
  questionAnswerValidation,
} = require("../validations/question_answer_validation");

const addNewQuestionAnswer = async (req, res) => {
  try {
    const { error, value } = questionAnswerValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const {
      question,
      answer,
      created_date,
      updated_date,
      is_checked,
      user_id,
      expert_id,
    } = value;
    const newQuestionAnswer = await Question_Answer({
      question,
      answer,
      created_date,
      updated_date,
      is_checked,
      user_id,
      expert_id,
    });
    await newQuestionAnswer.save();
    res.status(201).send({
      statusCode: 201,
      message: "Question and answer added successfully",
      data: newQuestionAnswer,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllQuestionAnswers = async (req, res) => {
  try {
    const questionAnswers = await Question_Answer.find({});
    res.send({
      statusCode: 200,
      message: "All question and answer fetched successfully",
      data: questionAnswers,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getQuestionAnswerById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid question and answer ID",
      });
    }
    const questionAnswer = await Question_Answer.findById(req.params.id)
      .populate({
        path: "user_id",
        select: "name -_id",
      })
      .populate({
        path: "expert_id",
        select: "name -_id",
      });
    if (!questionAnswer) {
      return res.status(404).send({
        statusCode: 404,
        message: "Question and answer not found",
      });
    }
    res.send({
      statusCode: 200,
      message: "Question and answer fetched successfully",
      data: questionAnswer,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateQuestionAnswerById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid question and answer ID",
      });
    }
    const { error, value } = questionAnswerValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const {
      question,
      answer,
      created_date,
      updated_date,
      is_checked,
      user_id,
      expert_id,
    } = value;
    const updatedQuestionAnswer = await Question_Answer.findByIdAndUpdate(
      req.params.id,
      {
        question,
        answer,
        created_date,
        updated_date,
        is_checked,
        user_id,
        expert_id,
      },
      { new: true }
    )
      .populate({
        path: "user_id",
        select: "name -_id",
      })
      .populate({
        path: "expert_id",
        select: "name -_id",
      });
    if (!updatedQuestionAnswer) {
      return res.status(404).send({
        statusCode: 404,
        message: "Question and answer not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Question and answer updated successfully",
      data: updatedQuestionAnswer,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteQuestionAnswerById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid question and answer ID",
      });
    }
    const deletedQuestionAnswer = await Question_Answer.findByIdAndDelete(
      req.params.id
    );
    if (!deletedQuestionAnswer) {
      return res.status(404).send({
        statusCode: 404,
        message: "Question and answer not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Question and answer deleted successfully",
      data: deletedQuestionAnswer,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewQuestionAnswer,
  getAllQuestionAnswers,
  getQuestionAnswerById,
  updateQuestionAnswerById,
  deleteQuestionAnswerById,
};
