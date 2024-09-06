const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Tag = require("../schemas/Tag");
const { tagValidation } = require("../validations/tag_validation");

const addNewTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { topic_id, category_id } = value;
    const newTag = await Tag({
      topic_id,
      category_id,
    });
    await newTag.save();
    res.status(201).send({
      statusCode: 201,
      message: "New tag added successfully",
      data: newTag,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate({
        path: "topic_id",
        select: "Topic",
      })
      .populate({
        path: "category_id",
        select: "Category",
      });
    res.status(200).send({
      statusCode: 200,
      message: "All tags fetched successfully",
      data: tags,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

const getTagById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid tag ID",
      });
    }
    const tag = await Tag.findById(req.params.id)
      .populate({
        path: "topic_id",
        select: "Topic",
      })
      .populate({
        path: "category_id",
        select: "Category",
      });
    if (!tag) {
      return res.status(404).send({
        statusCode: 404,
        message: "Tag not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Tag fetched successfully",
      data: tag,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

const updateTagById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid tag ID",
      });
    }
    const { error, value } = tagValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { topic_id, category_id } = value;
    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      { topic_id, category_id },
      { new: true }
    )
      .populate({
        path: "topic_id",
        select: "Topic",
      })
      .populate({
        path: "category_id",
        select: "Category",
      });
    if (!updatedTag) {
      return res.status(404).send({
        statusCode: 404,
        message: "Tag not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Tag updated successfully",
      data: updatedTag,
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

const deleteTagById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid tag ID",
      });
    }
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).send({
        statusCode: 404,
        message: "Tag not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Tag deleted successfully",
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

module.exports = {
  addNewTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById,
};
