const Joi = require("joi");

exports.guestValidation = (data) => {
  const schemaGuest = Joi.object({
    guest_ip: Joi.string().required().trim(),
    guest_os: Joi.string().required().trim(),
    guest_device: Joi.string().required().trim(),
    guest_browser: Joi.string().required().trim(),
    guest_reg_date: Joi.date().default(new Date()),
  });
  return schemaGuest.validate(data, { abortEarly: false });
};
