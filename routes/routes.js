const express = require('express');
const router = express.Router();

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
router.get('/payment',ItemsController.pay);





module.exports = router;



    

