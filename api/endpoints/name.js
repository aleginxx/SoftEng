const DB = require('./database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../helpers/format');

// DB.config.user = 'incorrect_user';
// DB.config.password = 'incorrect_password';

function nameQuery(nameID) {
    let query = `
    SELECT
    N.n_const AS nameID,
    N.primary_name AS name,
    N.img_url_asset_name AS namePoster,
    N.birth_year AS birthYr,
    N.death_year AS deathYr,
    N.primary_prof AS profession,
    P.t_const_principals AS titleID,
    P.category AS category
    FROM
        Name N
    LEFT JOIN
        Principals P ON N.n_const = P.n_const_principals
    WHERE
        N.n_const = '${nameID}'; 
    `;
    return query;
}

function name_endpoint(req, res) {
    let nameID = req.params.nameID;
    let query = nameQuery(nameID);
    
    DB.query(query, (err, resultList) => {
        if (err) {
            console.error(err);

            if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "root" || DB.config.password != "") {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).send("Internal error");
            }
        }

        if (resultList.length === 0) {
            return res.status(204).send("Not available");
        }
        
        let resultJson = {
            "nameID": resultList[0].nameID,
            "name": resultList[0].name,
            "namePoster": resultList[0].namePoster,
            "birthYr": resultList[0].birthYr,
            "deathYr": resultList[0].deathYr,
            "profession": resultList[0].profession,
            "nameTitles": []
        }

        resultList.forEach(result => {
            resultJson.nameTitles.push({
                "titleID": result.titleID,
                "category": result.category
            });
        });

        sendFinalResult(req, res, resultJson);
    });
}

router.get('/name/', (req, res) => {
    return res.status(400).send("Bad Request");
});

router.get('/name/:nameID', (req, res) => {
    name_endpoint(req,res);
})
module.exports = router;