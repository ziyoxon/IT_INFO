const Joi = require("joi");

exports.adminValidation = (data) => {
  const schemaAdmin = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim().lowercase(),
    phone: Joi.string()
      .required()
      .trim()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    password: Joi.string().min(8).required().trim(),
    is_active: Joi.boolean().default(false),
    is_creator: Joi.boolean().default(false),
    created_date: Joi.date()
      .less(new Date("2024-08-01")) // kichik bo'lishi kerak
      .greater(new Date("1950-01-01")), // katta bo'lishi kerak
    updated_date: Joi.date()
      .less(new Date("2024-08-01")) // kichik bo'lishi kerak
      .greater(new Date("1950-01-01")), // katta bo'lishi kerak
    token: Joi.string(),
    activation_link: Joi.string(),
  });
  return schemaAdmin.validate(data, { abortEarly: false });
};
