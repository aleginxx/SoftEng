const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const DB = require('./database');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const app = express();

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// Function to generate a JWT token
function generateToken(username) {
    const secretKey = 'HJ9BWQ1CF8x7foi0EUzpMY6gLm2PITtZ';
    return jwt.sign({ username }, secretKey, { expiresIn: '1h' });
}

router.get('/login', (req, res) => {
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

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
    DB.connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.connection.config.user !== 'root' || DB.connection.config.password !== '') {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).send('Internal Service Error');
            }
        }

        if (results.length > 0) {
            // Authentication successful
            const token = generateToken(username);
            console.log('Token:', token); 

            // Redirect to login-success
            res.redirect('/ntuaflix_api/user');
        } else {
            // Authentication failed
            res.status(401).redirect('/ntuaflix_api/login');
        }
    });
});

router.get('/user', (req, res) => {
    const phpPath = "C:\\tools\\php83\\php.exe"
    const filePath = path.join(__dirname, '..', '..', 'front-end', 'user.php');

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

function loginwithcredentials(req, res) {
    const username = req.params.username;
    const password = req.params.password;

    const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
    DB.connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.connection.config.user !== 'root' || DB.connection.config.password !== '') {
                return res.status(500).send('Internal Server Error');
            } else {
                return res.status(401).send('Not Authorized');
            }
        }

        if (results.length > 0) {
            // Authentication successful
            const token = generateToken(username);
            res.json({ token });
        } else {
            // Authentication failed
            res.status(401).send('Not Authorized');
        }
    });
}

router.post('/login/:username/:password', (req, res) => {
    const { username, password } = req.params;

    loginwithcredentials(req, res);
});

module.exports = router;
