const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function callUserGenrePercentageProcedure(userId) {
    // Call the stored procedure
    let callProcedureQuery = `CALL user_genre_percentage(?);`;

    return new Promise((resolve, reject) => {
        DB.query(callProcedureQuery, [userId], (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]); // Assuming the result is the third result set returned by the stored procedure
            }
        });
    });
}

async function userGenrePercentageEndpoint(req, res) {
    let userId = req.params.userId;

    try {
        const result = await callUserGenrePercentageProcedure(userId);

        if (result.length === 0) {
            return res.status(204).send("No Data");
        }

        // Transform the result to JSON format
        let genrePercentages = result.map(row => {
            return {
                "GenreName": row.GenreName,
                "Percentage": row.percentage
            };
        });

        sendFinalResult(req, res, genrePercentages);
    } catch (err) {
        console.error("Error calling stored procedure:", err);
        if (err.code === 'ER_NO_SUCH_USER') { // Custom error code if user not found
            return res.status(404).send("User not found");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

router.get('/userGenrePercentage/:userId', (req, res) => {
    userGenrePercentageEndpoint(req, res);
});

module.exports = router;
