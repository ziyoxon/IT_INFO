const { Schema, model } = require("mongoose");

const descTopicSchema = new Schema(
  {
    description_id: {
      type: Schema.Types.ObjectId,
      ref: "Description",
      required: true,
    },
    topic_id: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Description_Topic", descTopicSchema);
