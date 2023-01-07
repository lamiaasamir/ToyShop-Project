const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'shop'
});

connection.connect();
// Create a new cart for a user
function createCart(userId) {
  connection.query('INSERT INTO carts (user_id) VALUES (?)', [userId], function (error, results, fields) {
    if (error) throw error;
    console.log('Created a new cart for user ', userId);
  });
}

// Add an item to a user's cart
function addToCart(userId, itemId, quantity) {
  connection.query('INSERT INTO cart_items (user_id, item_id, quantity) VALUES (?, ?, ?)', [userId, itemId, quantity], function (error, results, fields) {
    if (error) throw error;
    console.log('Added ', quantity, 'of item ', itemId, 'to the cart of user ', userId);
  });
}

// Remove an item from a user's cart
function removeFromCart(userId, itemId) {
  connection.query('DELETE FROM cart_items WHERE user_id = ? AND item_id = ?', [userId, itemId], function (error, results, fields) {
    if (error) throw error;
    console.log('Removed item ', itemId, 'from the cart of user ', userId);
  });
}

// Get the items in a user's cart
function getCart(userId) {
  connection.query('SELECT i.*, ci.quantity FROM cart_items ci INNER JOIN items i ON ci.item_id = i.id WHERE ci.user_id = ?', [userId], function (error, results, fields) {
    if (error) throw error;
    console.log('Items in the cart of user ', userId, ': ', results);
  });
}

connection.end();
