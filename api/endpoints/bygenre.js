const DB = require('./database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../helpers/format');

// DB.config.user = 'incorrect_user';
// DB.config.password = 'incorrect_password';

function byGenreQuery(qgenre, minrating, yrFrom, yrTo) {
    let query = `
        SELECT
            TB.T_const AS titleID,
            TB.Title_type AS type,
            TB.Original_title AS originalTitle,
            TB.img_url_asset_basics AS titlePoster,
            TB.Start_year AS startYear,
            TB.End_year AS endYear,
            JSON_ARRAY(JSON_OBJECT('genreTitle', GROUP_CONCAT(DISTINCT G.GenreName))) AS genreTitle,
            JSON_ARRAY(JSON_OBJECT('akaTitle', GROUP_CONCAT(DISTINCT TA.title), 'regionAbbrev', GROUP_CONCAT(DISTINCT TA.Region))) AS akaTitle,
            JSON_ARRAY(JSON_OBJECT('nameID', GROUP_CONCAT(DISTINCT N.n_const), 'name', GROUP_CONCAT(N.primary_name), 'category', GROUP_CONCAT(DISTINCT P.job))) AS principals,
            JSON_OBJECT('avRating', R.average_rating, 'nVotes', R.num_votes) AS rating
        FROM
            Title_Basics TB
        JOIN
            Title_Basics_Has_Genres BG ON TB.T_const = BG.Title_Basics_T_const
        JOIN
            Genres G ON BG.Genres_GenreID = G.GenreID
        LEFT JOIN
            Title_akas TA ON TB.T_const = TA.Title_Id
        LEFT JOIN
            Principals P ON TB.T_const = P.t_const_principals
        LEFT JOIN
            Name N ON P.n_const_principals = N.n_const
        LEFT JOIN
            Ratings R ON TB.T_const = R.t_const_ratings
        WHERE
            G.GenreName = ? 
            AND R.average_rating >= ?
            AND (
                (TB.Start_year >= ? AND TB.Start_year <= ?)
                OR
                (TB.End_year IS NOT NULL AND TB.End_year >= ? AND TB.End_year <= ?)
            )
        GROUP BY
            TB.T_const;
    `;

    return query;
}

function formatTitleAkas(titleAkasString) {
    let titleAkasArray = JSON.parse(titleAkasString || '[]');

    let formattedTitleAkas = titleAkasArray.map(entry => ({
        "akaTitle": entry.akaTitle,
        "regionAbbrev": entry.regionAbbrev
    }));

    return formattedTitleAkas;
}

function formatPrincipals(principalsString) {
    let principalsArray = JSON.parse(principalsString || '[]');

    let formattedPrincipals = principalsArray.map(entry => ({
        "nameID": entry.nameID,
        "name": entry.name,
        "category": entry.category
    }));

    return formattedPrincipals;
}

function byGenreEndpoint(req, res) {
    let qgenre = req.body.qgenre || req.params.qgenre;
    let minrating = req.body.minrating || req.params.minrating;
    let yrFrom = req.body.yrFrom || req.params.yrFrom || 0;
    let yrTo = req.body.yrTo || req.params.yrTo || 9999;

    if (minrating < 0 || minrating > 10) {
        return res.status(400).send("Bad Request: 'minrating' must be between 0 and 10");
    }

    if (yrFrom < 0 || yrTo < 0 || yrFrom > yrTo) {
        return res.status(400).send("Bad Request: Invalid year range");
    }

    // Check if the genre exists
    DB.query("SELECT * FROM Genres WHERE GenreName = ?", [qgenre], (err, genreResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal error");
        }

        if (genreResult.length === 0) {
            return res.status(400).send(`Bad Request: There is no genre '${qgenre}'`);
        }

        // Genre exists, proceed with the main query
        let query = byGenreQuery(qgenre, minrating, yrFrom, yrTo);

        DB.query(query, [qgenre, minrating, yrFrom, yrTo, yrFrom, yrTo], (err, resultList) => {
            if (DB.config.host != "localhost") {
                return res.status(500).send("Internal Service Error");
            }

            if (err) {
                console.error(err);

                if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "root" || DB.config.password != "") {
                    return res.status(401).send("Not Authorized");
                } else {
                    return res.status(500).send("Internal error");
                }
            }

            if (resultList.length === 0) {
                return res.status(204).send("No data");
            } else {
                let resultsArray = resultList.map(result => ({
                    "titleID": result.titleID,
                    "type": result.type,
                    "originalTitle": result.originalTitle,
                    "titlePoster": result.titlePoster,
                    "startYear": result.startYear,
                    "endYear": result.endYear,
                    "genres": formatGenres(result.genreTitle),
                    "titleAkas": formatTitleAkas(result.akaTitle),
                    "principals": formatPrincipals(result.principals),
                    "rating": JSON.parse(result.rating || '{}')
                }));

                sendFinalResult(req, res, resultsArray);
            }
        });
    });
}

function formatGenres(genreTitleString) {
    let genreTitleArray = JSON.parse(genreTitleString || '[]');

    let formattedGenres = genreTitleArray.map(entry => ({
        "genreTitle": entry.genreTitle
    }));

    return formattedGenres;
}

router.get('/bygenre', (req, res) => {
    const { qgenre, minrating, yrFrom, yrTo } = req.query;

    if ((!qgenre && !req.body.qgenre) || (!minrating && !req.body.minrating)) {
        return res.status(400).send("Bad Request: 'qgenre' and 'minrating' are required in the URL or JSON body");
    }

    byGenreEndpoint(req, res);
});

router.get('/bygenre/:qgenre/:minrating/:yrFrom?/:yrTo?', (req, res) => {
    const { qgenre, minrating, yrFrom, yrTo } = req.params;

    const yrFromValue = typeof yrFrom !== 'undefined' ? yrFrom : 0;
    const yrToValue = typeof yrTo !== 'undefined' ? yrTo : 9999;

    byGenreEndpoint(req, res, qgenre, minrating, yrFromValue, yrToValue);
});

module.exports = router;