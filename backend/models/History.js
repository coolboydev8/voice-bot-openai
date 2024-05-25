const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    topic_day: {
      type: Number,
      require: true,
    },
    flag: {
      type: Boolean,
      default: false,
      require: true,
    },
    created_at: {
      type: Date,
      default: new Date(),
      require: true,
    },
    updated_at: {
      type: Date,
      default: new Date(),
      require: true,
    },
  },
  { versionKey: false }
);

const History = mongoose.model("History", historySchema);

module.exports = History;
