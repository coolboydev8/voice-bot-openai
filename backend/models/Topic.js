const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tDesc: {
      type: String,
      required: true,
    },
    task1: {
      type: String,
      required: true,
    },
    task1Dec: {
      type: String,
      required: true,
    },
    task2: {
      type: String,
      required: true,
    },
    task2Dec: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      require: true,
    },
  },
  { versionKey: false }
);

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
