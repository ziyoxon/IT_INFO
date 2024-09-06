const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Author = require("../schemas/Author");
const { authorValidation } = require("../validations/author_validation");

const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const { badRequest } = require("../errors/api.error");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const addNewAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      first_name,
      last_name,
      full_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      is_active,
    } = value;
    const exists_nick_name = await Author.findOne({
      nick_name: { $regex: nick_name, $options: "i" },
    });
    const exists_email = await Author.findOne({
      email: { $regex: email, $options: "i" },
    });
    const exists_phone = await Author.findOne({
      phone: { $regex: phone, $options: "i" },
    });
    if (exists_nick_name) {
      return res.status(400).send({ message: "Bu nom mavjud" });
    } else if (exists_email) {
      return res.status(400).send({ message: "Bu email mavjud" });
    } else if (exists_phone) {
      return res.status(400).send({ message: "Bu telefon raqam mavjud" });
    }

    const hashedPassword = bcrypt.hashSync(password, 7);

    const activation_link = uuid.v4(); //

    const newAuthor = await Author({
      first_name,
      last_name,
      full_name,
      nick_name,
      email,
      phone,
      password: hashedPassword,
      info,
      position,
      photo,
      is_expert,
      is_active,
      activation_link,
    });
    await newAuthor.save();

    // http://localhost:3000
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get("port")}/api/author/activate/${activation_link}`
    );

    const payLoad = {
      _id: newAuthor._id,
      email: newAuthor.email,
      is_expert: newAuthor.is_expert,
    };
    const tokens = myJwt.generateTokens(payLoad);
    newAuthor.token = tokens.refreshToken;
    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      statusCode: 201,
      message: "New Author added successfully",
      id: newAuthor._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// login Author
const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(400).send({
        statusCode: 400,
        message: "Incorrect email or password",
      });
    }
    const validPassword = bcrypt.compareSync(password, author.password);
    if (!validPassword) {
      return res.status(400).send({
        statusCode: 404,
        message: "Incorrect email or password",
      });
    }

    const payLoad = {
      _id: author._id,
      email: author.email,
      is_expert: author.is_expert,
      author_roles: ["READ", "WRITE"], // "DELETE" roli berilmadi
    };
    // console.log(payLoad);

    const tokens = myJwt.generateTokens(payLoad);
    author.token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    // // Error handling example
    // try {
    //   setTimeout(function () {
    //     throw new Error("uncaughtException example");
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }

    // new Promise((_, reject) => {
    //   reject(new Error("unhandledRejection example"));
    // });

    res.status(200).send({
      statusCode: 200,
      message: "Author logged in successfully",
      id: author._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// logOut Author
const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(403).send({
        statusCode: 403,
        message: "No refresh token provided",
      });
    }
    const author = await Author.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!author) {
      return res.status(400).send({
        statusCode: 400,
        message:
          "Invalid refresh token. Not authorized to access this resource",
      });
    }
    res.clearCookie("refreshToken");
    res.status(200).send({
      statusCode: 200,
      message: "Author logged out successfully",
      id: author._id,
      refreshToken: author.token,
    }); // amaliyot uchun
  } catch (error) {
    errorHandler(res, error);
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(403).send({
        statusCode: 403,
        message: "Cookieda Refresh token topilmadi",
      });
    }
    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({
        statusCode: 403,
        message: "Refresh token is not valid",
        error: error.message,
      });
    }
    const authorFromDB = await Author.findOne({ token: refreshToken });
    if (!authorFromDB) {
      return res.status(403).send({
        statusCode: 403,
        message: "Ruxsat etilmagan foydalanuvchi (Refresh token mos emas)",
      });
    }
    const payLoad = {
      _id: authorFromDB._id,
      email: authorFromDB.email,
      is_expert: authorFromDB.is_expert,
    };
    // console.log(payLoad);

    const tokens = myJwt.generateTokens(payLoad);
    authorFromDB.token = tokens.refreshToken;
    await authorFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(200).send({
      statusCode: 200,
      message: "Token refreshed successfully",
      id: authorFromDB._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find({});
    res.status(200).send({
      statusCode: 200,
      message: "Barcha Aftorlar ro'yhati",
      data: authors,
    });
    // throw badRequest("Birorta aftor topilmadi")
  } catch (error) {
    errorHandler(res, error);
    // next(error);
  }
};

const getAuthorById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid author ID",
      });
    }
    const id = req.params.id;
    console.log(id);
    console.log(req.author._id);
    if (req.params.id !== req.author._id) {
      return res.status(403).send({
        statusCode: 403,
        message: "Ruxsat etilmagan foydalanuvchi. Unauthorized access",
      });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({
        statusCode: 404,
        message: "Author not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Author fetched successfully",
      data: author,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid author ID",
      });
    }
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      first_name,
      last_name,
      full_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      is_active,
    } = value;
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        first_name,
        last_name,
        full_name,
        nick_name,
        email,
        phone,
        password,
        info,
        position,
        photo,
        is_expert,
        is_active,
      },
      { new: true }
    );
    if (!updatedAuthor) {
      return res.status(404).send({
        statusCode: 404,
        message: "Author not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Author updated successfully",
      data: updatedAuthor,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthorById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid author ID",
      });
    }
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).send({
        statusCode: 404,
        message: "Author not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Author deleted successfully",
      data: deletedAuthor,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const authorActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const author = await Author.findOne({activation_link: link});
    if (!author) {
      return res.status(400).send({
        statusCode: 400,
        message: "Bunday aftor topilmadi",
      });
    }
    if (author.is_active) {
      return res.status(400).send({
        statusCode: 400,
        message: "Bu aftor avval faollashtirilgan",
      });
    }
    author.is_active = true;
    await author.save();

    res.status(200).send({
      statusCode: 200,
      is_active: author.is_active,
      message: "Aftor faollashtirildi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = {
  addNewAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshToken,
  authorActivate
};
