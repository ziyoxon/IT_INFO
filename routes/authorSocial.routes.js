const express = require("express");
const {
  getAllAuthorSocials,
  getAuthorSocialById,
  addNewAuthorSocial,
  updateAuthorSocialById,
  deleteAuthorSocialById,
} = require("../controllers/authorSocial.controller");

const router = express.Router();

router.get("/", getAllAuthorSocials);
router.get("/:id", getAuthorSocialById);
router.post("/create", addNewAuthorSocial);
router.patch("/update/:id", updateAuthorSocialById);
router.delete("/delete/:id", deleteAuthorSocialById);

module.exports = router;
