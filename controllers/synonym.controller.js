const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Synonym = require("../schemas/Synonym");
const { synonymValidation } = require("../validations/synonym_validation");

const addNewSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { description_id, dictionary_id } = value;
    const newSynonym = await Synonym({
      description_id,
      dictionary_id,
    });
    await newSynonym.save();
    res.status(201).send({
      satatusCode: 201,
      message: "New Synonym created successfully",
      data: newSynonym,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllSynonyms = async (req, res) => {
  try {
    const synonyms = await Synonym.find()
      .populate({
        path: "description_id",
        select: "Description",
      })
      .populate({
        path: "dictionary_id",
        select: "Dictionary",
      });
    res.status(200).send({
      ststusCode: 200,
      message: "Get All Synonyms",
      data: synonyms,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSynonymById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid synonym ID",
      });
    }
    const synonym = await Synonym.findById(req.params.id)
      .populate({
        path: "description_id",
        select: "Description",
      })
      .populate({
        path: "dictionary_id",
        select: "Dictionary",
      });
    if (!synonym) {
      return res.status(404).send({
        statusCode: 404,
        message: "Synonym not found",
      });
    }
    res.status(200).send({
      ststusCode: 200,
      message: "Get Synonym By Id",
      data: synonym,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateSynonymById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid synonym ID",
      });
    }
    const { error, value } = synonymValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { description_id, dictionary_id } = value;
    const updatedSynonym = await Synonym.findByIdAndUpdate(
      req.params.id,
      { description_id, dictionary_id },
      { new: true }
    )
      .populate({
        path: "description_id",
        select: "Description",
      })
      .populate({
        path: "dictionary_id",
        select: "Dictionary",
      });
    if (!updatedSynonym) {
    return res.status(404).send({
      statusCode: 404,
      message: "Synonym not found",
    });
    }
    res.status(200).send({
      ststusCode: 200,
      message: "Deleted Synonym Successfully",
      data: updatedSynonym,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSynonymById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid synonym ID",
      });
    }
    const deletedSynonym = await Synonym.findByIdAndDelete(req.params.id);
    if (!deletedSynonym) {
      return res.status(404).send({
        statusCode: 404,
        message: "Synonym not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Synonym deleted successfully",
      data: deletedSynonym,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewSynonym,
  getAllSynonyms,
  getSynonymById,
  updateSynonymById,
  deleteSynonymById,
};
