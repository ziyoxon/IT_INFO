const express = require("express");
const { getAllSocials, getSocialById, addNewSocial, updateSocialById, deleteSocialById } = require("../controllers/social.controller");


const router = express.Router();

router.get("/", getAllSocials);
router.get("/:id", getSocialById);
router.post("/create", addNewSocial);
router.patch("/update/:id", updateSocialById);
router.delete("/delete/:id", deleteSocialById);

module.exports = router;
