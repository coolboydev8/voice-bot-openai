const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    role: {
      //AI:false, Human:true
      type: Boolean,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    type: {
      //speech, input, suggest
      type: String,
      require: true,
    },
    created_at: {
      type: Date,
      default: new Date(),
      require: true,
    },
    topic: {
      type: Number,
      require: true,
    },
  },
  { versionKey: false }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
