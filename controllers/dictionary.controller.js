const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../schemas/Dictionary");
const {
  dictionaryValidation,
} = require("../validations/dictionary_validation");

const addNewTerm = async (req, res) => {
  try {
    const { error, value } = dictionaryValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { term } = value;
    const dict = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });
    if (dict) {
      return res.status(400).send({
        statusCode: 400,
        message: "Bunday termin mavjud",
      });
    }
    const newDictionary = await Dictionary.create({
      term,
      letter: term[0],
    });

    res.status(201).send({
      statusCode: 201,
      message: "New Dictionary added successfully",
      data: newDictionary,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllDictionarys = async (req, res) => {
  try {
    const dictionarys = await Dictionary.find({});
    res.status(200).send({
      statusCode: 200,
      message: "All dictionaries fetched successfully",
      data: dictionarys,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDictionaryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid dictionary ID",
      });
    }
    const dictionary = await Dictionary.findById(req.params.id);
    if (!dictionary) {
      return res.status(404).send({
        statusCode: 404,
        message: "Dictionary not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Dictionary fetched successfully",
      data: dictionary,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDictionaryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid dictionary ID",
      });
    }
    const { error, value } = dictionaryValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { term } = value;
    const dict = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });
    if (dict) {
      return res.status(400).send({
        statusCode: 400,
        message: "Bunday termin mavjud",
      });
    }
    const dictionary = await Dictionary.findByIdAndUpdate(
      req.params.id,
      { term, letter: term[0] },
      { new: true }
    );
    if (!dictionary) {
      return res.status(404).send({
        statusCode: 404,
        message: "Dictionary not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Dictionary updated successfully",
      data: dictionary,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDictionaryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid dictionary ID",
      });
    }
    const { id } = req.params;
    const deleteDictionary = await Dictionary.findByIdAndDelete(id);
    if (!deleteDictionary) {
      return res.status(404).send({
        statusCode: 404,
        message: "Dictionary not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Dictionary deleted successfully",
      data: deleteDictionary,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTermsByLetter = async (req, res) => {
  try {
    const { letter } = req.params;
    const dictionaryLetters = await Dictionary.find({
      letter: { $regex: letter, $options: "i" },
    });
    if (dictionaryLetters.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No terms found for the letter",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "All terms by letter fetched successfully",
      data: dictionaryLetters,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTermsByTerm = async (req, res) => {
  try {
    const { term } = req.params;
    const dictionaryTerms = await Dictionary.find({
      term: { $regex: term, $options: "i" },
    });
    if (dictionaryTerms.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No terms found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "All terms fetched successfully",
      data: dictionaryTerms,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTermsByQuery = async (req, res) => {
  try {
    const { term } = req.params;
    const dictionaryTerms = await Dictionary.find({
      $or: [
        { term: { $regex: term, $options: "i" } },
        { letter: { $regex: term, $options: "i" } },
      ],
    }).sort("term");
    if (dictionaryTerms.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No terms found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "All terms fetched successfully",
      data: dictionaryTerms,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTermById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid dictionary ID",
      });
    }
    const dictionary = await Dictionary.findById(req.params.id);
    if (!dictionary) {
      return res.status(404).send({
        statusCode: 404,
        message: "Dictionary not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Dictionary fetched successfully",
      data: dictionary,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewTerm,
  getAllDictionarys,
  getDictionaryById,
  updateDictionaryById,
  deleteDictionaryById,
  getTermsByLetter,
  getTermsByTerm,
  getTermsByQuery,
  getTermById,
};
  