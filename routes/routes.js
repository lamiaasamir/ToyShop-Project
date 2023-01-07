const express = require('express');
const router = express.Router();

// var mysql = require('mysql');
const fs = require('fs');
const multer = require('multer');
const upload = multer();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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
router.get('/product/:id', ItemsController.getItemsById);

router.post('/add_to_cart', ItemsController.add_cart);
router.get('/cart', ItemsController.getCart);
router.get('/filter',ItemsController.filterProducts);
router.get('/products', ItemsController.filterProducts);
router.get('/cart/update/:product', ItemsController.updateCart);

router.get ('/checkout', ItemsController.go_checkout);
router.post('/place_order', ItemsController.place_order);
router.post('/payment',ItemsController.pay);


// This route allows the user to search for items by name, brand, or price range
router.get('/items', ItemsController.searchItems);
router.get('/sort', ItemsController.sortItems);


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
  
  router.get('/admin/products/:id',async (req, res) => {
    const id = req.params.id;
    const product = await sqlQuery("SELECT image FROM items where id = "+ id);
    connection.query('DELETE FROM items WHERE id = ?', [req.params.id],async (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        
        
        // Delete image file from image folder
        console.log(product)
        product.forEach(myFunction);
        var image
      function myFunction(item) {
          image = item.image;
          }
        console.log(image)
        fs.unlinkSync(`${__dirname}/../public/img/${image}`);
      
        console.log("delete product");
        res.redirect('back');
        //res.send({ success: true });s
      }
    });
  });

  
 
  
module.exports = router;



    

