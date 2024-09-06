const express = require("express");
const {
  addNewCategory,
  getAllCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getAllCategorys);
router.get("/:id", getCategoryById);
router.post("/create", addNewCategory);
router.patch("/update/:id", updateCategoryById);
router.delete("/delete/:id", deleteCategoryById);

module.exports = router;
