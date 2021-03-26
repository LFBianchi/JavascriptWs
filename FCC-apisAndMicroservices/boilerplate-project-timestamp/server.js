// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//Receives "empty" requests and outputs a the current date.
app.get("/api/timestamp/", function (req, res) {
  var userDate = new Date();
  
  res.json({
  unix: userDate.getTime(),
  utc: userDate.toUTCString()
  }); 
});

//Receives a string and teset to see i all the characters are numbers.
function isAllNum (string) {
  const numbers = "0123456789";
  for (i = 0; i <= string.length; i++) {
    console.log(numbers.search(string[i]));
    if (numbers.search(string[i]) < 0) {
      return false;
    };
  };
  return true;
};

//The timestamp conversion service.
app.get("/api/timestamp/:date", function (req, res) {
  if (isAllNum(req.params.date)) {
    var rawDate = parseInt(req.params.date);
    var userDate = new Date(rawDate);
  } else {
    var userDate = new Date(req.params.date);
  };

  if (userDate.toUTCString() == "Invalid Date"){
    res.json({
      error: "Invalid Date"
    })
  } else {
    res.json({
      unix: userDate.getTime(),
      utc: userDate.toUTCString()
      });
  };  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
