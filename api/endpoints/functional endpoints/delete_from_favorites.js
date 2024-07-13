const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function deleteFromFavoritesQuery(userId, movieId) {
    let selectQuery = `
        SELECT favourite
        FROM softeng.user_has_seen_title
        WHERE user_user_id = ? AND Title_Basics_T_const = ?;
    `;

    let updateQuery = `
        UPDATE softeng.user_has_seen_title
        SET favourite = 0
        WHERE user_user_id = ? AND Title_Basics_T_const = ? AND favourite = 1;
    `;

    return new Promise((resolve, reject) => {
        DB.query(selectQuery, [userId, movieId], (err, results) => {
            if (err) {
                reject(err);
            } else if (results.length === 0) {
                resolve({ message: "User has not seen this movie or it's not marked as favourite.", statusCode: 204 });
            } else {
                let currentFavourite = parseInt(results[0].favourite, 10); // Parse integer here
                if (currentFavourite === 0) {
                    resolve({ message: "Already not a favourite.", statusCode: 200 });
                } else {
                    DB.query(updateQuery, [userId, movieId], (err, updateResults) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ message: "Favourite status removed.", statusCode: 200 });
                        }
                    });
                }
            }
        });
    });
}

async function deleteFromFavoritesEndpoint(req, res) {
    let userId = req.body.userId;
    let movieId = req.body.movieId;
    try {
        const { message, statusCode } = await deleteFromFavoritesQuery(userId, movieId);
        res.status(statusCode).send(message);
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

router.post('/deleteFromFavorites', deleteFromFavoritesEndpoint);

module.exports = router;
