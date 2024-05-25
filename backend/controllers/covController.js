const Conversation = require("../models/Conversation");
const OpenAI = require("openai");

module.exports.create = async (req, res) => {
  const log = new Conversation(req.body);
  await log.save().then(() => {
    return res.status(200).json();
  });
};
