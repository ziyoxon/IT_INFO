const Joi = require("joi");

exports.descriptionQAValidation = (data) => {
  const schemaDescriptionQA = Joi.object({
    question_answer_id: Joi.string().alphanum().required(),
    description_id: Joi.string().alphanum().required(),
  });
  return schemaDescriptionQA.validate(data, { abortEarly: false });
};
