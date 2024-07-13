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

router.post('/admin/upload/titleratings', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const uploadDir = path.join(__dirname, '../uploads');

        // Check if the uploaded file has a .tsv extension
        const ext = path.extname(req.file.originalname);
        if (ext.toLowerCase() !== '.tsv') {
            // Respond with an error message
            return res.status(400).json({ error: 'Only TSV files are allowed' });
        }

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(__dirname, '../uploads', 'temp_title_ratings.tsv');
        fs.writeFileSync(tempFilePath, fileContent, 'utf8');

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

        // Import data into the 'ratings' table from the temporary file
        const importRatingsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}'
            INTO TABLE ratings
            FIELDS TERMINATED BY '\t'
            LINES TERMINATED BY '\n'
            IGNORE 1 LINES;
        `;

        try {
            // Import data into table Title_Basics
            await connection.query(importRatingsQuery);

            // Respond with success message if everything is successful
            res.status(200).json({ message: 'File uploaded successfully' });
        } catch (error) {
            //console.error('Error Code:', error.code);
            // Log duplicate entry error without terminating the connection
            if (error.code === 'ER_DUP_ENTRY') {
                console.error('Duplicate entry error:', error.message);
                // Respond with a 400 status and the duplicate entry error message
                res.status(400).json({ error: 'Duplicate entry', message: error.message });
            } else if (error.code === 'ER_DATA_TOO_LONG' || error.code === 'ER_TRUNCATED_WRONG_VALUE' || error.code === 'ER_NO_REFERENCED_ROW_2') {
                // Log constraint violation error and respond with a 400 status and the error message
                console.error('Constraint violation error:', error.message);
                res.status(400).json({ error: 'Constraint violation', message: error.message });
            } else {
                // Log other errors
                console.error('Error:', error.message);

                // Respond with an appropriate error status
                if (error.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "user" || DB.config.password != "") {
                    return res.status(401).send("Not Authorized");
                } else {
                    return res.status(500).json({ error: 'Internal error', message: error.message });
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
        } else if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_TRUNCATED_WRONG_VALUE' || err.code === 'ER_NO_REFERENCED_ROW_2') {
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

router.get('/admin/upload/titleratings', (req, res) => {
    // Render the HTML page with the specific message
    const htmlContent = '<html><body><p>Please upload a file through Postman.</p></body></html>';
    res.send(htmlContent);
});

module.exports = router;