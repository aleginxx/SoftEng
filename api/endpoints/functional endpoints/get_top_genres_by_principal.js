const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function getTopGenresByPrincipalQuery(principalName, numGenres) {
    let query = `
        SELECT
            n.primary_name AS principal_name,
            g.GenreName AS genre,
            MAX(r.average_rating) AS max_rating
        FROM
            softeng.Principals p
        JOIN
            softeng.Name n ON p.n_const_principals = n.n_const
        JOIN
            softeng.Title_Basics tb ON p.t_const_principals = tb.T_const
        JOIN
            softeng.Title_Basics_Has_Genres tbg ON tb.T_const = tbg.Title_Basics_T_const
        JOIN 
            softeng.Genres g ON tbg.Genres_GenreID = g.GenreID
        LEFT JOIN
            softeng.Ratings r ON tb.T_const = r.t_const_ratings
        WHERE
            n.primary_name = ?
        GROUP BY
            g.GenreName
        ORDER BY
            max_rating DESC
        LIMIT
            ?;
    `;

    return new Promise((resolve, reject) => {
        DB.query(query, [principalName, numGenres], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getTopGenresByPrincipalEndpoint(req, res) {
    let principalName = req.params.principalName;
    let numGenres = parseInt(req.params.numGenres);
    try {
        const genresList = await getTopGenresByPrincipalQuery(principalName, numGenres);
        if (genresList.length === 0) {
            return res.status(204).send("No Data");
        }
        sendFinalResult(req, res, genresList);
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

router.get('/getTopGenresByPrincipal/:principalName/:numGenres', getTopGenresByPrincipalEndpoint);

module.exports = router;
