const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const User = require("../schemas/User");
const { userValidation } = require("../validations/user_validation");

const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const { badRequest } = require("../errors/api.error");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const addNewUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      name,
      email,
      password,
      info,
      photo,
      created_date,
      update_date,
      is_active,
    } = value;
    const exists_email = await User.findOne({
      email: { $regex: email, $options: "i" },
    });
    if (exists_email) {
      return res.status(400).send({ message: "Bu email mavjud" });
    }

    const hashedPassword = bcrypt.hashSync(password, 7);

    const activation_link = uuid.v4(); //

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      info,
      photo,
      created_date,
      update_date,
      is_active,
      activation_link,
    });

    // http://localhost:3000
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/user/activate/${activation_link}`
    );

    const payLoad = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      info: newUser.info,
    };
    const tokens = myJwt.generateTokens(payLoad);
    newUser.token = tokens.refreshToken;
    await newUser.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxage: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      statusCode: 201,
      message: "New User added successfully",
      id: newUser._id,
      accessToken: tokens.accessToken,
      data: newUser,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// login User identificatsiya
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        statusCode: 400,
        message: "Incorrect email or password",
      });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).send({
        statusCode: 400,
        message: "Incorrect email or password",
      });
    }
    const payLoad = {
      _id: user._id,
      name: user.name,
      email: user.email,
      info: user.info,
      user_roles: ["READ", "WRITE"], // "DELETE" roli berilmadi
    };
    // console.log(payLoad);
    // const token = jwt.sign(payLoad, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenTime"),
    // });
    const tokens = myJwt.generateTokens(payLoad);
    user.token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(200).send({
      statusCode: 200,
      message: "User logged in successfully",
      id: user._id,
      accessToken: tokens.accessToken,
      // data: user,
      // tokens,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// LogOut User
const logOutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(403).send({
        statusCode: 403,
        message: "No refresh token provided",
      });
    }
    const user = await User.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!user) {
      return res.status(400).send({
        statusCode: 400,
        message:
          "Invalid refresh token. Not authorized to access this resource",
      });
    }
    res.clearCookie("refreshToken");
    res.status(200).send({
      statusCode: 200,
      message: "User logged out successfully",
      id: user._id,
      refreshToken: user.token,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Refresh Token
const refreshTokenUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);

    if (!refreshToken) {
      return res.status(403).send({
        statusCode: 403,
        message: "User is No refresh token provided",
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
    const userFromDB = await User.findOne({ token: refreshToken });
    if (!userFromDB) {
      return res.status(403).send({
        statusCode: 403,
        message:
          "Invalid refresh token. Not authorized to access this resource",
      });
    }
    const payLoad = {
      _id: userFromDB._id,
      name: userFromDB.name,
      email: userFromDB.email,
      info: userFromDB.info,
    };
    // console.log(payLoad);

    const tokens = myJwt.generateTokens(payLoad);
    userFromDB.token = tokens.refreshToken;
    await userFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(200).send({
      statusCode: 200,
      message: "Token User refreshed successfully",
      id: userFromDB._id,
      accessToken: tokens.accessToken,
      // data: userFromDB,
      // tokens,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const decodedToken = jwt.verify(token, config.get("tokenKey"));
    console.log(decodedToken);

    const users = await User.find({});
    res.status(200).send({
      statusCode: 200,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid User ID",
      });
    }
    const id = req.params.id;
    console.log(id);
    console.log(req.user._id);
    if (req.params.id !== req.user._id) {
      return res.status(403).send({
        statusCode: 403,
        message: "Ruxsat etilmagan foydalanuvchi. Unauthorized access",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({
      statusCode: 200,
      message: "User fetched by Id successfully",
      data: user,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid User ID",
      });
    }
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      name,
      email,
      password,
      info,
      photo,
      created_date,
      update_date,
      is_active,
    } = value;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password,
        info,
        photo,
        created_date,
        update_date,
        is_active,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({
      statusCode: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUserById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Invalid User ID" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({
      statusCode: 200,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};


const userActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const user = await User.findOne({ activation_link: link });

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (user.is_active) {
      return res.status(400).send({
        statusCode: 400,
        message: "User is already active",
      });
    }

    user.is_active = true;
    // user.activation_link = "";
    await user.save();

    res.status(200).send({
      statusCode: 200,
      message: "User activated successfully",
      is_active: user.is_active,
      data: user,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  logOutUser,
  refreshTokenUser,
  userActivate,
};
