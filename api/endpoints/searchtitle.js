const DB = require('./database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../helpers/format');

// DB.config.user = 'incorrect_user';
// DB.config.password = 'incorrect_password';

function searchTitleQuery(titlePart) {
    let query = `
        SELECT
            TB.T_const AS titleID,
            TB.Title_type AS type,
            TB.Original_title AS originalTitle,
            TB.img_url_asset_basics AS titlePoster,
            TB.Start_year AS startYear,
            TB.End_year AS endYear,
            CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"genreTitle":"', G.GenreName, '"}')), ']') AS genreTitle,
            CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"akaTitle":"', TA.title, '","regionAbbrev":"', TA.Region, '"}')), ']') AS akaTitle,
            CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"nameID":"', N.n_const, '","name":"', N.primary_name, '","category":"', P.job, '"}')), ']') AS principals,
            JSON_OBJECT('avRating', COALESCE(R.average_rating, 0), 'nVotes', COALESCE(R.num_votes, 0)) AS rating
        FROM
            Title_Basics TB
        LEFT JOIN
            Title_Basics_Has_Genres BG ON TB.T_const = BG.Title_Basics_T_const
        LEFT JOIN
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
            TB.Original_title LIKE ?
        GROUP BY
            TB.T_const;
    `;

    return query;
}

function searchTitleEndpoint(req, res) {
    let titlePart = '%' + req.body.titlePart + '%';
    let query = searchTitleQuery(titlePart);

    DB.query(query, [titlePart], (err, resultList) => {

        if (DB.config.host != "localhost") {
            return res.status(500).send("Internal Service Error")
        } 

        if (err) {
            console.error(err);

            if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "root" || DB.config.password != "") {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).send("Internal Service Error");
            }
        }

        if (!resultList || resultList.length === 0) {
            return res.status(204).send("No data");
        } else if (resultList.length > 0) {
            try {
                let resultsArray = resultList.map(result => ({
                    "titleID": resultList[0].titleID,
                    "type": resultList[0].type,
                    "originalTitle": resultList[0].originalTitle,
                    "titlePoster": resultList[0].titlePoster,
                    "startYear": resultList[0].startYear,
                    "endYear": resultList[0].endYear,
                    "genres": JSON.parse(resultList[0].genreTitle || '[]'),
                    "titleAkas": JSON.parse(resultList[0].akaTitle || '[]'),
                    "principals": JSON.parse(resultList[0].principals || '[]'),
                    "rating": JSON.parse(resultList[0].rating || '{}')
                }));
                sendFinalResult(req, res, resultsArray);
            } catch (parseError) {
                console.error('Error during JSON parsing:', parseError);
                console.log('Raw resultList:', resultList); // Log the resultList for debugging
                res.status(500).send('Internal Service Error');
            }
        }
    });
}

router.get('/searchtitle', (req, res) => {
    const titlePart = req.query.titlePart;
    
    if (!req.body.titlePart) {
        return res.status(400).send("Bad Request: 'titlePart' is required in the request body");
    }

    searchTitleEndpoint(req, res);
});

function searchTitleEndpointParams(req, res) {
    let titlePart = '%' + req.params.titlePart + '%';
    let query = searchTitleQuery(titlePart);

    DB.query(query, [titlePart], (err, resultList) => {

        if (DB.config.host != "localhost") {
            return res.status(500).send("Internal Service Error")
        } 

        if (err) {
            console.error(err);

            if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "root" || DB.config.password != "") {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).send("Internal Service Error");
            }
        }

        if (!resultList || resultList.length === 0) {
            return res.status(204).send("No data");
        } else if (resultList.length > 0) {
            try {
                let resultsArray = resultList.map(result => ({
                    "titleID": resultList[0].titleID,
                    "type": resultList[0].type,
                    "originalTitle": resultList[0].originalTitle,
                    "titlePoster": resultList[0].titlePoster,
                    "startYear": resultList[0].startYear,
                    "endYear": resultList[0].endYear,
                    "genres": JSON.parse(resultList[0].genreTitle || '[]'),
                    "titleAkas": JSON.parse(resultList[0].akaTitle || '[]'),
                    "principals": JSON.parse(resultList[0].principals || '[]'),
                    "rating": JSON.parse(resultList[0].rating || '{}')
                }));
                sendFinalResult(req, res, resultsArray);
            } catch (parseError) {
                console.error('Error during JSON parsing:', parseError);
                console.log('Raw resultList:', resultList); 
                res.status(500).send('Internal Service Error');
            }
        }
    });
}

router.get('/searchtitle/:titlePart', (req, res) => {
    const titlePart = req.query.titlePart;
    searchTitleEndpointParams(req, res);
})

module.exports = router;