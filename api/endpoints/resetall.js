const DB = require('./database').connection;
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// DB.config.user = 'incorrect_user';
// DB.config.password = 'incorrect_password';
// DB.config.host = 'non-localhost';

router.post('/admin/resetall', async (req, res) => {
    let connection;
    let resultJson;

    try {
        connection = await mysql.createConnection({
            host: 'localhost', 
            user: 'root',
            password: '',
            database: 'softeng'
        });

        // console.log("DB host:", DB.config.host);
        // console.log("Connection host:", connection.config.host);

        if (DB.config.host != connection.config.host) {
            resultJson = {
                status: "failed",
                reason: "<ER_DBACCESS_DENIED_ERROR DUE TO WRONG HOST>"
            };
            return res.status(500).json(resultJson);
        } else if (DB.config.password != connection.config.password) {
            resultJson = {
                status: "failed",
                reason: "<ER_DBACCESS_DENIED_ERROR DUE TO WRONG PASSWORD>"
            };
            return res.status(401).json(resultJson);
        } else if (DB.config.user != connection.config.user) {
            resultJson = {
                status: "failed",
                reason: "<ER_DBACCESS_DENIED_ERROR DUE TO WRONG USERNAME>"
            };
            return res.status(401).json(resultJson);
        }

        const tables = [
            'Title_akas',
            'Title_Basics_Has_Genres',
            'Genres',
            'Crew',
            'Episode',
            'Title_Basics_has_Principals',
            'Principals',
            'user_has_seen_title',
            'user',
            'Name',
            'Ratings',
            'Title_Basics'
        ];

        for (const table of tables) {
            const deleteQuery = `DELETE FROM ${table};`;
            await connection.query(deleteQuery);
        }

        await connection.end();

        const uploadsFolderPath = path.join(__dirname, '..', 'uploads');
        const files = await fs.readdir(uploadsFolderPath);

        for (const file of files) {
            const filePath = path.join(uploadsFolderPath, file);
            await fs.unlink(filePath);
        }

        resultJson = {
            status: "OK"
        };
        res.json(resultJson);
    } catch (err) {
        console.error(err);

        resultJson = {
            status: "failed",
            reason: err.code
        };

        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            res.status(401).json(resultJson);
        } else {
            res.status(500).json(resultJson);
        }
    }
});

router.get('/admin/resetall', (req, res) => {
    const htmlContent = '<html><body><p>Please clear the DB through Postman.</p></body></html>';
    res.send(htmlContent);
});

module.exports = router;
