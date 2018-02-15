const mongoose = require('mongoose');
require('dotenv').config({ path: '../variables.env' });

// Map global promises
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/voting-app')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));