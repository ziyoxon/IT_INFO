const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    nick_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^\d{2}-\d{3}-\d{2}-\d{2}$/,
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
    },
    position: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    is_expert: {
      type: Boolean,
      default: false,
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
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Author", authorSchema);
