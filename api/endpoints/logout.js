const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

function verifyToken(req, res, next) {
    let token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).send('Not Authorized 1 ');
    }

    jwt.verify(token, 'HJ9BWQ1CF8x7foi0EUzpMY6gLm2PITtZ', { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).send('Not Authorized 2 ');
        }

        console.log('Decoded Token:', decoded);

        req.user = decoded;
        next();
    });
}

router.get('/logout', verifyToken, (req, res) => {
    res.status(200).send('Logout successful');
});

module.exports = router;
