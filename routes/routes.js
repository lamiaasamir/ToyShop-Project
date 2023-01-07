const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'shop'
  });
//import controllers
const ItemsController = require('../controllers/ItemsController');

const { calculateMac } = require('request/lib/hawk');
const sqlQuery = require('../config/db');

/* define routes */
router.get('/', ItemsController.getItems);


// define route to catch the items under which brand
router.get('/brand/:brand', ItemsController.getItemsByBrand);

router.post('/add_to_cart', ItemsController.add_cart);
router.get('/cart', ItemsController.getCart);
router.get('/filter',ItemsController.filterProducts);
router.get('/products', ItemsController.filterProducts);
router.get('/cart/update/:product', ItemsController.updateCart);


// This route allows the user to search for items by name, brand, or price range

router.get('/items', async(req, res) => {
    // Get the query parameters from the request
    const { searchValue, searchType} = req.query;
  
    // Construct the WHERE clause of the SQL query
    let whereClause = '';
    let params = [];
    if (searchType=="name" ){
        whereClause += ' AND name LIKE ?';
        params.push(`%${searchValue}%`);
    }
    if (searchType=="brand" ){
        whereClause += ' AND brand LIKE ?';
        params.push(`%${searchValue}%`);
    }
    
    if (searchType=="minPrice" ){
        whereClause += ` AND price >= ${Float.parseFloat(searchValue)}?`; //? needed?
        params.push(searchValue);
    }

    
    if (searchType=="maxPrice" ){
        whereClause += ` AND price <= ${Float.parseFloat(searchValue)}?`; //? needed ?
        params.push(searchValue);

    }
  
    const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
    // Execute the SQL query using prepared statements
    connection.query(`SELECT * FROM items WHERE 1=1${whereClause}`, params, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error querying the database' });
        return;
      }
      res.render('items/products', { items:results, brands});
      
      
    });
    
  });


module.exports = router;



    

