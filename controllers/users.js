const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'shop'
});

connection.connect();

// Create a new user with a hashed password
async function createUser(username, password) {
  // Generate a salt for the password hash
  const salt = await bcrypt.genSalt();
  // Hash the password with the salt
  const hash = await bcrypt.hash(password, salt);
  // Insert the username and password hash into the users table
  connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function (error, results, fields) {
    if (error) throw error;
    console.log('Created a new user: ', username);
  });
}

// Check if the provided password matches the password hash of the user
async function checkPassword(username, password) {
  // Query the password hash of the user
  connection.query('SELECT password FROM users WHERE username = ?', [username], async function (error, results, fields) {
    if (error) throw error;
    // Compare the provided password with the password hash
    const match = await bcrypt.compare(password, results[0].password);
    console.log('The provided password is ', match ? 'correct' : 'incorrect');
  });
}

// Change the password of a user
async function changePassword(username, password) {
  // Generate a salt for the new password hash
  const salt = await bcrypt.genSalt();
  // Hash the new password with the salt
  const hash = await bcrypt.hash(password, salt);
  // Update the password hash of the user in the users table
  connection.query('UPDATE users SET password = ? WHERE username = ?', [hash, username], function (error, results, fields) {
    if (error) throw error;
    console.log('Changed the password of user ', username);
  });
}

connection.end();
