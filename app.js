var express = require('express');

var app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Polydian, your personal note keeping service");
});

app.post("/notes/create/:auth", (req, res) =>{
  console.log(req);
  res.send(req.params.auth);
})

module.exports = app;
