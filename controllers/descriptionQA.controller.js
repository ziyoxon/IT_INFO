const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const DescriptionQA = require("../schemas/Description_QA");
const {
  descriptionQAValidation,
} = require("../validations/description_qa_validation");
const Question_Answer = require("../schemas/Question_Answer");

const addNewDescriptionQA = async (req, res) => {
  try {
    const { error, value } = descriptionQAValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { questio_answer_id, desciription_id } = value;
    const newQuestionAnswer = await Question_Answer({
      questio_answer_id,
      desciription_id,
    });
    await newQuestionAnswer.save();
    res.status(201).send({
      statusCode: 201,
      message: "New questio answer successfully",
      data: newQuestionAnswer,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllDescriptionQAs = async (req, res) => {
  try {
    const descriptionQAs = await DescriptionQA.find({})
      .populate({
        path: "questio_answer_id",
        select: "Question_Answer",
      })
      .populate({
        path: "desciription_id",
        select: "Description",
      });
    res.status(200).send({
      statusCode: 200,
      message: "Barcha descriptionQAs ro'yhati",
      data: descriptionQAs,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescriptionQAById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid descriptionQA ID",
      });
    }
    const descriptionQA = await DescriptionQA.findById(req.params.id)
      .populate({
        path: "questio_answer_id",
        select: "Question_Answer",
      })
      .populate({
        path: "desciription_id",
        select: "Description",
      });
    if (!descriptionQA) {
      return res.status(404).send({
        statusCode: 404,
        message: "DescriptionQA not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "DescriptionQA found successfully",
      data: descriptionQA,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDescriptionQAById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid descriptionQA ID",
      });
    }
    const { error, value } = descriptionQAValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { questio_answer_id, desciription_id } = value;
    const updatedDescriptionQA = await DescriptionQA.findByIdAndUpdate(
      req.params.id,
      { questio_answer_id, desciription_id },
      { new: true }
    )
      .populate({
        path: "questio_answer_id",
        select: "Question_Answer",
      })
      .populate({
        path: "desciription_id",
        select: "Description",
      });
    if (!updatedDescriptionQA) {
      return res.status(404).send({
        statusCode: 404,
        message: "DescriptionQA not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "DescriptionQA updated successfully",
      data: updatedDescriptionQA,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDescriptionQAById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid descriptionQA ID",
      });
    }
    const deletedDescriptionQA = await DescriptionQA.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDescriptionQA) {
      return res.status(404).send({
        statusCode: 404,
        message: "DescriptionQA not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "DescriptionQA deleted successfully",
      data: deletedDescriptionQA,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewDescriptionQA,
  getAllDescriptionQAs,
  getDescriptionQAById,
  updateDescriptionQAById,
  deleteDescriptionQAById,
};
