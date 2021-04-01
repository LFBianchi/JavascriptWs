const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
//Parse body information for POST requests.
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//MongoDB shenanigans.
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema ({
  username: {type: String, required: true},
  exercises: []
});

const userHandler = mongoose.model('userHandler', userSchema);


//API key endpoinds.
app.get("/api/exercise/users", function(req, res) {
  userHandler.find({})
             .select({exercises: 0})
             .exec(function (err, data) {
                res.json(data);
             });
}); 

app.get("/api/exercise/log", function(req, res) {
  console.log("Looking for user: " + req.query.userId)
  userHandler.findOne({_id: req.query.userId}, (err, userFound) => {
    if (err) {console.log(err)}
    var exercises = userFound.exercises;
    var exerciseLog = [];
    var dateFrom = new Date(0);
    var dateTo = Date();
    if (req.query.from) dateFrom = new Date(req.query.from);
    if (req.query.to) dateTo = new Date(req.query.to);

    console.log("User found!");
    console.log("Showing exercises from:" + dateFrom + " to: " + dateTo);
    
    for (i = 0; i < exercises.length; i++) {
      if (exercises[i].date >= dateFrom||exercises[i].date <= dateTo)
      {
        exerciseLog.push(exercises[i]);
      }
    }

    if (req.query.limit) {
      exerciseLog = exerciseLog.slice(0, parseInt(req.query.limit));
    }

    var response = {
        _id: userFound._id,
        username: userFound.username,
        log: exerciseLog,
        count: exerciseLog.length
    };
    console.log(response);
    res.json(response);
  });
});

app.post("/api/exercise/new-user", function(req, res) {
  var newUser = new userHandler({
    username: req.body.username,
    exercises:[]
  });

  newUser.save(function(err) {
    if (err) console.log(err);
    console.log(newUser);
    res.json({
      username: newUser.username,
      _id: newUser._id
    });
  });
});

app.post("/api/exercise/add", (req, res) => {
  console.log("Updating user:" + req.body.userId);
  if (req.body.date) {
    var exercisedate = new Date(req.body.date);
  } else {
    var exercisedate = new Date();
  };

  var newExercise = {
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: exercisedate
  };

  userHandler.updateOne(
    {_id: req.body.userId},
    {$push: {exercises: newExercise}},(err) => {
      if(err) {
        console.log(err);
      } else {
        userHandler.findOne({_id: req.body.userId}, (err, userFound) => {
          if (err) console.log(err);

          var exercises = userFound.exercises;
          var l = exercises.length;
          
          var response = {
            _id: userFound._id,
            username: userFound.username,
            description: exercises[l - 1].description,
            duration: exercises[l - 1].duration,
            date: exercises[l - 1].date.toDateString()
          };
          
          console.log(response);
          res.json(response);
          
        });
      }
    }
  );
});    

//Handle get requests.

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
