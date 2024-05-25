const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports.login_post = async (req, res) => {
  try {
    let errors = {};
    const searchQuery = req.body;
    // Check for correct email
    const user = await User.findOne({ email: searchQuery.email });
    // if email not found
    if (user == null) {
      errors.message = "Email not found. Please register";
      return res.status(401).json({ errors });
    }
    // if email found compare hashed password with incoming password
    bcrypt.compare(searchQuery.password, user.password, (err, result) => {
      if (err) throw err;
      const match = result;
      if (!match) {
        errors.message = "Incorrect Password";
        return res.status(401).json({ errors });
      }
      // create json web token and send it back to client side
      jwt.sign(
        { userId: user._id },
        "rasa",
        { expiresIn: 60 * 60 },
        (err, token) => {
          if (err) throw err;
          errors.message = "welcome!";
          errors.token = {
            _id: user._id,
            email: searchQuery.email,
            token,
          };
          return res.status(200).json({ errors });
        }
      );
    });
  } catch (err) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(400).json({ errors: err });
  }
};
module.exports.forgot = async (req, res) => {
  const searchQuery = req.body;
  let errors = {};
  const user = await User.findOne({ email: searchQuery.email });
  if (user == null) {
    errors.message = "The email is not registered";
    return res.status(401).json({ errors });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash("123", salt, async (err, hash) => {
        if (err) throw err;
        const password = hash;
        console.log("password", password);
        await User.updateOne(
          { email: searchQuery.email },
          { $set: { password } }
        );
        if (user) {
          errors.message = "password is 123";
          res.status(200).json({ errors });
        }
      });
    });
  }
};
