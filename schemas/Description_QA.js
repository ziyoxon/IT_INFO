const { Schema, model } = require("mongoose");

const descQASchema = new Schema(
  {
    question_answer_id: {
      type: Schema.Types.ObjectId,
      ref: "Question_Answer",
      required: true,
      unique: true,
    },
    description_id: {
      type: Schema.Types.ObjectId,
      ref: "Description",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Description_QA", descQASchema);
