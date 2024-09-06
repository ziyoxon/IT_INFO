const Joi = require("joi");

exports.descriptionTopicValidation = (data) => {
  const schemaDescriptionTopic = Joi.object({
    description_id: Joi.string().required().alphanum().trim(),
    topic_id: Joi.string().required().alphanum().trim(),
  });
  return schemaDescriptionTopic.validate(data, { abortEarly: false });
};
