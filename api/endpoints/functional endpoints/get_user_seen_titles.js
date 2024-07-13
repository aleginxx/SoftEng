const DB = require('../database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../../helpers/format');

function userSeenTitlesQuery(userId) {
    let query = `
        SELECT
            t.Primary_title
        FROM
            softeng.user_has_seen_title ust
        JOIN
            softeng.Title_Basics t ON ust.Title_Basics_T_const = t.T_const
        WHERE
            ust.user_user_id = '${userId}';
    `;

    return query;
}

function getUserSeenTitlesEndpoint(req, res) {
    let userId = req.params.userId;
    let query = userSeenTitlesQuery(userId);

    DB.query(query, (err, titlesList) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).send("Internal error");
            }
        }

        if (titlesList.length === 0) {
            return res.status(204).send("No Data"); 
        }
        
        sendFinalResult(req, res, titlesList);
    });
}

router.get('/getUserSeenTitles/:userId', (req, res) => {
    getUserSeenTitlesEndpoint(req, res);
});

module.exports = router;
