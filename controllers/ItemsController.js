const sqlQuery = require('../config/db');

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
    }
}