const DB = require('../database').connection;
const express = require('express');
const router = express.Router();

async function addSeenTitleQuery(userId, titleTconst) {
    let insertQuery = `
        INSERT INTO softeng.user_has_seen_title (user_user_id, Title_Basics_T_const, favourite)
        VALUES (?, ?, 0);
    `;

    let selectQuery = `
        SELECT
            t.Primary_title,
            us.username
        FROM
            softeng.user_has_seen_title ust
        JOIN
            softeng.Title_Basics t ON ust.Title_Basics_T_const = t.T_const
        JOIN
            softeng.user us ON ust.user_user_id = us.user_id
        WHERE
            ust.user_user_id = ?;
    `;

    return new Promise((resolve, reject) => {
        DB.query(insertQuery, [userId, titleTconst], (err, insertResults) => {
            if (err) {
                reject(err);
            } else {
                DB.query(selectQuery, [userId], (err, selectResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(selectResults);
                    }
                });
            }
        });
    });
}

async function addSeenTitleEndpoint(req, res) {
    let userId = req.body.userId;
    let titleTconst = req.body.titleTconst;
    if (!userId || !titleTconst) {
        return res.status(400).send("Bad request");
    }
    try {
        const seenTitles = await addSeenTitleQuery(userId, titleTconst);
        if (seenTitles.length > 0) {
            return res.status(200).json(seenTitles);
        } else {
            return res.status(204).send("No data");
        }
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not authorized");
        } else {
            return res.status(500).send("Internal server error");
        }
    }
}

router.post('/addSeenTitle', addSeenTitleEndpoint);

module.exports = router;
