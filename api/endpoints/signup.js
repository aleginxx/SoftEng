const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const DB = require('./database');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const app = express();

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/signup', (req, res) => {
    const phpPath = "C:\\tools\\php83\\php.exe"
    const filePath = path.join(__dirname, '..', '..', 'front-end', 'credentials.php');

    // Execute PHP file
    const command = `"${phpPath}" "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing PHP file: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
        res.send(stdout);
    });
});

function generateUserId() {
    return 'user_' + Date.now();
}

router.post('/signup', (req, res) => {
    const {
        username,
        password,
        first_name,
        last_name,
        age,
        email
    } = req.body;

    // Check if email already exists
    const emailCheckQuery = "SELECT * FROM user WHERE email = ?";
    DB.connection.query(emailCheckQuery, [email], (emailError, emailResults) => {
        if (emailError) {
            console.error("Error checking email:", emailError);
            return res.status(500).send("Internal server error");
        }

        if (emailResults.length > 0) {
            return res.status(400).send(`This email already exists. Redirecting to login page...<script>
                setTimeout(function() {
                    window.location.href = '/ntuaflix_api/login';
                }, 5000);
            </script>`);
        }

        // Check if username already exists
        const usernameCheckQuery = "SELECT * FROM user WHERE username = ?";
        DB.query(usernameCheckQuery, [username], (usernameError, usernameResults) => {
            if (usernameError) {
                console.error("Error checking username:", usernameError);
                return res.status(500).send("Internal server error");
            }

            if (usernameResults.length > 0) {
                return res.status(400).send(`This username already exists. Redirecting to signup page...<script>
                    setTimeout(function() {
                        window.location.href = '/ntuaflix_api/signup';
                    }, 5000);
                </script>`);
            }

            const user_id = generateUserId();
            const insertQuery = "INSERT INTO user (user_id, username, password, first_name, last_name, age, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            DB.query(insertQuery, [user_id, username, password, first_name, last_name, age, email], (insertError, insertResults) => {
                if (insertError) {
                    console.error("Error creating a new user:", insertError);
                    return res.status(500).send("Error creating a new user");
                }

                res.redirect('/ntuaflix_api/signup-success');
            });
        });
    });
});

router.get('/signup-success', (req, res) => {
    res.send('Signup successful');
});

module.exports = router;
