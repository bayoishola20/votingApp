const mongoose = require('mongoose');
const keys = require('./keys');

// Map global promises
mongoose.Promise = global.Promise;

mongoose.connect(keys.dbURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));