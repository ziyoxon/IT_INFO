const { errorHandler } = require("../helpers/error_handler");
const { default: mongoose } = require("mongoose");
const Category = require("../schemas/Category");
const { categoryValidation } = require("../validations/category_validation");

const addNewCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { category_name, parent_category_id } = value;
    const category = await Category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (category) {
      return res.status(400).send({
        statusCode: 400,
        message: "Bu kategoriyada bunday termin mavjud",
      });
    }
    const newCategory = await Category.create({
      category_name,
      parent_category_id,
    });
    res.status(201).send({
      statusCode: 201,
      message: "Yangi Kategoriya qo'shildi",
      data: newCategory,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllCategorys = async (req, res) => {
  try {
    const categorys = await Category.find().populate(
      "parent_category_id",
      "-_id"
    );
    res.status(200).send({
      statusCode: 200,
      message: "Categorys fetched successfully",
      data: categorys,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getCategoryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid category ID",
      });
    }
    const category = await Category.findById(req.params.id).populate(
      "parent_category_id",
      "-_id"
    );
    if (!category)
      return res.status(404).send({
        statusCode: 404,
        message: "Category not found",
      });
    res.status(200).send({
      statusCode: 200,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid category ID",
      });
    }
    const { category_name } = req.body;
    const dict = await Category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (dict) {
      return res.status(400).send({
        statusCode: 400,
        message: "Bu kategoriyada mavjud",
      });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { category_name },
      { new: true }
    );
    if (!category) {
      return res.status(404).send({
        statusCode: 404,
        message: "Category not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid category ID",
      });
    }
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deleteCategory)
      return res.status(404).send({
        statusCode: 404,
        message: "Category not found",
      });
    res.send({
      statusCode: 200,
      message: "Category deleted successfully",
      data: deleteCategory,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewCategory,
  getAllCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
