const express = require("express");

const router = express.Router();

const dictRouter = require("./dictionary.routes");
const descRouter = require("./description.routes");
const catigoryRouter = require("./category.routes");
const synonymRouter = require("./synonym.routes");
const authorRouter = require("./author.routes");
const socialRouter = require("./social.routes");
const authorSocialRouter = require("./authorSocial.routes");
const adminRouter = require("./admin.routes");
const userRouter = require("./user.routes");
const topicRouter = require("./topic.routes");
const descTopicRouter = require("./descripTopic.routes");
const tagRouter = require("./tag.routes");
const questioAnswerRouter = require("./questionAnswer.routes");
const descriptionQARouter = require("./descriptionQA.routes");
const guestRouter = require("./guest.routes");

router.use("/dict", dictRouter);
router.use("/desc", descRouter);
router.use("/category", catigoryRouter);
router.use("/synonym", synonymRouter);
router.use("/author", authorRouter);
router.use("/social", socialRouter);
router.use("/authorsocial", authorSocialRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/topic", topicRouter);
router.use("/desctopic", descTopicRouter);
router.use("/tag", tagRouter);
router.use("/questionanswer", questioAnswerRouter);
router.use("/descriptionqa", descriptionQARouter);
router.use("/guest", guestRouter);

module.exports = router;
