require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//-------------Solution--------------
var bodyParser = require('body-parser');

//Parse body information for POST requests.
app.use(bodyParser.urlencoded({ extended: false }));

//Making a new Mongoose instance.
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

//Create a mongoose schema for URLs, the id is going to be the value fetched. 

const urlSchema = new mongoose.Schema ({
  userUrl: {type: String, required: true},
  urlHash: {type:String, required: true}
});

const urlStore = mongoose.model('urlStore', urlSchema);

//Removes the protocol from the beggining of the url if there is one.

/*
function shaveUrl(url) {
  if (url.startsWith("https://")) {
    return url.substring(8);
  } else if (url.startsWith("http://")) {
    return url.substring(7);
  } else {
    return url;
  };
};
*/

//Creates a unique hash for the URL.
function hashMe(string, ip) {
  var timenow = new Date().getTime();
  return string[4] + timenow + ip[8];
};

//Verifies the validity of an Url (only http or https).
function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

//Log request infofrmation.
app.use(function(req, res, next) {
  console.log(req.body.url);
  console.log(req.ip);
  next();
});

//Check for duplicates and create a new short URL.
app.post("/api/shorturl/new", function(req, res) {
  url = req.body.url;

  var exists = isValidHttpUrl(url);
  console.log(exists);

    if (exists) {
      var validUrl = new urlStore({
        userUrl: url,
        urlHash: hashMe(url, req.ip)
      });

      validUrl.save(function(err) {
        if (err) console.log(err);
        res.json({
          original_url: req.body.url,
          short_url: validUrl.urlHash
        });
      })

    } else {
      res.json({
        error: "invalid url"
      });

    };
  });

//Retrieve a url.
app.get("/api/shorturl/:url", function(req, res) {
  console.log(req.params.url);
  urlStore.findOne({urlHash: req.params.url}, function(err, urlFound) {
    if(err) return console.log(err);
    console.log(urlFound);
    res.redirect(urlFound.userUrl);
  });;
});



//-------------End of Solution---------------

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
