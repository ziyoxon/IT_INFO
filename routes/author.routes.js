const express = require("express");
const {
  getAllAuthors,
  getAuthorById,
  addNewAuthor,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshToken,
  authorActivate,  // custom middleware for author activation
} = require("../controllers/author.controller");

const router = express.Router();
const authorPolise = require("../middleware/author_police"); // guard qo'riqchi
const authorRolesPolice = require("../middleware/author_roles_police "); // author rollari


router.get("/", authorPolise, getAllAuthors);
router.get("/:id", authorRolesPolice(["READ"]), getAuthorById);
router.get("/activate/:link", authorActivate);
router.post("/add", addNewAuthor);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshToken);
router.patch("/update/:id", updateAuthorById);
router.delete("/delete/:id", deleteAuthorById);




module.exports = router;
