const Joi = require("joi");

exports.socialValidation = (data) => {
  const schemaSocial = Joi.object({
    social_name: Joi.string().required().trim(),
    social_icon_file: Joi.string().required().trim(),
  });
  return schemaSocial.validate(data, { abortEarly: false });
};
