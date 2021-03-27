const express = require("express");
const bodyParser = require("body-parser");
const utils = require("./utils");

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Polydian, your personal note keeping service");
});

app.get("/users", (req, res) => {
  res.json({
    "message": "An API endpoint to create users"
  });
});

app.get("/users/all", async (req, res) => {
  let result = await utils.getAllUsers();
  res.json({
    "result": result
  });
});

app.post("/users/create", async (req, res) => {
  const bodyData = req.body;
  let boolIfUserExists = await utils.checkIfUsernameExists(bodyData.username);
  if(boolIfUserExists){
    utils.createNewUser(bodyData);
    res.json({
      "message": "New user created"
    });
  } else {
    res.json({
      "message": "Username with the same user already exists"
    });
  }
});

app.get("/users/delete/all", async (req, res) => {
  await utils.deleteRecords();
  res.json({
    "message": "All records deleted"
  });
});

app.post("/users/login", async (req, res) => {
  const bodyData = req.body;
  utils.loginUser(bodyData.username, bodyData.password, res);
});

app.post("/users/password/update", async (req, res) => {
  const bodyData = req.body;
  utils.updatePassword(bodyData.username, bodyData.password, bodyData.newPassword, res);
});

module.exports = app;
