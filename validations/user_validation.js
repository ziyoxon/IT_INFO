const Joi = require("joi");

exports.userValidation = (data) => {
  const schemaUser = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().lowercase().trim(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$]{6,30}$")),
    info: Joi.string().optional().default("User description info"),
    photo: Joi.string().default("/user/default_user_photo.png"),
    created_date: Joi.date()
      .less(new Date("2024-01-01")) // kichik bo'lishi kerak
      .greater(new Date("2000-01-01")), // katta bo'lishi kerak
    updated_date: Joi.date()
      .less(new Date("2024-01-01")) // kichik bo'lishi kerak
      .greater(new Date("2000-01-01")), // katta bo'lishi kerak
    is_active: Joi.boolean().default(false),
    token: Joi.string(),
    activation_link: Joi.string(),
  });
  return schemaUser.validate(data, { abortEarly: false });
};
