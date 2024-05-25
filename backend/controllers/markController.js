const { response } = require("express");
const Conversation = require("../models/Conversation");
const Score = require("../models/Score");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: `${process.env.apiKey}`,
});

module.exports.scoring = async (req, res) => {
  console.log("--------------");
  const user_id = req.body.user_id;
  const topic = req.body.topic;
  let result = await Conversation.find({ user_id, topic });
  let conversation = "";
  result.map((cov) => {
    conversation += cov.content;
  });

  let response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an English teacher trying to help students enhance their communication skills. \
           This is a dialogue practice between Students. \
           You will be shown a dialogue. \
           Please correct the sentences of the first speaker and give a score out of ten in response to \
           academic vocabulary, argumentative text, cohesion, word concreteness, interactivity, narrativity, syntactic complexity, and vocabulary difficulty, \
           and provide the rationale underlying your evaluation results. Please offer precise suggestions for rectification. \
           Please offer precise suggestions for rectification. \
          ",
        },
        {
          role: "user",
          content: conversation,
        },
      ],
      max_tokens: 1000,
    })
    .catch((err) => {
      return res.status(401).json({ data: "update your openAI Key" });
    });

  let score = new Score({
    user_id,
    topic_num: topic,
    score: response.choices[0].message.content,
  });
  let score_resut = await score.save();
  console.log("score_result", score_resut);
  return res.status(200).json();
};

module.exports.getMark = async (req, res) => {
  const { user_id, topic_num } = req.body;
  console.log("user_id", user_id, topic_num);
  const reuslt = await Score.findOne({ user_id, topic_num });

  return res.status(200).json({ score: reuslt.score });
};
