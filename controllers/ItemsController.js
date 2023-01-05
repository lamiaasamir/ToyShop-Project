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

    getItemsByBrand: async (req, res) => {
        var brand = req.params.brand;
        try {
            const items = await sqlQuery("SELECT * FROM items where brand = '"+ brand+"'");
            const brands = await sqlQuery('SELECT brand, image, COUNT(*) as count FROM items GROUP BY brand');
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            console.log(brand);
            console.log(items);
            


            res.render('items/single_brand', { items , brand});
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
            console.log('product added');
            req.flash('success', 'Product added!');
            res.redirect('back');

        }
        else{
            req.session.cart = [];
            var cart = req.session.cart;
            cart.push(product);
            calculateTotal(cart, req);
            console.log('product added');
            req.flash('success', 'Product added!');
            res.redirect('back');

        }
    },
    getCart: async (req, res) => {
        
        if(!req.session.cart){
            req.session.cart = [];
        }
        var cart = req.session.cart;
        var total = req.session.total;

        res.render('items/cart', {cart: cart, total:total});
           
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
    }




}