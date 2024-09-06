const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    info: {
      type: String,
      trim: true,
      default: "User description info",
      max: 255,
    },
    photo: {
      type: String,
      trim: true,
      default: "/user/default_user_photo.jpg",
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    updated_date: {
      type: Date,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    activation_link: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
