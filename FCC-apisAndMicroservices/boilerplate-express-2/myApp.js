var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Middleware.
app.use(bodyParser.urlencoded({ extended: false }));

//Mounting the routes of the API.
app.post('/name', postNameHandler);

//Functions
function postNameHandler (req, res) {
  var fullName = req.body.first + " " + req.body.last;
  var response = {name: fullName};
  res.json(response);
}


























 module.exports = app;
