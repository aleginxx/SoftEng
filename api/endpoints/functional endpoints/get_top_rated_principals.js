const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function topRatedPrincipalsQuery(limit) {
    let query = `
        SELECT
            n.primary_name AS principal_name,
            MAX(r.average_rating) AS highest_rating
        FROM
            softeng.Principals p
        JOIN
            softeng.Name n ON p.n_const_principals = n.n_const
        JOIN
            softeng.Ratings r ON p.t_const_principals = r.t_const_ratings
        GROUP BY
            n.primary_name
        ORDER BY
            highest_rating DESC
        LIMIT
            ${limit};  // Be cautious with direct interpolation due to SQL injection risk
    `;

    return query;
}

function getTopRatedPrincipalsEndpoint(req, res) {
    let limit = parseInt(req.params.limit);
    let query = topRatedPrincipalsQuery(limit);

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
            return res.status(204).send("No Data"); 
        }
        
        sendFinalResult(req, res, resultList);
    });
}

router.get('/getTopRatedPrincipals/:limit', (req, res) => {
    getTopRatedPrincipalsEndpoint(req, res);
});

module.exports = router;
