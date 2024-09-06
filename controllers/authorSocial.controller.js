const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Author_Social = require("../schemas/Author_Social");
const {
  authorSocialValidation,
} = require("../validations/author_social_validation");

const addNewAuthorSocial = async (req, res) => {
  try {
    const { error, value } = authorSocialValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { author_id, social_id, social_link } = value;
    const newAuthorSocial = await Author_Social({
      author_id,
      social_id,
      social_link,
    });
    await newAuthorSocial.save();
    res.status(201).send({
      statusCode: 201,
      message: "Author Social added successfully",
      data: newAuthorSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAuthorSocials = async (req, res) => {
  try {
    const authorSocials = await Author_Social.find({})
      .populate({
        path: "author_id",
        select: "Author",
      })
      .populate({
        path: "social_id",
        select: "Social",
      });
    res.status(200).send({
      statusCode: 200,
      message: "All Author Socials fetched successfully",
      data: authorSocials,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthorSocialById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Author Social ID",
      });
    }
    const authorSocial = await Author_Social.findById(req.params.id)
      .populate({
        path: "author_id",
        select: "Author",
      })
      .populate({
        path: "social_id",
        select: "Social",
      });
    if (!authorSocial) {
      return res.status(404).send({
        statusCode: 404,
        message: "Author Social not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Author Social fetched successfully",
      data: authorSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthorSocialById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Author Social ID",
      });
    }
    const existingAuthorId = req.params.id;
    const updateData = req.body;
    const { error, value } = authorSocialValidation(
      req.body,
      { author_id: existingAuthorId },
      { $set: updateData },
      { upsert: true, new: true }
    );
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { author_id, social_id, social_link } = value;
    const updatedAuthorSocial = await Author_Social.findByIdAndUpdate(
      req.params.id,
      {
        author_id,
        social_id,
        social_link,
      },
      { new: true }
    )
      .populate({
        path: "author_id",
        select: "Author",
      })
      .populate({
        path: "social_id",
        select: "Social",
      });
    if (!updatedAuthorSocial) {
      return res.status(404).send({
        statusCode: 404,
        message: "Author Social not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Author Social updated successfully",
      data: updatedAuthorSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthorSocialById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Author Social ID",
      });
    }
    const deletedAuthorSocial = await Author_Social.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAuthorSocial) {
      return res.status(404).send({
        statusCode: 404,
        message: "Author Social not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Author Social deleted successfully",
      data: deletedAuthorSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewAuthorSocial,
  getAllAuthorSocials,
  getAuthorSocialById,
  updateAuthorSocialById,
  deleteAuthorSocialById,
};
