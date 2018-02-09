const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./config/database');

require('dotenv').config({ path: './variables.env' });

const app = express();

//routes

const poll = require('./routes/poll');

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Enable CORS
app.use(cors());

app.use('/poll', poll);

const port = process.env.PORT || 4343;

// Start Server
app.listen(port, () => console.log(`Server at port ${port}`));