const Joi = require("joi");

exports.tagValidation = (date) => {
  const schemaTag = Joi.object({
    topic_id: Joi.string().required().trim(),
    category_id: Joi.string().required().trim(),
  });
  return schemaTag.validate(date, { abortEarly: false });
};
