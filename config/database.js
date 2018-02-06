const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://bayoishola20:bayoishola20@ds225078.mlab.com:25078/voting-app')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));