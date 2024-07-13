const DB = require('../database').connection;
const express = require('express');
const router = express.Router();

function deleteSeenTitleQuery(userId, tConst) {
    let deleteQuery = `
        DELETE FROM user_has_seen_title
        WHERE user_user_id = ? AND Title_Basics_T_const = ?;
    `;

    return new Promise((resolve, reject) => {
        DB.query(deleteQuery, [userId, tConst], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function deleteSeenTitleEndpoint(req, res) {
    let userId = req.body.userId;
    let tConst = req.body.tConst;
    try {
        if (!userId || !tConst) {
            return res.status(400).send("Bad request");
        }

        const result = await deleteSeenTitleQuery(userId, tConst);
        if (result && result.affectedRows > 0) {
            res.status(200).send("Title successfully removed from seen titles.");
        } else {
            res.status(204).send("No data");
        }
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

router.post('/deleteSeenTitle', deleteSeenTitleEndpoint);

module.exports = router;
