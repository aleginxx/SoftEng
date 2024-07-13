const DB = require('../database').connection;
const express = require('express');
const router = express.Router();

function rateTitleQuery(tConstRatings, rating) {
    let selectQuery = `
        SELECT average_rating, num_votes 
        FROM softeng.Ratings 
        WHERE t_const_ratings = ?;
    `;
    let updateQuery = `
        UPDATE softeng.Ratings
        SET num_votes = ?, average_rating = ?
        WHERE t_const_ratings = ?;
    `;

    return new Promise((resolve, reject) => {
        DB.query(selectQuery, [tConstRatings], (err, results) => {
            if (err) {
                reject(err);
            } else if (results.length === 0) {
                resolve('Title not found');
            } else {
                let currentAverageRating = results[0].average_rating;
                let currentNumVotes = results[0].num_votes;
                let newNumVotes = currentNumVotes + 1;
                let newAverageRating = ((currentAverageRating * currentNumVotes) + rating) / newNumVotes;

                DB.query(updateQuery, [newNumVotes, newAverageRating, tConstRatings], (err, updateResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Title rating updated successfully.");
                    }
                });
            }
        });
    });
}

async function rateTitleEndpoint(req, res) {
    try {
        const resultMessage = await rateTitleQuery(req.body.tConstRatings, req.body.rating);
        res.status(200).send(resultMessage);
    } catch (err) {
        console.error(err);
        if (err.message === 'Title not found') {
            return res.status(404).send(err.message);
        } else if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

router.post('/rateTitle', rateTitleEndpoint);

module.exports = router;
