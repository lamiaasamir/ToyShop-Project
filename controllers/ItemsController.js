const { calculateMac } = require('request/lib/hawk');
const sqlQuery = require('../config/db');

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
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            res.render('items/index', { items });
        } catch (err) {
            res.status(500).send(err);
        }
    },

    getItemsByBrand: async (req, res) => {
        // ...
    },

    add_cart: async (req, res) => {
        var id = req.body.id;
        var name = req.body.name;
        var brand = req.body.brand;
        var description = req.body.description;
        var price = req.body.price;
        var image = req.body.image;
        var product = {id: id, name: name, brand:brand, description: description, price: price, image:image};

        if (req.session.cart){
            var cart = req.session.cart;
            if (!isProductInCart(cart, id)){
                cart.push(product)
            }
            else{
                req.session.cart = [product];
                var cart = req.session.cart;
            }

            calculateTotal(cart, req);
            res.redirect('/cart');


        }
    },
    getCart: async (req, res) => {
        var cart = req.session.cart;
        var total = req.session.total;

        res.render('items/cart', {cart: cart, total:total});
        

        
    }
}