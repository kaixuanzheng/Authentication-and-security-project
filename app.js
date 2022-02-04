//jshint esversion:6
require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require('md5');
//Level 2 encrtption
// const encrypt = require("mongoose-encryption");
const saltRounds = 10;


const app = express();


app.use(express.static("public"));
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/secretsDB');
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//Level 2 encrtption
// userSchema.plugin( encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  //Level 4: hashing and salting password.
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
        console.log("New user registered.");
      } else {
        console.log(err);
      }
    });
  });


});

app.post("/login", function(req, res) {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          // result == true
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    } else {
      console.log(err);
    }
  })
})







app.listen(3000, function() {
  console.log("Server started on port 3000.");
})
