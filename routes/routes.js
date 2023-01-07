const express = require('express');
const router = express.Router();

var mysql = require('mysql');
const fs = require('fs');
const multer = require('multer');
const upload = multer();

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shop',
    namedPlaceholders: true,
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

router.get ('/checkout', ItemsController.go_checkout);
router.post('/place_order', ItemsController.place_order);
router.post('/payment',ItemsController.pay);

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


  router.get('/admin/products',async (req, res) => {

    try {
        const items = await sqlQuery('SELECT * FROM items');
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
        res.render('items/admin', { items , brands});
    } catch (err) {
        res.status(500).send(err);
    }
  });
  


  router.post('/admin/products', upload.single('image'), async (req, res) => {

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `${__dirname}/../public/img/${fileName}`;

  fs.writeFile(filePath, req.file.buffer, (error) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      const name = req.body.name;
      const brand = req.body.brand;
      const description = req.body.description;
      const price = req.body.price;

      connection.query('INSERT INTO items (name, brand, description, price, image) VALUES (?, ?, ?, ?, ?)', [name, brand, description, price, fileName], (error, results) => {
        if (error) {
          console.error(error);
          res.sendStatus(500);
        } else {
            console.log("added product")
        res.redirect('back');
          
        }
      });
    }
  });
  });
  
  router.delete('/admin/products/:id', async(req, res) => {
    connection.query('DELETE FROM items WHERE id = ?', [req.params.id], (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send({ success: true });
      }
    });
  });
  
  // Order routes
  
  // router.get('/orders', (req, res) => {
  //   connection.query('SELECT * FROM orders', (error, results) => {
  //     if (error) {
  //       res.status(500).send(error);
  //     } else {
  //       res.send(results);
  //     }
  //   });
  // });
  
  // router.post('/orders', (req, res) => {
  //     const { productId, quantity } = req.body;
  //     connection.query('INSERT INTO orders SET ?', { productId, quantity }, (error) => {
  //       if (error) {
  //         res.status(500).send(error);
  //       } else {
  //         res.send({ success: true });
  //       }
  //     });
  //   });
    
  //   router.put('/orders/:id', (req, res) => {
  //     const { status } = req.body;
  //     connection.query('UPDATE orders SET ? WHERE id = ?', [{ status }, req.params.id], (error) => {
  //       if (error) {
  //         res.status(500).send(error);
  //       } else {
  //         res.send({ success: true });
  //       }
  //     });
  //   });
    
  
module.exports = router;



    

