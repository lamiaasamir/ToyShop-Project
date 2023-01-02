// import express
const express = require('express');

// import dotenv to read .env file
require('dotenv').config();

// create express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// import routes
const routes = require('./routes/routes');
app.use(routes);

// define images folder
app.use('/images', express.static('./images'));

// define styles folder
app.use('/styles', express.static('./views/styles'));

// set view engine
app.set('view engine', 'ejs');

// set view directory
app.set('views', 'views');

app.listen('3000', () => {
    console.log('Listening to port 3000..');
});
