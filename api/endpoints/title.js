const DB = require('./database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../helpers/format');


// DB.config.user = 'incorrect_user';
// DB.config.password = 'incorrect_password';

function titleQuery(titleID) {
    let query = `
        SELECT
        TB.T_const AS titleID,
        TB.Title_type AS type,
        TB.Original_title AS originalTitle,
        TB.img_url_asset_basics AS titlePoster,
        TB.Start_year AS startYear,
        TB.End_year AS endYear,
        JSON_ARRAY(JSON_OBJECT('genreTitle', GROUP_CONCAT(DISTINCT G.GenreName))) AS genres,
        JSON_ARRAY(JSON_OBJECT('akaTitle', GROUP_CONCAT(DISTINCT TA.title), 'regionAbbrev', GROUP_CONCAT(DISTINCT TA.Region))) AS titleAkas,
        JSON_ARRAY(JSON_OBJECT('nameID', GROUP_CONCAT(DISTINCT N.n_const), 'name', GROUP_CONCAT(DISTINCT N.primary_name), 'category', GROUP_CONCAT(DISTINCT P.job))) AS principals,
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
            TB.T_const = '${titleID}';
    `;
    return query;
}

function title_endpoint(req, res) {
    let titleID = req.params.titleID;
    let query = titleQuery(titleID);

    DB.query(query, (err, resultList) => {
        if (err) {
            console.error(err);

            if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "root" || DB.config.password != "") {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).send("Internal error");
            }
        }

        if (!resultList || resultList.length === 0 ) {
            return res.status(204).send("No data");
        } else if (resultList[0].titleID == null) {
            return res.status(404).send("Not available");
        } else {
            let resultJson = {
                "titleID": resultList[0].titleID,
                "type": resultList[0].type,
                "originalTitle": resultList[0].originalTitle,
                "titlePoster": resultList[0].titlePoster,
                "startYear": resultList[0].startYear,
                "endYear": resultList[0].endYear,
                "genres": JSON.parse(resultList[0].genres || '[]'),
                "titleAkas": formatTitleAkas(resultList[0].titleAkas),
                "principals": formatPrincipals(resultList[0].principals),
                "rating": JSON.parse(resultList[0].rating || '{}')
            };

        
            sendFinalResult(req, res, resultJson);
        }
    });
}

function formatTitleAkas(titleAkasString) {
    let titleAkasArray = JSON.parse(titleAkasString || '[]');

    let formattedTitleAkas = titleAkasArray.map(entry => ({
        akaTitle: entry.akaTitle,
        regionAbbrev: entry.regionAbbrev
    }));

    return formattedTitleAkas;
}

function formatPrincipals(principalsString) {
    let principalsArray = JSON.parse(principalsString || '[]');

    let formattedPrincipals = principalsArray.map(entry => ({
        nameID: entry.nameID,
        name: entry.name,
        category: entry.category
    }));

    return formattedPrincipals;
}

router.get('/title/', (req, res) => {
    return res.status(400).send("Bad Request");
});

router.get('/title/:titleID/', (req, res) => {
    title_endpoint(req,res);
})
module.exports = router;