// import express
const express = require('express');
var ejs = require ('ejs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var flash = require('connect-flash');




// import dotenv to read .env file
require('dotenv').config();

// create express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "secret"}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());


// import routes
const routes = require('./routes/routes');
app.use(routes);

// define images folder
//app.use('/images', express.static('./images'));
app.use(express.static('public'));


// define styles folder
//app.use('/styles', express.static('./views/styles'));

// set view engine
app.set('view engine', 'ejs');

// set view directory
app.set('views', 'views');

app.listen('3000', () => {
    console.log('Listening to port 3000..');
});

// // Set the search filters
// const filters = {
//   brand: req.body.brand || [],
//   price: {
//     min: req.body['price-min'] || undefined,
//     max: req.body['price-max'] || undefined
//   }
// };
// app.get('/', function(req, res){
//     res.render('items/index')
// });
