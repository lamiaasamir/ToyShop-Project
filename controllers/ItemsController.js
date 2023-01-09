const { calculateMac } = require('request/lib/hawk');
const sqlQuery = require('../config/db');
const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'shop'
//   });

const connection = mysql.createConnection({
  host: 'ls-ec92347fa4a7a46898eb0b7ce37632829fb67470.ccrbkmwhyu9z.eu-central-1.rds.amazonaws.com',
  port: 3306,
  user: 'shop',
  password: 'Ssy%7?XV*e5b0aPshTB{vI>G1Q_cQe%d'
});

/***********************functions********************************/
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
        total = total +(parseFloat(parseFloat(cart[i].price).toFixed(2))*cart[i].quantity)
        // }
        total = parseFloat(parseFloat(total).toFixed(2))
    }
    req.session.total = total;
    return total;
}
module.exports = {
    /*********************get*********************************/
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
            var page = parseInt(req.query.page) || 1;
            var perPage = parseInt(req.query.per_page) || 7;
            var offset = (page - 1) * perPage;
            let query = 'SELECT * FROM items';
            query+= " where brand = '"+ brand+"'";
            query+= 'LIMIT ' + perPage + ` OFFSET ` + offset + ``
            const items = await sqlQuery(query);
            const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
            res.render('items/products', { items , brands, page});


            //res.render('items/single_brand', { items , brand});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    /************************************sort*****************************/
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
    /*****************************search*********************************/
    searchItems: async (req, res) => {
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

    //*******************************cart ***************************************/

    add_cart: async (req, res) => {
        var id = req.body.id;
        var name = req.body.name;
        // var brand = req.body.brand;
        // var description = req.body.description;
        var sale_price = parseInt(req.body.sale_price);
        var price = parseInt(req.body.price, 10);
        var total = parseInt(req.body.price, 10);
        var image = req.body.image;
        var quantity= 1;
        if (sale_price) {
            price = sale_price;
            total = sale_price;
        }
        var product = {id: id, name: name, price: price, image:image, quantity: quantity, total:total};
        if(!req.session.cart){
            req.session.cart = [];
            const query = 'SELECT p.name, c.product_id, c.quantity, p.price, p.sale_price, p.image FROM cart c JOIN items p ON c.product_id = p.id';
            try {
            var result = await sqlQuery(query);
            function myfunc(item){
                console.log(item)
                if(item.sale_price){
                    product = {id: item.product_id, name: item.name, price: parseFloat(parseFloat(item.sale_price).toFixed(2)), image:item.image, quantity: item.quantity, total:parseFloat(parseFloat(item.sale_price).toFixed(2))*parseFloat(parseFloat(item.quantity).toFixed(2))};
                }
                else{
                    product = {id: item.product_id, name: item.name, price: parseFloat(parseFloat(item.price).toFixed(2)), image:item.image, quantity: item.quantity, total:parseFloat(parseFloat(item.price).toFixed(2))*parseFloat(parseFloat(item.quantity).toFixed(2))};
                }
                req.session.cart.push(product)
            }
            result.forEach(myfunc);

            // req.session.cart = result.map(row => ({ id: row.product_id, quantity: row.quantity , name: row.name,  price: parseFloat(parseFloat(row.price).toFixed(2)), image: row.image, total:parseFloat(parseFloat(row.price).toFixed(2))*parseFloat(parseFloat(row.quantity).toFixed(2))}));
            } catch (err) {
            console.error(err);
            }

        }
        
        var cart = req.session.cart;

        const items = await sqlQuery("SELECT * FROM cart where product_id = "+ id+"");
        console.log(cart);
        if(items.length<1){
            connection.query(
                'INSERT INTO cart SET ?',
                { product_id: id },
                (error, results) => {
                    if (error) throw error;
                    console.log(results);
                }
                );
                cart.push(product)

        }
        else{
            var newQuantity = items[0].quantity+1
            connection.query(
                
                'UPDATE cart SET quantity = ? WHERE product_id = ?',
                [newQuantity, id],
                (error, results) => {
                    if (error) throw error;
                }
                );
                
            console.log(cart);
            for (let i=0; i < cart.length; i++) {
                if (cart[i].id== items[0].product_id) {
                    cart[i].quantity++;
                    cart[i].total += parseFloat(cart[i].price).toFixed(2);
                }
            }
        }
        calculateTotal(cart, req);
        req.flash('success', 'Product added!');
        res.redirect('back');

    },
    getCart: async (req, res) => {
        const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
        if(!req.session.cart){
            req.session.cart = [];
            const query = 'SELECT p.name, c.product_id, c.quantity, p.price,p.sale_price,  p.image FROM cart c JOIN items p ON c.product_id = p.id';
            console.log("dddd")

            try {
            var result = await sqlQuery(query);
            console.log(result)
            function myfunc(item){
                console.log(item)
                if(item.sale_price){
                    product = {id: item.product_id, name: item.name, price: parseFloat(parseFloat(item.sale_price).toFixed(2)), image:item.image, quantity: item.quantity, total:parseFloat(parseFloat(item.sale_price).toFixed(2))*parseFloat(parseFloat(item.quantity).toFixed(2))};
                }
                else{
                    product = {id: item.product_id, name: item.name, price: parseFloat(parseFloat(item.price).toFixed(2)), image:item.image, quantity: item.quantity, total:parseFloat(parseFloat(item.price).toFixed(2))*parseFloat(parseFloat(item.quantity).toFixed(2))};
                }
                req.session.cart.push(product)
            }
            result.foreach(myfunc());
            // req.session.cart = result.map(row => ({ id: row.product_id, quantity: row.quantity , name: row.name,  price: parseFloat(parseFloat(row.price).toFixed(2)), image: row.image, total:parseFloat(parseFloat(row.price).toFixed(2))*parseFloat(parseFloat(row.quantity).toFixed(2))}));
            } catch (err) {
            console.error(err);
            }
        }
         console.log(cart)
        var cart = req.session.cart;
        calculateTotal(cart, req);
        var total = req.session.total;

        res.render('items/cart', {cart: cart, total:total, brands: brands});
           
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
                        var newQuantity = cart[i].quantity;
                        cart[i].total += cart[i].price;
                        connection.query(
                            'UPDATE cart SET quantity = ? WHERE product_id = ?',
                            [newQuantity, cart[i].id],
                            (error, results) => {
                                if (error) throw error;
                                console.log(results);
                            }
                            
                            );
                        
                        break;
                    case "remove":
                        cart[i].quantity--;
                        var newQuantity = cart[i].quantity;
                        cart[i].total -= cart[i].price;
                        connection.query(
                            'UPDATE cart SET quantity = ? WHERE product_id = ?',
                            [newQuantity, cart[i].id],
                            (error, results) => {
                                if (error) throw error;
                                console.log(results);
                            }
                            );
                        
                        if (cart[i].quantity == 0){
                            connection.query(
                                'DELETE FROM cart WHERE product_id = ?',
                                [cart[i].id],
                                (error, results) => {
                                  if (error) throw error;
                                  console.log(results);
                                }
                              );
                              cart.splice(i, 1);
                        }
                            
                        break;
                    case "clear":
                        connection.query(
                            'DELETE FROM cart WHERE product_id = ?',
                            [cart[i].id],
                            (error, results) => {
                              if (error) throw error;
                              console.log(results);
                            }
                          );
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
    //**************payment********************************************************/
    go_checkout: async(req, res) => {

        if(! req.session.cart){
            req.session.cart = [];
            const query = 'SELECT p.name, c.product_id, c.quantity, p.price, p.sale_price, p.image FROM cart c JOIN items p ON c.product_id = p.id';

            try {
            const result = await sqlQuery(query);
            function myfunc(item){
                if(item.sale_price){
                    product = {id: item.product_id, name: item.name, price: parseFloat(parseFloat(item.sale_price).toFixed(2)), image:item.image, quantity: item.quantity, total:parseFloat(parseFloat(item.sale_price).toFixed(2))*parseFloat(parseFloat(item.quantity).toFixed(2))};
                }
                else{
                    product = {id: item.product_id, name: item.name, price: parseFloat(parseFloat(item.price).toFixed(2)), image:item.image, quantity: item.quantity, total:parseFloat(parseFloat(item.price).toFixed(2))*parseFloat(parseFloat(item.quantity).toFixed(2))};
                }
                req.session.cart.push(product)
            }
            result.foreach(myfunc());
            
            
            // req.session.cart = result.map(row => ({ id: row.product_id, quantity: row.quantity , name: row.name,  price: parseFloat(parseFloat(row.price).toFixed(2)), image: row.image, total:parseFloat(parseFloat(row.price).toFixed(2))*parseFloat(parseFloat(row.quantity).toFixed(2))}));
            } catch (err) {
            console.error(err);
            }
        }
        var cart = req.session.cart;
        calculateTotal(cart, req);
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
                console.log(23);
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
        const query = `TRUNCATE TABLE cart`;
        try {
        await sqlQuery(query);
        //res.sendStatus(200);
        } catch (err) {
        console.error(err);
        //res.sendStatus(500);
        }
        req.session.cart = []
        res.render('items/payment', {total:total,brands:brands})
    },
    

    //*********filter*****************************/
    filterProducts: async (req, res) => {
        try {
            const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
            var page = parseInt(req.query.page) || 1;
            var perPage = parseInt(req.query.per_page) || 7;
            var offset = (page - 1) * perPage;
            let query = 'SELECT * FROM items where (1=1)';
            // Extract the filters from the request body

            if(req.query.brand != undefined || req.query.price != undefined){
            if(req.query.brand != undefined){
                const filters = {
                brand: req.query.brand || [],
                };
            // Filter the products using the filters
        
            if (filters.brand.length > 0) {
            query += ` and brand IN ("${filters.brand.join('","')}")`;
             }

            } 
            if(req.query.price != undefined){
    
                const filters = {
                price: req.query.price || None
                    };
            
            if (req.query.price) {
                query += ` and (price < ${filters.price} or sale_price < ${filters.price})` ;
            }
          }
    
         }
         query += ' LIMIT ' + perPage + ` OFFSET ` + offset + ``;

            // Execute the query and send the filtered products back to the client
            console.log(query);
            const items = await sqlQuery(query);
            //console.log(items);

            res.render('items/products', { items, brands, page});

        } catch (err) {
            res.status(500).send(err);
        }
           
    } 


}