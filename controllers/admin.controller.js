const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../schemas/Admin");
const { adminValidation } = require("../validations/admin_validation");

const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const { badRequest } = require("../errors/api.error");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const addNewAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      name,
      email,
      phone,
      password,
      is_active,
      is_creator,
      created_date,
      update_date,
    } = value;
    const exists_email = await Admin.findOne({
      email: { $regex: email, $options: "i" },
    });
    const exists_phone = await Admin.findOne({
      email: { $regex: phone, $options: "i" },
    });
    if (exists_email) {
      return res.status(400).send({ message: "Bu email mavjud" });
    } else if (exists_phone) {
      return res.status(400).send({ message: "Bu telefon raqam mavjud" });
    }

    const hashedPassword = bcrypt.hashSync(password, 7);

    const activation_link = uuid.v4();

    const newAdmin = await Admin({
      name,
      email,
      phone,
      password: hashedPassword,
      is_active,
      is_creator,
      created_date,
      update_date,
      activation_link,
    });
    await newAdmin.save();

    // http://localhost:3000
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/admin/activate/${activation_link}`
    );

    const payLoad = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
    };
    const tokens = myJwt.generateTokens(payLoad);
    newAdmin.token = tokens.refreshToken;
    await newAdmin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(201).send({
      statusCode: 201,
      message: "New Admin added successfully",
      id: newAdmin.id,
      accessToken: tokens.accessToken,
      // data: newAdmin,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).send({
        statusCode: 400,
        message: "Encorrect email or password",
      });
    }
    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(400).send({
        statusCode: 400,
        message: "Encorrect email or password",
      });
    }

    const payLoad = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      admin_roles: ["READ", "WRITE"], // "DELETE" roli berilmadi
    };
    // console.log(payLoad);

    const tokens = myJwt.generateTokens(payLoad);
    admin.token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(200).send({
      statusCode: 200,
      message: "Admin logged in successfully",
      id: admin._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// LogOut Admin
const logOutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(403).send({
        statusCode: 403,
        message: "No refresh token provided",
      });
    }
    const admin = await Admin.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!admin) {
      return res.status(400).send({
        statusCode: 400,
        message:
          "Invalid refresh token. Not authorized to access this resource",
      });
    }
    res.clearCookie("refreshToken");
    res.status(200).send({
      statusCode: 200,
      message: "Admin logged out successfully",
      data: {
        id: admin._id,
        refreshToken: admin.token,
      },
    }); // amaliyot uchun res qaytaryapmiz
  } catch (error) {
    errorHandler(res, error);
  }
};

// Refresh token
const refreshTokenAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);

    if (!refreshToken) {
      return res.status(403).send({
        statusCode: 403,
        message: "Admin No refresh token provided",
      });
    }
    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({
        statusCode: 403,
        message: "Admin Refresh token is not valid",
        error: error.message,
      });
    }
    const adminFromBD = await Admin.findOne({ token: refreshToken });
    if (!adminFromBD) {
      return res.status(403).send({
        statusCode: 403,
        message:
          "Admin Invalid refresh token. Not authorized to access this resource",
      });
    }
    const payLoad = {
      _id: adminFromBD._id,
      name: adminFromBD.name,
      email: adminFromBD.email,
      phone: adminFromBD.phone,
    };
    // console.log(payLoad);

    const tokens = myJwt.generateTokens(payLoad);
    adminFromBD.tokens = tokens.refreshToken;
    await adminFromBD.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.status(200).send({
      statusCode: 200,
      message: "Admin refreshed successfully",
      id: adminFromBD._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).send({
      statusCode: 200,
      message: "All Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdminById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Admin ID",
      });
    }
    const id = req.params.id;
    console.log(id);
    console.log(req.admin._id);
    if (req.params.id !== req.admin._id) {
      return res.status(403).send({
        statusCode: 403,
        message: "Ruxsat etilmagan foydalanuvchi. Unauthorized access",
      });
    }
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send({
        statusCode: 404,
        message: "Admin not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAdminById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Admin ID",
      });
    }
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      name,
      email,
      phone,
      password,
      is_active,
      is_creator,
      created_date,
      update_date,
    } = value;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        password,
        is_active,
        is_creator,
        created_date,
        update_date,
      },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).send({
        statusCode: 404,
        message: "Admin not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Admin ID",
      });
    }
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).send({
        statusCode: 404,
        message: "Admin not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Admin deleted successfully",
      data: deletedAdmin,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const adminActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const admin = await Admin.findOne({ activation_link: link });

    if (!admin) {
      return res.status(404).send({
        statusCode: 404,
        message: "Admin not found",
      });
    }

    if (admin.is_active) {
      return res.status(400).send({
        statusCode: 400,
        message: "Admin is already active",
      });
    }

    admin.is_active = true;
    // admin.activation_link = "";
    await admin.save();

    res.status(200).send({
      statusCode: 200,
      message: "Admin activated successfully",
      is_active: admin.is_active,
      data: admin,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logOutAdmin,
  refreshTokenAdmin,
  adminActivate,
};
