const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const DescriptionTopic = require("../schemas/Description_Topic");
const {
  descriptionTopicValidation,
} = require("../validations/description_topic_validation");

const addNewDescriptionTopic = async (req, res) => {
  try {
    const { error, value } = descriptionTopicValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { description_id, topic_id } = value;
    const newDescriptionTopic = await DescriptionTopic({
      description_id,
      topic_id,
    });
    await newDescriptionTopic.save();
    res.status(201).send({
      statusCode: 201,
      message: "New Dedscription topic created successfully",
      data: newDescriptionTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllDescriptionTopics = async (req, res) => {
  try {
    const descriptionTopics = await DescriptionTopic.find({})
      .populate({
        path: "description_id",
        select: "Description",
      })
      .populate({
        path: "topic_id",
        select: "Topic",
      });
    res.status(200).send({
      statusCode: 200,
      message: "All Description topics",
      data: descriptionTopics,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescriptionTopicById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Description topic ID",
      });
    }
    const descriptionTopic = await DescriptionTopic.findById(req.params.id)
      .populate({
        path: "description_id",
        select: "Description",
      })
      .populate({
        path: "topic_id",
        select: "Topic",
      });
    if (!descriptionTopic) {
      return res.status(404).send({
        statusCode: 404,
        message: "Description topic not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Description topic found",
      data: descriptionTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDescriptionTopicById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Description topic ID",
      });
    }
    const { error, value } = descriptionTopicValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { description_id, topic_id } = value;
    const updatedDescriptionTopic = await DescriptionTopic.findByIdAndUpdate(
      req.params.id,
      { description_id, topic_id },
      { new: true }
    )
      .populate({
        path: "description_id",
        select: "Description",
      })
      .populate({
        path: "topic_id",
        select: "Topic",
      });
    if (!updatedDescriptionTopic) {
      return res.status(404).send({
        statusCode: 404,
        message: "Description topic not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Description topic updated successfully",
      data: updatedDescriptionTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDescriptionTopicById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid descriptio topic ID",
      });
    }
    const deletedDescripyionTopic = await DescriptionTopic.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDescripyionTopic) {
      return res.status(404).send({
        statusCode: 404,
        message: "+ not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Descriptio topic deleted successfully",
      data: deletedDescripyionTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addNewDescriptionTopic,
  getAllDescriptionTopics,
  getDescriptionTopicById,
  updateDescriptionTopicById,
  deleteDescriptionTopicById,
};
