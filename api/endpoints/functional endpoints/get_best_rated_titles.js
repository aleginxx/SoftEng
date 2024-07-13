const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function getBestRatedTitlesQuery(genre, n) {
    let query = `
        SELECT DISTINCT
            tb.Primary_title AS primaryTitle,
            r.average_rating AS averageRating,
            tb.img_url_asset_basics AS titlePoster
        FROM
            softeng.Title_Basics tb
        JOIN
            softeng.Ratings r ON tb.T_const = r.t_const_ratings
        JOIN
            softeng.Title_akas ta ON tb.T_const = ta.Title_Id
        JOIN
            softeng.Title_Basics_Has_Genres tbg ON tb.T_const = tbg.Title_Basics_T_const
        JOIN 
            softeng.Genres g ON tbg.Genres_GenreID = g.GenreID
        WHERE
            FIND_IN_SET(?, g.GenreName) > 0
        ORDER BY
            r.average_rating DESC
        LIMIT
            ?;
    `;

    return new Promise((resolve, reject) => {
        DB.query(query, [genre, n], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getBestRatedTitlesEndpoint(req, res) {
    let genre = req.params.genre;
    let n = parseInt(req.params.n, 10);

    try {
        const resultList = await getBestRatedTitlesQuery(genre, n);
        
        if (resultList.length === 0) {
            return res.status(204).send("No Data");
        }
        
        sendFinalResult(req, res, resultList);
    } catch (err) {
        console.error(err);
        
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal Server Error");
        }
    }
}

router.get('/getBestRatedTitles/:genre/:n', getBestRatedTitlesEndpoint);

module.exports = router;
