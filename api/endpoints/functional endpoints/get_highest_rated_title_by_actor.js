const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function highestRatedByActorQuery(actorName) {
    let query = `
        SELECT
            tb.T_const AS titleID,
            tb.Primary_title AS primaryTitle,
            r.average_rating AS averageRating
        FROM
            softeng.Title_Basics tb
        JOIN
            softeng.Ratings r ON tb.T_const = r.t_const_ratings
        JOIN
            softeng.principals p ON tb.T_const = p.t_const_principals
        JOIN
            softeng.Name n ON p.n_const_principals = n.n_const
        WHERE
            n.primary_name = '${actorName}' 
        ORDER BY
            r.average_rating DESC
        LIMIT
        1;
    `;

    return query;
}

function highestRatedByActorEndpoint(req, res) {
    let actorName = req.params.actorName;
    let query = highestRatedByActorQuery(actorName);

    DB.query(query, (err, resultList) => {
        if (err) {
            console.error(err);

            if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).send("Internal error");
            }
        }
        
        if (resultList.length === 0) {
            // No data found for the given nameID
            return res.status(204).send("No Data");
        }
        
        let resultJson = {
            "titleID": resultList[0].titleID,
            "primaryTitle": resultList[0].primaryTitle,
            "averageRating": resultList[0].averageRating
        }

        sendFinalResult(req, res, resultJson);
    });
}

router.get('/highestRatedByActor/:actorName', (req, res) => {
    highestRatedByActorEndpoint(req, res);
});

module.exports = router;
