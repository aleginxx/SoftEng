const DB = require('./database').connection;
const express = require('express');
const router = express.Router();
const { sendFinalResult } = require('../helpers/format');
const app = express();

app.use(express.json());

// DB.config.user = 'incorrect_user';
// DB.config.password = 'incorrect_password';

function searchNameQuery(namePart) {
    let query = `
        SELECT
            N.n_const AS nameID,
            N.primary_name AS name,
            N.img_url_asset_name AS img_url_asset_name,
            N.birth_year AS birthYr,
            N.death_year AS deathYr,
            P.job AS profession,
            P.t_const_principals AS titleID,
            P.category AS category
        FROM
            Principals P
        JOIN
            Name N ON P.n_const_principals = N.n_const
        WHERE
            N.primary_name LIKE CONCAT('%', ?, '%');
    `;
    return query;
}

function searchNameEndpoint(req, res) {
    let namePart = encodeURIComponent(req.body.namePart);
    let query = searchNameQuery(namePart);

    DB.query(query, [namePart], (err, resultList) => {
        if (DB.config.host !== 'localhost') {
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
            return res.status(204).send("Not available");
        }

        if (resultList.length > 0) {
            let resultsArray = resultList.map(result => {
                let resultJson = {
                    "nameID": result.nameID,
                    "name": result.name,
                    "img_url_asset_name": result.img_url_asset_name || null,
                    "birthYr": result.birthYr || null,
                    "deathYr": result.deathYr || null,
                    "profession": result.profession || null,
                    "nameTitles": []
                };

                resultJson.nameTitles.push({
                    "titleID": result.titleID || null,
                    "category": result.category || null
                });

                return resultJson;
            });

            sendFinalResult(req, res, resultsArray);
        } else {
            sendFinalResult(req, res, []);
        }
    });
}

router.get('/searchname', (req, res) => {
    if (!req.body.namePart) {
        return res.status(400).send("Bad Request: 'namePart' is required in the request body");
    }
    searchNameEndpoint(req, res);
});

function searchNameEndpointParams(req, res) {
    let namePart = encodeURIComponent(req.params.namePart); 
    let query = searchNameQuery(namePart);

    DB.query(query, [namePart], (err, resultList) => {
        if (DB.config.host !== 'localhost') {
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
            return res.status(204).send("Not available");
        }

        if (resultList.length > 0) {
            let resultsArray = resultList.map(result => {
                let resultJson = {
                    "nameID": result.nameID,
                    "name": result.name,
                    "img_url_asset_name": result.img_url_asset_name || null,
                    "birthYr": result.birthYr || null,
                    "deathYr": result.deathYr || null,
                    "profession": result.profession || null,
                    "nameTitles": []
                };

                resultJson.nameTitles.push({
                    "titleID": result.titleID || null,
                    "category": result.category || null
                });

                return resultJson;
            });

            sendFinalResult(req, res, resultsArray);
        } else {
            sendFinalResult(req, res, []);
        }
    });
}

router.get('/searchname/:namePart', (req, res) => {
    searchNameEndpointParams(req, res);
});

module.exports = router;
