const Joi = require('joi');

exports.questionAnswerValidation = (data) => {
  const schemaQuestionAnswer = Joi.object({
    question: Joi.string().required().trim(),
    answer: Joi.string().required().trim(),
    created_date: Joi.date().default(new Date()),
    updated_date: Joi.date().default(new Date()),
    is_checked: Joi.boolean().default(false),
    user_id: Joi.string().required(),
    expert_id: Joi.string().required(),
  });
  return schemaQuestionAnswer.validate(data, { abortEarly: false });
};
