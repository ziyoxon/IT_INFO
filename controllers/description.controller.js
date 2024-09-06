const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Description = require("../schemas/Description");
const { descriptionValidation } = require("../validations/description_validation");

const addNewDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.boyd);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { category_id, description } = value;
    const newDescription = await Description({
      category_id,
      description,
    });
    await newDescription.save();
    res.status(201).send({
      statusCode: 201,
      message: "Yangi discription qo'shildi",
      data: newDescription,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllDescription = async (req, res) => {
  try {
    const descriptions = await Description.find().populate({
      path:"category_id",
      select:"category_name -_id"
  });
    res.status(200).send({
      statusCode: 200,
      message: "Descriptions fetched successfully",
      data: descriptions,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescriptionById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid description ID",
      });
    }
    const description = await Description.findById(req.params.id).populate(
      "category_id",
      "-_id"
    );
    if (!description) {
      return res.status(404).send({
        statusCode: 404,
        message: "Description not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Description fetched successfully",
      data: description,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDescriptionById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid description ID",
      });
    }
    const { category_id, description } = req.body;
    const updatedDescription = await Description.findByIdAndUpdate(
      req.params.id,
      { category_id, description },
      { new: true }
    ).populate("category_id", "-_id");
    if (!updatedDescription) {
      return res.status(404).send({
        statusCode: 404,
        message: "Description not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Description updated successfully",
      data: updatedDescription,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDescriptionById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid description ID",
      });
    }
    const description = await Description.findByIdAndDelete(req.params.id);
    if (!description) {
      return res.status(404).send({
        statusCode: 404,
        message: "Description not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Description deleted successfully",
      data: description,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewDescription,
  getAllDescription,
  getDescriptionById,
  updateDescriptionById,
  deleteDescriptionById,
};
