const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./database'); 

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/admin/users/:username', (req, res) => {
    const requestedUsername = req.params.username;

    // Check if the user with the requested username exists
    const userQuery = 'SELECT * FROM user WHERE username = ?';
    database.connection.query(userQuery, [requestedUsername], (error, results) => {
        if (error) {
            console.error('Error querying the database:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            // User found, send user information
            const user = results[0];
            res.json({
                user_id: user.user_id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                is_verified: user.is_verified
            });
        } else {
            // User not found
            res.status(404).send('User not found');
        }
    });
});

module.exports = router;
