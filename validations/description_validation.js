const Joi = require("joi");

exports.descriptionValidation = (date) => {
  const schemaDescription = Joi.object({
    category_id: Joi.string().required().alphanum().trim(),
    description: Joi.string().required().trim().min(5).max(50),
  });
  return schemaDescription.validate(date, { abortEarly: false });
};
