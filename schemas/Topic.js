const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      unique: true,
    },
    topic_title: {
      type: String,
      trim: true,
    },
    topic_text: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    updated_date: {
      type: Date,
      default: Date.now,
    },
    is_checked: {
      type: Boolean,
      default: false,
    },
    is_approved: {
      type: Boolean,
      default: false,
    },
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Topic", topicSchema);
