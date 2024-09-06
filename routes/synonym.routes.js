const express = require("express");
const {
  getAllSynonyms,
  getSynonymById,
  addNewSynonym,
  updateSynonymById,
  deleteSynonymById,
} = require("../controllers/synonym.controller");

const router = express.Router();

router.get("/", getAllSynonyms);
router.get("/:id", getSynonymById);
router.post("/create", addNewSynonym);
router.patch("/update/:id", updateSynonymById);
router.delete("/delete/:id", deleteSynonymById);

module.exports = router;
