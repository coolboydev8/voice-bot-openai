const mongoose = require("mongoose");

const MarkSchema = new mongoose.Schema(
  {
    //academic_vocabulary
    a_vocabulary: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    //argumentative text
    a_text: {
      type: Boolean,
      require: true,
    },
    cohesion: {
      type: String,
      require: true,
    },
    //word concreteness
    w_concreteness: {
      type: String,
      require: true,
    },

    interactivity: {
      type: String,
      require: true,
    },
    narrativity: {
      type: String,
      require: true,
    },
    //syntactic complexity,
    s_complexity: {
      type: String,
      require: true,
    },
    //vocabulary_difficulty
    v_difficulty: {
      type: String,
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

const Mark = mongoose.model("Mark", MarkSchema);

module.exports = Mark;
