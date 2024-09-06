const Joi = require("joi");

exports.synonymValidation = (data) => {
  const schemaSynonym = Joi.object({
    description_id: Joi.string().required(),
    dictionary_id: Joi.string().required(),
  });
  return schemaSynonym.validate(data, { abortEarly: false });
};
