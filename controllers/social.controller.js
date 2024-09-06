const { errorHandler } = require("../helpers/error_handler");
const { default: mongoose } = require("mongoose");
const Social = require("../schemas/Social");
const { socialValidation } = require("../validations/social_validation");

const addNewSocial = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { social_name, social_icon_file } = value;
    const newSocial = await Social({
      social_name,
      social_icon_file,
    });
    await newSocial.save();
    res.status(201).send({
      statusCode: 201,
      message: "New Sosial added successfully",
      data: newSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllSocials = async (req, res) => {
  try {
    const socials = await Social.find({});
    res.send({
      statusCode: 200,
      message: "All Socials fetched successfully",
      data: socials,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSocialById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid social ID",
      });
    }
    const social = await Social.findById(req.params.id);
    if (!social) {
      return res.status(404).send({
        statusCode: 404,
        message: "Sosyal topilmadi",
      });
    }
    res.send({
      statusCode: 200,
      message: "Social fetched successfully",
      data: social,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateSocialById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid social ID",
      });
    }
    const { error, value } = socialValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { social_name, social_icon_file } = value;
    const supdateSocial = await Social.findByIdAndUpdate(
      req.params.id,
      { social_name, social_icon_file },
      { new: true }
    );
    if (!supdateSocial) {
      return res.status(404).send({
        statusCode: 404,
        message: "Sosyal topilmadi",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Sosyal muvafiqatli o'zgartirildi",
      data: supdateSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSocialById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid social ID",
      });
    }
    const deletedSocial = await Social.findByIdAndDelete(req.params.id);
    if (!deletedSocial) {
      return res.status(404).send({
        statusCode: 404,
        message: "Social ID not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Social deleted successfully",
      data: deletedSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewSocial,
  getAllSocials,
  getSocialById,
  updateSocialById,
  deleteSocialById,
};
