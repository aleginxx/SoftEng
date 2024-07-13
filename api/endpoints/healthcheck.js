const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const host_name = 'localhost';
const { sendFinalResult } = require('../helpers/format');

function healthcheck(req, res) {
    const sqlConfig = {
        host: host_name,
        user: "root",
        password: "",
        database: "softeng"
    };

    const connection = mysql.createConnection(sqlConfig);

    let resultJson = {
        status: "failed",
        dataconnection: sqlConfig
    };

    connection.on('error', (err) => {
        console.error('Database connection error:', err.message);

        resultJson.error = err.message;

        connection.end();

        res.status(500).json(resultJson);
    });

    connection.connect((err) => {
        if (err) {
            console.error(err);

            if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
                return res.status(401).send("Not Authorized");
            } else {
                connection.end();
                return res.status(500).json(resultJson);
            }
        } else {
            connection.query('SELECT 1', (queryErr, results) => {
                if (queryErr) {
                    console.error('Database query error:', queryErr.message);
                    resultJson.error = queryErr.message;
                    res.send(resultJson);
                } else {
                    resultJson = {
                        status: "OK",
                        dataconnection: sqlConfig
                    };
                    res.send(resultJson);
                }

                connection.end();
            });
        }
    });
}

router.get('/admin/healthcheck', healthcheck);
module.exports = router;
