const Joi = require("joi");

exports.categoryValidation = (data) => {
  const schemaCatigory = Joi.object({
    category_name: Joi.string()
      .min(2)
      .message("Kategorya nomi 2 ta harfdan uzun bo'lishi kerak")
      .max(100)
      .message("Kategorya nomi 100 ta harfdan qisqa bo'lishi kerak")
      .required()
      .trim()
      .unique()
      .messages({
        "string.empty": "Categoriya nomi bo'sh bo'lishi mumkin emas",
        "any.required": "Categoriya nomini albatta kiritish shart",
      }),
    parent_category_id: Joi.string()
    .alphanum()
    .message("ID noto'g'ri"),
  });
  return schemaCatigory.validate(data, {
    abortEarly: false, // birinchi xatolikdankeyin chiqib ketmaydi barcha xatolikni chiqarib beradi
  });
};
