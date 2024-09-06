const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Guest = require("../schemas/Guest");
const { guestValidation } = require("../validations/guest_validation");

const addNewGuest = async (req, res) => {
  try {
    const { error, value } = guestValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { guest_ip, guest_os, guest_device, guest_browser, guest_reg_date } =
      value;
    const newGuest = await Guest({
      guest_ip,
      guest_os,
      guest_device,
      guest_browser,
      guest_reg_date,
    });
    await newGuest.save();
    res.status(201).send({
      statusCode: 201,
      message: "New guest added successfully",
      data: newGuest,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find({});
    res.send({
      statusCode: 200,
      message: "All guests fetched successfully",
      data: guests,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getGuestById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid guest ID",
      });
    }
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).send({
        statusCode: 404,
        message: "Guest not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Guest fetched successfully",
      data: guest,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateGuestById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid guest ID",
      });
    }
    const { error, value } = guestValidation(req.body);
    if (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }
    const { guest_ap, guest_os, guest_device, guest_browser, guest_reg_date } =
      value;
    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id,
      {
        guest_ap,
        guest_os,
        guest_device,
        guest_browser,
        guest_reg_date,
      },
      { new: true }
    );
    if (!updatedGuest) {
      return res.status(404).send({
        statusCode: 404,
        message: "Guest not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Guest updated successfully",
      data: updatedGuest,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteGuestById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Invalid Guest ID" });
    }
    const deletedGuest = await Guest.findByIdAndDelete(req.params.id);
    if (!deletedGuest) {
      return res.status(404).send({
        statusCode: 404,
        message: "Guest not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Guest deleted successfully",
      data: deletedGuest,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addNewGuest,
  getAllGuests,
  getGuestById,
  updateGuestById,
  deleteGuestById,
};
