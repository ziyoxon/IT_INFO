const Joi = require("joi");

exports.topicValidation = (data) => {
  const schemaTopic = Joi.object({
    author_id: Joi.string().required().trim(),
    topic_title: Joi.string().required().trim().min(5).max(100),
    topic_text: Joi.string().required().trim().min(20).max(5000),
    created_date: Joi.date().default(new Date()),
    updated_date: Joi.date().default(new Date()),
    is_checked: Joi.boolean().optional().default(false),
    is_approved: Joi.boolean().optional().default(false),
    expert_id: Joi.string().required().trim(),
  });
  return schemaTopic.validate(data, { abortEarly: false });
};
