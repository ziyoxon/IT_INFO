const Joi = require("joi");
const fullName = (parent) => {
  return parent.first_name + " " + parent.last_name;
};

exports.authorValidation = (data) => {
  const schemaAuthor = Joi.object({
    first_name: Joi.string().required().trim(),
    last_name: Joi.string().required().trim(),
    fullName: Joi.string().default(fullName),
    nick_name: Joi.string().required().trim().min(4).max(20),
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    phone: Joi.string()
      .required()
      .trim()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    password: Joi.string()
      .required()
      .trim()
      .min(6)
      .max(20)
      .pattern(new RegExp("^[a-zA-Z0-9!@#$]{6,30}$")),
    confirm_password: Joi.ref("password"),
    info: Joi.string().min(5).max(50).trim(),
    position: Joi.string().min(5).max(50).trim(),
    photo: Joi.string().trim().default("/author/avatar.png"),
    is_expert: Joi.boolean().default(false),
    is_active: Joi.boolean().default(false),
    token: Joi.string(),
    activation_link: Joi.string(),
    // gender: Joi.string().valid("erkak", "ayol"), // enam == valid
    // birth_date: Joi.date()
    //   .default(new Date())
    //   .less(new Date("2010-01-01")) // kichik bo'lishi kerak
    //   .greater(new Date("1950-01-01")), // katta bo'lishi kerak
    // birth_year: Joi.number().integer().min(1980).max(2005),
    // reffered: Joi.boolean().default(false),
    // refferedDetails: Joi.string().when("reffered", {
    //   is: true,
    //   then: Joi.string().required(),
    //   otherwise: Joi.string().optional(),
    // }),
    // coding_langs: Joi.array().items(Joi.string(), Joi.number()),
    // is_yes: Joi.boolean().truthy("YES", "HA").valid(true),
  });
  return schemaAuthor.validate(data, { abortEarly: false });
};
