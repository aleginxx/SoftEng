const DB = require('../database').connection;
const express = require('express');
const router = express.Router();

function addToFavoritesQuery(userId, movieId) {
    let selectQuery = `
        SELECT favourite
        FROM softeng.user_has_seen_title
        WHERE user_user_id = ? AND Title_Basics_T_const = ?;
    `;

    let updateQuery = `
        UPDATE softeng.user_has_seen_title
        SET favourite = 1
        WHERE user_user_id = ? AND Title_Basics_T_const = ? AND favourite = 0;
    `;

    return new Promise((resolve, reject) => {
        DB.query(selectQuery, [userId, movieId], (err, results) => {
            if (err) {
                reject(err);
            } else if (results.length === 0) {
                resolve({ message: "User has not seen this movie.", status: 404 });
            } else {
                // Adjust here: Parsing favourite as integer
                let currentFavourite = parseInt(results[0].favourite, 10);
                if (currentFavourite === 1) {
                    resolve({ message: "Already a favorite.", status: 200 });
                } else {
                    DB.query(updateQuery, [userId, movieId], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ message: "Favorite status updated.", status: 200 });
                        }
                    });
                }
            }
        });
    });
}

async function addToFavoritesEndpoint(req, res) {
    let userId = req.body.userId;
    let movieId = req.body.movieId;
    try {
        const { message, status } = await addToFavoritesQuery(userId, movieId);
        res.status(status).send(message);
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

router.post('/addToFavorites', addToFavoritesEndpoint);

module.exports = router;
