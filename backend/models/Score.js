const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    score: {
      type: String,
      require: true,
    },
    topic_num: {
      type: Number,
      require: true,
    },
    created_at: {
      type: Date,
      default: new Date(),
      require: true,
    },
  },
  { versionKey: false }
);

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
