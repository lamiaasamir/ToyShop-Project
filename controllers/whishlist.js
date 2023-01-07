const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'shop'
});

connection.connect();

// Create a new wish list for a user
function createWishList(userId) {
  connection.query('INSERT INTO wish_lists (user_id) VALUES (?)', [userId], function (error, results, fields) {
    if (error) throw error;
    console.log('Created a new wish list for user ', userId);
  });
}

// Add an item to a user's wish list
function addToWishList(userId, itemId) {
  connection.query('INSERT INTO wish_list_items (user_id, item_id) VALUES (?, ?)', [userId, itemId], function (error, results, fields) {
    if (error) throw error;
    console.log('Added item ', itemId, 'to the wish list of user ', userId);
  });
}

// Remove an item from a user's wish list
function removeFromWishList(userId, itemId) {
  connection.query('DELETE FROM wish_list_items WHERE user_id = ? AND item_id = ?', [userId, itemId], function (error, results, fields) {
    if (error) throw error;
    console.log('Removed item ', itemId, 'from the wish list of user ', userId);
  });
}

// Get the items in a user's wish list
function getWishList(userId) {
  connection.query('SELECT i.* FROM wish_list_items wli INNER JOIN items i ON wli.item_id = i.id WHERE wli.user_id = ?', [userId], function (error, results, fields) {
    if (error) throw error;
    console.log('Items in the wish list of user ', userId, ': ', results);
  });
}

connection.end();
