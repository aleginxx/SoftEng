const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function mostRecentFilmQuery(principalName) {
    let query = `
        SELECT
            n.primary_name AS principalName,
            tb.Primary_title AS title,
            tb.Start_year AS startYear
        FROM
            softeng.Principals p
        JOIN
            softeng.Name n ON p.n_const_principals = n.n_const
        JOIN
            softeng.Title_Basics tb ON p.t_const_principals = tb.T_const
        WHERE
            n.primary_name = '${principalName}' 
        ORDER BY
            tb.Start_year DESC
        LIMIT 1;
    `;

    return query;
}

function mostRecentFilmEndpoint(req, res) {
    let principalName = req.params.principalName;
    let query = mostRecentFilmQuery(principalName);

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
            // No data found for the given principalName
            return res.status(204).send("No Data");
        }
        
        let resultJson = {
            "principalName": resultList[0].principalName,
            "title": resultList[0].title,
            "startYear": resultList[0].startYear
        }

        sendFinalResult(req, res, resultJson);
    });
}

router.get('/getMostRecentFilm/:principalName', (req, res) => {
    mostRecentFilmEndpoint(req, res);
});

module.exports = router;
