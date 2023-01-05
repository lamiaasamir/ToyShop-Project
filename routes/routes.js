const express = require('express');
const router = express.Router();

//import controllers
const ItemsController = require('../controllers/ItemsController');

/* define routes */
router.get('/', ItemsController.getItems);


// define route to catch the items under which brand
router.get('/brand/:brand', ItemsController.getItemsByBrand);

router.post('/add_to_cart', ItemsController.add_cart);
router.get('/cart', ItemsController.getCart);
router.get('/products', ItemsController.getProducts);
router.get('/cart/update/:product', ItemsController.updateCart);



router.post('/filter', (req, res) => {
    // Extract the filters from the request body
    const filters = {
      brand: req.body.brand || [],
      price: {
        min: req.body['price-min'] || undefined,
        max: req.body['price-max'] || undefined
      }
    };
  
    // Construct the MySQL query
    let sql = 'SELECT * FROM products WHERE';
  
    if (filters.brand.length > 0) {
      sql += ` brand IN ('${filters.brand.join("','")}')`;
    }
  
    if (filters.price.min !== undefined && filters.price.max !== undefined) {
      sql += ` AND price BETWEEN ${filters.price.min} AND ${filters.price.max}`;
    }
  
    // Execute the query
    connection.query(sql, (error, items) => {
      if (error) throw error;
  
      // Send the filtered products back to the client
      console.log(items)
      res.json(items);
    });
  });


module.exports = router;



    

