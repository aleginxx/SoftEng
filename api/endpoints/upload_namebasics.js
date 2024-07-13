const DB = require('./database').connection;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { sendFinalResult } = require('../helpers/format');

const upload = multer({ dest: 'uploads/' });

// DB.config.user = 'incorrect_user';
// DB.config.password = 'incorrect_password';

router.post('/admin/upload/namebasics', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;

        // Check if the uploaded file has a .tsv extension
        const ext = path.extname(req.file.originalname);
        if (ext.toLowerCase() !== '.tsv') {
            // Send a response with the message for incorrect file type
            return res.status(400).json({ message: 'Only TSV files are allowed' });
        }

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(__dirname, '../uploads', 'temp_name_basics.tsv');
        fs.writeFileSync(tempFilePath, 'img_url_asset_name\t' + fileContent, 'utf8');

        // Connect to MySQL using the mysql2 package
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'softeng'
        });

        if (DB.config.host != 'localhost') {
            return res.status(500).send("Internal service error");
        }

        // Create the temporary table
        const createTempTableQuery = `
            CREATE TEMPORARY TABLE IF NOT EXISTS temp_name_basics (
                n_const VARCHAR(45) NOT NULL,
                primary_name MEDIUMTEXT NOT NULL,
                birth_year INT NULL,
                death_year INT NULL,
                primary_prof MEDIUMTEXT NULL,
                known_for_titles MEDIUMTEXT NULL,
                img_url_asset_name LONGTEXT NULL,
                PRIMARY KEY (n_const),
                UNIQUE INDEX n_const_UNIQUE (n_const ASC)
            );
        `;

        // Execute the create temporary table query
        await connection.query(createTempTableQuery);

        // Import data into table Name from the temporary file
        const importNameBasicsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}'
            INTO TABLE Name
            FIELDS TERMINATED BY '\t'
            LINES TERMINATED BY '\n'
            IGNORE 1 LINES
            (n_const, primary_name, birth_year, death_year, primary_prof, known_for_titles, img_url_asset_name);
        `;

        try {
            await connection.query(importNameBasicsQuery);

            // Respond with success message if everything is successful
            res.status(200).json({ message: 'File uploaded successfully' });
        } catch (error) {
            // Log duplicate entry error without terminating the connection
            if (err.code === 'ER_DUP_ENTRY') {
                console.error('Duplicate entry error:', err.message);
                // Respond with a 400 status and the duplicate entry error message
                res.status(400).json({ err: 'Duplicate entry', message: err.message });
            } else if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_TRUNCATED_WRONG_VALUE') {
                // Log constraint violation error and respond with a 400 status and the error message
                console.error('Constraint violation error:', err.message);
                res.status(400).json({ err: 'Constraint violation', message: err.message });
            } else {
                // Log other errors
                console.error('Error:', err.message);

                // Respond with an appropriate error status
                if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "user" || DB.config.password != "") {
                    return res.status(401).send("Not Authorized");
                } else {
                    return res.status(500).json({ err: 'Internal error', message: err.message });
                }
            }
        } finally {
            // Close the connection in the finally block to ensure it always gets closed
            await connection.end();
        }
    } catch (err) {
        console.error(err);
        //console.error('Err Code:', err.code);
        if (err.code === 'ER_DUP_ENTRY') {
            console.err('Duplicate entry error:', err.message);
            // Respond with a 400 status and the duplicate entry error message
            res.status(400).json({ err: 'Duplicate entry', message: err.message });
        } else if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_TRUNCATED_WRONG_VALUE') {
            // Log constraint violation error and respond with a 400 status and the error message
            console.error('Constraint violation error:', err.message);
            res.status(400).json({ err: 'Constraint violation', message: err.message });
        } else {
            // Log other errors
            console.error('Error:', err.message);

            // Respond with an appropriate error status
            if (err.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "user" || DB.config.password != "") {
                return res.status(401).send("Not Authorized");
            } else {
                return res.status(500).json({ err: 'Internal error', message: err.message });
            }
        }
    }
});

router.get('/admin/upload/namebasics', (req, res) => {
    // Render the HTML page with the specific message
    const htmlContent = '<html><body><p>Please upload a file through Postman.</p></body></html>';
    res.send(htmlContent);
});

module.exports = router;