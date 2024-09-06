const Joi = require("joi");

exports.authorSocialValidation = (data) => {
  const schemaAuthorSocial = Joi.object({
    author_id: Joi.string().alphanum().required().trim(),
    social_id: Joi.string().alphanum().required().trim(),
    social_link: Joi.string().required().trim(),
  });
  return schemaAuthorSocial.validate(data, { abortEarly: false });
};
