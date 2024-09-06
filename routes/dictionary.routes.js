const express = require("express");
const {
  getAllDictionarys,
  addNewTerm,
  getDictionaryById,
  updateDictionaryById,
  deleteDictionaryById,
  getTermsByLetter,
  getTermsByTerm,
  getTermsByQuery,
  getTermById,
} = require("../controllers/dictionary.controller");

const router = express.Router();

router.get("/", getAllDictionarys);
router.get("/:id", getDictionaryById);
router.get("/letter/:letter", getTermsByLetter);
router.get("/term/:id", getTermById);
router.get("/term/:term", getTermsByTerm);
router.get("/query/search", getTermsByQuery);
router.post("/create", addNewTerm);
router.patch("/update/:id", updateDictionaryById);
router.delete("/delete/:id", deleteDictionaryById);

module.exports = router;
