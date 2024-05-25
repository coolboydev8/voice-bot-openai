const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
mongoose.set("strictQuery", true);

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors());

const authRouter = require("./routers/authRouter");
const taskRouter = require("./routers/taskRouter");
const covRouter = require("./routers/covRouter");
const markRouter = require("./routers/markRouter");

// middleware
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

app.use("/api/auth", authRouter, (req, res) => res.sendStatus(401));
app.use("/api/task", taskRouter, (req, res) => res.sendStatus(401));
app.use("/api/cov", covRouter, (req, res) => res.sendStatus(401));
app.use("/api/mark", markRouter, (req, res) => res.sendStatus(401));

mongoose
  .connect("mongodb://127.0.0.1/rasa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Mongo connected ...");
    console.log(result.connection._connectionString);
    app.listen(3001, () => console.log(`Listening to port ${3001}`));
  })
  .catch((err) => console.log(err));
