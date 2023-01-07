const { calculateMac } = require('request/lib/hawk');
const sqlQuery = require('../config/db');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shop'
  });


function isProductInCart(cart, id){
    for(let i=0; i<cart.length; i++){
        if (cart[i].id == id){
            return true;
        }
    }
    return false;
}

function calculateTotal(cart, req){
    total = 0;
    for(let i=0; i<cart.length; i++){
        // if (cart[i.sale_price]){
        //     total = total +(cart[i].sale_price*cart[i].quantity)
        // }
        // else{
        total = total +(cart[i].price*cart[i].quantity)
        // }
    }
    req.session.total = total;
    return total;
}
module.exports = {
    getItems: async (req, res) => {
        try {
            const items = await sqlQuery('SELECT * FROM items');
            const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            res.render('items/index', { items , brands});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    sortItems: async (req, res) => { 
        // Get the query parameters from the request 
        const {sortType} = req.query; 
        // let params = []; 
        let Clause = ''; 
        let query = 'SELECT * FROM items'; 
        if (sortType=="nameASC" ){ 
             
            query+= ' ORDER BY name ASC'; 
        } 
        if (sortType=="brandASC" ){ 
            query+= ' ORDER BY brand ASC'; 
        } 
        if (sortType=="priceASC" ){ 
            query+= ' ORDER BY price ASC'; 
        }        
        if (sortType=="nameDESC" ){ 
            query+= ' ORDER BY name DESC'; }
        if (sortType=="brandDESC" ){ 
            query+= ' ORDER BY brand DESC'; 
        } 
        if (sortType=="priceDESC" ){ 
            query+= ' ORDER BY price DESC'; 
        }        
        try{ 
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand'); 
        const items = await sqlQuery(query); 
     
        res.render('items/products', { items, brands});} 
        catch (err) { 
            res.status(500).send(err); 
        } 
            
    } 
   ,

    searchItems: async (req, res) => {
        console.log("hereeeeeeeeeeeeeeeeee")
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
        
        if (searchType=="priceMin" ){
            whereClause += ` AND price >= ?`; //? needed?
            params.push(searchValue);
        }
    
        
        if (searchType=="priceMax" ){
            console.log("here")
            whereClause += ` AND price <= ?`; //? needed ?
            params.push(searchValue);
    
        }
      
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
        // Execute the SQL query using prepared statements
        console.log("here")
        connection.query(`SELECT * FROM items WHERE 1=1${whereClause} LIMIT 5`, params, (error, results) => {
          if (error) {
            res.status(500).send({ error: 'Error querying the database' });
            return;
          }
          res.send(results);
          //res.render('items/products', { items:results, brands});
          
          
        });
     
     
   }
,searchItems: async (req, res) => {
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
    
    if (searchType=="priceMin" ){
        whereClause += ` AND price >= ?`; //? needed?
        params.push(searchValue);
    }

    
    if (searchType=="priceMax" ){
        console.log("here")
        whereClause += ` AND price <= ?`; //? needed ?
        params.push(searchValue);

    }
  
    const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
    // Execute the SQL query using prepared statements
    connection.query(`SELECT * FROM items WHERE 1=1${whereClause} LIMIT 5`, params, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error querying the database' });
        return;
      }
      res.send(results);
      //res.render('items/products', { items:results, brands});
      
      
    });
 
 
}
,searchItemsClick: async (req, res) => {
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

if (searchType=="priceMin" ){
    whereClause += ` AND price >= ?`; //? needed?
    params.push(searchValue);
}


if (searchType=="priceMax" ){
    console.log("here")
    whereClause += ` AND price <= ?`; //? needed ?
    params.push(searchValue);

}

const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
// Execute the SQL query using prepared statements
console.log("here")
connection.query(`SELECT * FROM items WHERE 1=1${whereClause} LIMIT 5`, params, (error, results) => {
  if (error) {
    res.status(500).send({ error: 'Error querying the database' });
    return;
  }
  //res.send(results);
  res.render('items/products', { items:results, brands});
  
  
});


},

getItemsById: async (req, res) => {
    var id = req.params.id;
    try {
        const items = await sqlQuery("SELECT * FROM items where id = "+ id+"");
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
        res.render('items/single_product', { items , brands});


        //res.render('items/single_brand', { items , brand});
    } catch (err) {
        res.status(500).send(err);
    }
},

    getItemsByBrand: async (req, res) => {
        var brand = req.params.brand;
        try {
            const items = await sqlQuery("SELECT * FROM items where brand = '"+ brand+"'");
            const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
            res.render('items/products', { items , brands});


            //res.render('items/single_brand', { items , brand});
        } catch (err) {
            res.status(500).send(err);
        }
    },

    add_cart: async (req, res) => {
        var id = req.body.id;
        var name = req.body.name;
        var brand = req.body.brand;
        var description = req.body.description;
        var price = parseInt(req.body.price, 10);
        var total = parseInt(req.body.price, 10);
        var image = req.body.image;
        var quantity= 1;

        var product = {id: id, name: name, brand:brand, description: description, price: price, image:image, quantity: quantity, total:total};
        if (req.session.cart){
            var cart = req.session.cart;
            var newItem = true;

            for(let i=0; i<cart.length; i++){
                if (cart[i].id == id){
                    cart[i].quantity++;
                    cart[i].total += cart[i].price;
                    newItem= false;
                }
            }

            if (newItem){
                cart.push(product)
            }

            calculateTotal(cart, req);
            req.flash('success', 'Product added!');
            res.redirect('back');

        }
        else{
            req.session.cart = [];
            var cart = req.session.cart;
            cart.push(product);
            calculateTotal(cart, req);
            req.flash('success', 'Product added!');
            res.redirect('back');

        }
    },
    getCart: async (req, res) => {
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
        
        if(!req.session.cart){
            req.session.cart = [];
        }
        var cart = req.session.cart;
        var total = req.session.total;

        res.render('items/cart', {cart: cart, total:total, brands: brands});
           
    },
    getProducts: async (req, res) => {
        

        try {
            const items = await sqlQuery('SELECT * FROM items');
            const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            res.render('items/products', { items, brands});
        } catch (err) {
            res.status(500).send(err);
        }
           
    },
    go_checkout: async(req, res) => {

        if (!req.session.cart)
            req.session.cart = [];
            
        var cart = req.session.cart;
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
        var total = req.session.total
        res.render('items/checkout', {total:total, brands:brands, cart:cart})
    },
    place_order: async(req, res) => {
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var city = req.body.city;
        var address = req.body.address;
        var cost = req.session.total;
        var status = "not paid";
        var date = new Date();

        const con = mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"",
            database:"shop"
        })

        con.connect((err)=>{
            if (err){
                console.log(err)
            }
            else{
                var query="INSERT INTO orders(cost, name, email, status, city, address,phone, date) VALUES ?";
                var values = [[cost, name, email, status, city, address, phone, date]];
                con.query(query,[values],(err, result)=>{
                    res.redirect('/payment')
                })
            }
        
        })


    },
    pay: async (req, res)=>{
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
        var total = req.session.total
        res.render('items/payment', {total:total,brands:brands})
    },
    updateCart: async (req, res) => {
        var id = req.params.product;
        var cart = req.session.cart;
        var action = req.query.action;
        var total = req.session.total;
        for (let i=0; i < cart.length; i++) {
            if (cart[i].id== id) {
                switch (action) {
                    case "add":
                        cart[i].quantity++;
                        cart[i].total += cart[i].price;
                        break;
                    case "remove":
                        cart[i].quantity--;
                        cart[i].total -= cart[i].price;
                        if (cart[i].quantity == 0)
                            cart.splice(i, 1);
                        break;
                    case "clear":
                        cart.splice(i, 1);
                        break;
                    default:
                        console.log("update problem");
                        break;
                    
        
                }
                break;
            }
        
    }
    calculateTotal(cart, req);
    // req.flash('success', 'cart updated');
    res.redirect('back');
    },

 
   


}