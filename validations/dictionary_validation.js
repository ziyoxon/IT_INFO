const Joi = require("joi");

exports.dictionaryValidation = (data) => {
  const schemaDictionary = Joi.object({
    term: Joi.string().required().trim(),
    letter: Joi.string().required().uppercase().trim(),
  });
  return schemaDictionary.validate(data, { abortEarly: false });
};
