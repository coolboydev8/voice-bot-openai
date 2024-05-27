const Topic = require("../models/Topic");
const History = require("../models/History");
const { default: mongoose } = require("mongoose");
//check
module.exports.check = async (req, res) => {
  const user_id = req.body._id;
  let days = await History.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: "topics",
        let: {
          origin: "$topic_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$origin"],
              },
            },
          },
          {
            $project: {
              number: 1,
              _id: 0,
            },
          },
        ],
        as: "data",
      },
    },
  ]);
  if (days[0]) {
    let data = days[0].data[0] ? days[0].data[0].number : 1;
    res.status(200).json({ data });
  }
};

module.exports.getTaskList = async (req, res) => {
  const number = req.body.id;
  let result = await Topic.findOne({ number });
  return res.status(200).json({ result });
};

module.exports.getProgress = async (req, res) => {
  const user_id = req.body.user_id;
  console.log(user_id);
  await History.find({ user_id: user_id, flag: true }).then((result) => {
    res.status(200).json({ result });
  });
};

module.exports.createHistoy = async (req, res) => {
  const historyInstance = new History(req.body);

  // Save the instance to the database
  historyInstance
    .save()
    .then((r) => {
      res.status(200).json({ r });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).json({ error: "Failed to save history" });
    });
};
