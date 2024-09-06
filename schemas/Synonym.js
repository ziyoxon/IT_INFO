const { Schema, model } = require("mongoose");

const synonymSchema = new Schema(
  {
    description_id: {
      type: Schema.Types.ObjectId,
      ref: "Description",
      required: true,
    },
    dictionary_id: {
      type: Schema.Types.ObjectId,
      ref: "Dictionary",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Synonym", synonymSchema);
