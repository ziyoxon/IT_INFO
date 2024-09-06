const { Router } = require("express");

const { createViewPath } = require("../helpers/create_view_path");

const router = Router();

router.get("/", (req, res) => {
  res.render(createViewPath("index"), {
    title: "Asosiy sahifa",
    isHome: true, // classda menu active qilish uchun
  });
});

router.get("/dictionary", (req, res) => {
  res.render(createViewPath("dictionary"), {
    title: "Maqolallar",
    isDict: true,
  });
});

router.get("/topics", (req, res) => {
  res.render(createViewPath("topics"), {
    title: "Maqolalr",
    isTopic: true,
  });
});

router.get("/authors", (req, res) => {
  res.render(createViewPath("authors"), {
    title: "Aftorlar",
    isAuthor: true,
  });
});

router.get("/login", (req, res) => {
  res.render(createViewPath("login"), {
    title: "Tizimga kirish",
    isLogin: true,
  });
});

router.get("/error", (req, res) => {
  res.render(createViewPath("error"), {
    title: "Xatoliklar",
    isError: true,
  });
});

module.exports = router;
