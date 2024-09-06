const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Topic = require("../schemas/Topic");
const { topicValidation } = require("../validations/topic_validation");

const addNewTopic = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const {
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_approved,
      expert_id,
    } = value;
    const newTopic = await Topic({
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_approved,
      expert_id,
    });
    await newTopic.save();
    res.status(201).send({
      statusCode: 201,
      message: "New topic added successfully",
      data: newTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate({
      path: "author_id",
      select: "author_name",
    });
    res.status(200).send({
      statusCode: 200,
      message: "All topics fetched successfully",
      data: topics,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTopicById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid topic ID",
      });
    }
    const topic = await Topic.findById(req.params.id).populate({
      path: "author_id",
      select: "author_name",
    });
    if (!topic) {
      return res.status(404).send({
        statusCode: 404,
        message: "Topic not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Topic fetched successfully",
      data: topic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateTopicById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid topic ID",
      });
    }
    const { error, value } = topicValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_approved,
      expert_id,
    } = value;
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        author_id,
        topic_title,
        topic_text,
        created_date,
        updated_date,
        is_checked,
        is_approved,
        expert_id,
      },
      { new: true }
    );
    if (!updatedTopic) {
      return res.status(404).send({
        statusCode: 404,
        message: "Topic not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Topic updated successfully",
      data: updatedTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteTopicById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid topic ID",
      });
    }
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);
    if (!deletedTopic) {
      return res.status(404).send({
        statusCode: 404,
        message: "Topic not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Topic deleted successfully",
      data: deletedTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewTopic,
  getAllTopics,
  getTopicById,
  updateTopicById,
  deleteTopicById,
};
