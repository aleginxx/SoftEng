const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');
const { v4: uuidv4 } = require('uuid');

function createUserQuery(userData) {
    let checkUsernameQuery = `
        SELECT *
        FROM softeng.user
        WHERE username = ?;
    `;
    let checkEmailQuery = `
        SELECT *
        FROM softeng.user
        WHERE email = ?;
    `;
    let insertUserQuery = `
        INSERT INTO softeng.user (
            user_id,
            username,
            password,
            first_name,
            last_name,
            age,
            is_verified,
            email
        ) VALUES (?, ?, ?, ?, ?, ?, 1, ?);
    `;
    let newUserId = uuidv4();

    return new Promise((resolve, reject) => {
        DB.query(checkUsernameQuery, [userData.username], (err, results) => {
            if (err) {
                reject(err);
            } else if (results.length === 1) {
                resolve("This username already exists.");
            } else {
                DB.query(checkEmailQuery, [userData.email], (err, results) => {
                    if (err) {
                        reject(err);
                    } else if (results.length === 1) {
                        resolve("This email is already used.");
                    } else {
                        DB.query(insertUserQuery, [
                            newUserId,
                            userData.username,
                            userData.password,
                            userData.firstName,
                            userData.lastName,
                            userData.age,
                            userData.email
                        ], (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve("User successfully created.");
                            }
                        });
                    }
                });
            }
        });
    });
}

async function createUserEndpoint(req, res) {
    try {
        const resultMessage = await createUserQuery(req.body);
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

router.post('/createUser', createUserEndpoint);

module.exports = router;