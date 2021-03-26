require('dotenv').config();
require('mongoose');
require('mongodb');

/** 1) Install & Set up mongoose */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

//Require mongoose schema.
const Schema = mongoose.Schema;

//Creates a schema for a person.
var personSchema = new Schema ({
  name: {type: String, required: true},
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model('Person', personSchema);

var createAndSavePerson = function (done) {
  var janeFonda = new Person({name: "Jane Fonda", age: 85, favoriteFoods: ["pizza", "lasagna"]});

  janeFonda.save(function(err, data) {
    if(err) return console.log(err);
    done(null, data)
  });
};

const createManyPeople = function (arrayOfPeople, done) {
  Person.create(arrayOfPeople, function(err, people){
    if(err) return console.log(err);
    done(null, people);
  });
};

const findPeopleByName = function (personName, done) {
  Person.find({name: personName}, function(err, personFound){
    if(err) return console.log(err);
    done(null, personFound);
  });
};

const findOneByFood = function(food, done) {
  Person.findOne({favoriteFoods: [food]}, function(err, personFound) {
    if(err) return console.log(err);
    done(null, personFound);
  });
};

const findPersonById = function (personId, done) {
  Person.findById({_id: personId}, function(err, personFound) {
    if(err) return console.log(err);
    done(null, personFound);
  });
};


const findEditThenSave = function (personId, done) {
  const foodToAdd = "hamburger";
  Person.findById({_id: personId}, function(err, personToEdit) {
    if(err) return console.log(err);

    personToEdit.favoriteFoods.push(foodToAdd);
    personToEdit.save(function(err, data){
      done(null, data);
    });    
  });
};

const findAndUpdate = function (personName, done) {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, function(err, personToEdit) {
    if(err) return console.log(err);
    done(null, personToEdit);
  });
};

const removeById = function (personId, done) {
  Person.findOneAndRemove({_id: personId}, function(err, personToDelete) {
    if(err) return console.log(err);
    done(null, personToDelete);
  });
};

const removeManyPeople = function (done) {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, function (err, response) {
    if(err) return console.log(err);
    done(null, response);
  });
};

const queryChain = function (done) {
  const foodToSearch = "burrito";

  Person.find({favoriteFoods: foodToSearch})
              .sort({name: 1})
              .limit(2)
              .select({age: 0})
              .exec(function (err, data) {
                if(err) return console.log(err);
                done(null, data);
              });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
