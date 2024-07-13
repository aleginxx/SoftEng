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

router.post('/admin/upload/titlebasics', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Bad Request' });
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
        const tempFilePath = path.join(uploadDir, 'temp_title_basics.tsv');
        fs.writeFileSync(tempFilePath, 'img_url_asset_basics\t' + fileContent, 'utf8');

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
            CREATE TEMPORARY TABLE IF NOT EXISTS temp_title_basics (
                T_const VARCHAR(45) NOT NULL,
                Title_type VARCHAR(45) NOT NULL,
                Primary_title MEDIUMTEXT NOT NULL,
                Original_title MEDIUMTEXT NOT NULL,
                Is_adult BINARY(1) NOT NULL,
                Start_year INT NOT NULL,
                End_year INT NULL,
                Runtime INT NULL,
                Genres VARCHAR(45) NULL,
                img_url_asset_basics LONGTEXT NULL,
                PRIMARY KEY (T_const),
                UNIQUE INDEX T_const_UNIQUE (T_const ASC)
            );
        `;

        // Execute the create temporary table query
        await connection.query(createTempTableQuery);

        // Import data into temporary table temp_title_basics from the temporary file
        const importTempTitleBasicsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}' 
            INTO TABLE temp_title_basics 
            FIELDS TERMINATED BY '\t' 
            LINES TERMINATED BY '\n' 
            IGNORE 1 LINES 
            (T_const, Title_type, Primary_title, Original_title, Is_adult, Start_year, End_year, Runtime, genres, img_url_asset_basics) ;
        `;

        // Execute the import data query
        await connection.query(importTempTitleBasicsQuery);

        // Import data into table Title_Basics from the temporary file with IGNORE
        const importTitleBasicsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}' 
            INTO TABLE Title_Basics 
            FIELDS TERMINATED BY '\t' 
            LINES TERMINATED BY '\n' 
            IGNORE 1 LINES 
            (T_const, Title_type, Primary_title, Original_title, Is_adult, Start_year, End_year, Runtime, @genres, @img_url_asset_basics) 
            SET img_url_asset_basics = @img_url_asset_basics;
        `;

        // Import data into table Genres
        const importGenresQuery = `
            INSERT IGNORE INTO Genres (GenreName)
            SELECT DISTINCT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(temp_title_basics.Genres, ',', n.digit + 1), ',', -1)) AS GenreName
            FROM temp_title_basics
            JOIN (SELECT 0 AS digit UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) n
            ON LENGTH(temp_title_basics.Genres) - LENGTH(REPLACE(temp_title_basics.Genres, ',', '')) >= n.digit
            WHERE temp_title_basics.Genres IS NOT NULL AND TRIM(temp_title_basics.Genres) <> '';
        `;

        // Import data into table Title_Basics_Has_Genres with IGNORE
        const importTitleGenresQuery = `
            INSERT IGNORE INTO Title_Basics_Has_Genres (Title_Basics_T_const, Genres_GenreID) 
            SELECT DISTINCT ttb.T_const, g.GenreID 
            FROM temp_title_basics ttb 
            JOIN Genres g ON FIND_IN_SET(g.GenreName, ttb.Genres) > 0;
        `;

        try {
            // Import data into table Title_Basics
            await connection.query(importTitleBasicsQuery);

            // Import data into table Genres
            await connection.query(importGenresQuery);

            // Import data into table Title_Basics_Has_Genres
            await connection.query(importTitleGenresQuery);

            // Respond with success message if everything is successful
            res.status(200).json({ message: 'File uploaded successfully' });
        } catch (error) {
            // Log duplicate entry error without terminating the connection
            if (error.code === 'ER_DUP_ENTRY') {
                console.error('Duplicate entry error:', error.message);
                // Respond with a 400 status and the duplicate entry error message
                res.status(400).json({ error: 'Duplicate entry', message: error.message });
            } else if (error.code === 'ER_DATA_TOO_LONG' || error.code === 'ER_TRUNCATED_WRONG_VALUE') {
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

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);
    } catch (error) {
        // Log other errors (e.g., file read/write errors)
        console.error('Error:', error.message);
        if (error.code === 'ER_DBACCESS_DENIED_ERROR' || DB.config.user != "user" || DB.config.password != "") {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).json({ error: 'Internal error', message: error.message });
        }
    }
});

router.get('/admin/upload/titlebasics', (req, res) => {
    // Render the HTML page with the specific message
    const htmlContent = '<html><body><p>Please upload a file through Postman.</p></body></html>';
    res.send(htmlContent);
});

module.exports = router;
