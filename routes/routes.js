const express = require('express');
const router = express.Router();

//import controllers
const ItemsController = require('../controllers/ItemsController');

/* define routes */
router.get('/', ItemsController.getItems);

// define route to catch the items under which brand
router.get('/brand/:brand', ItemsController.getItemsByBrand);

module.exports = router;
    

