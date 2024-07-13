const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./database.js');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

function generateUserId() {
    return 'user_' + Date.now();
}

router.get('/admin/usermod/:username/:password', (req, res) => {
    const htmlContent = '<html><body><p>Please do this through Postman.</p></body></html>';
    res.send(htmlContent);
})

router.post('/admin/usermod/:username/:password', (req, res) => {
    const { username, password } = req.params;

    // Check if the username exists in the database
    const checkUserQuery = "SELECT * FROM user WHERE username = ?";
    DB.connection.query(checkUserQuery, [username], (error, results) => {
        if (error) {
            console.error("Error checking username:", error);
            return res.status(500).send("Internal server error");
        }

        if (results.length === 0) {
            const user_id = generateUserId();
            const first_name = 'John'; 
            const last_name = 'Doe';  
            const age = Math.floor(Math.random() * 100) + 1; 
            const email = 'example@example.com'; 

            const insertQuery = "INSERT INTO user (user_id, username, password, first_name, last_name, age, email, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
            DB.connection.query(insertQuery, [user_id, username, password, first_name, last_name, age, email], (insertError) => {
                if (insertError) {
                    console.error("Error adding a new user:", insertError);
                    return res.status(500).send("Error adding a new user");
                }

                res.send('User added successfully');
            });
        } else {
            // If the username exists, update the password
            const updatePasswordQuery = "UPDATE user SET password = ? WHERE username = ?";
            DB.connection.query(updatePasswordQuery, [password, username], (updateError) => {
                if (updateError) {
                    console.error("Error updating password:", updateError);
                    return res.status(500).send("Error updating password");
                }

                res.send('Password updated successfully');
            });
        }
    });
});

module.exports = router;
