const express = require('express');
const path = require('path');
const router = express.Router();
const DB = require('../database').connection;

// Email Verification Endpoint
function emailVerificationQuery(userId) {
    let updateQuery = `
        UPDATE softeng.user
        SET is_verified = 1
        WHERE user_id = ?;
    `;

    return new Promise((resolve, reject) => {
        DB.query(updateQuery, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve("Email verification status updated successfully.");
            }
        });
    });
}

async function emailVerificationEndpoint(req, res) {
    try {
        const resultMessage = await emailVerificationQuery(req.body.userId);
        res.status(200).send(resultMessage);
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

router.post('/emailVerification', emailVerificationEndpoint);


module.exports = router;
