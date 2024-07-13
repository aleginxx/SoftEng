const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { sendFinalResult } = require('../helpers/format');

const upload = multer({ dest: 'uploads/' });

// Function to upload data to Title_Basics table
async function uploadTitleBasics(filePath) {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

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

        // Import data into table Title_Basics from the temporary file
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

        // Import data into table Title_Basics_Has_Genres
        const importTitleGenresQuery = `
            INSERT IGNORE INTO Title_Basics_Has_Genres (Title_Basics_T_const, Genres_GenreID) 
            SELECT DISTINCT ttb.T_const, g.GenreID 
            FROM temp_title_basics ttb 
            JOIN Genres g ON FIND_IN_SET(g.GenreName, ttb.Genres) > 0;
        `;

        // Import data into table Title_Basics
        await connection.query(importTitleBasicsQuery);

        // Import data into table Genres
        await connection.query(importGenresQuery);

        // Import data into table Title_Basics_Has_Genres
        await connection.query(importTitleGenresQuery);

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        // Close the connection
        await connection.end();

        // Return success message
        return 'Title_Basics file uploaded successfully';
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

// Function to upload data to Title_Akas table
async function uploadTitleAkas(filePath) {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(uploadDir, 'temp_title_akas.tsv');
        fs.writeFileSync(tempFilePath, 'Title_Id\tOrdering\tTitle\tRegion\tLanguage\tTypes\tAttributes\tIs_original_title\n' + fileContent, 'utf8');

        // Connect to MySQL using the mysql2 package
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'softeng'
        });

        // Create the temporary table
        const createTempTableQuery = `
            CREATE TEMPORARY TABLE IF NOT EXISTS temp_title_akas (
                Title_Id VARCHAR(45) NOT NULL,
                Ordering INT NOT NULL,
                Title VARCHAR(255) NULL,
                Region VARCHAR(45) NULL,
                Language VARCHAR(45) NULL,
                Types VARCHAR(45) NULL,
                Attributes VARCHAR(255) NULL,
                Is_original_title BINARY(1) NULL,
                PRIMARY KEY (Title_Id, Ordering),
                UNIQUE INDEX Title_Id_Ordering_UNIQUE (Title_Id ASC, Ordering ASC)
            );
        `;

        // Execute the create temporary table query
        await connection.query(createTempTableQuery);

        // Import data into temporary table temp_title_akas from the temporary file
        const importTempTitleAkasQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}' 
            INTO TABLE temp_title_akas 
            FIELDS TERMINATED BY '\t' 
            LINES TERMINATED BY '\n' 
            IGNORE 1 LINES;
        `;

        // Execute the import data query
        await connection.query(importTempTitleAkasQuery);

        // Import data into table Title_Akas from the temporary file
        const importTitleAkasQuery = `
            INSERT IGNORE INTO Title_Akas (Title_Id, Ordering, title, Region, Language, types, attributes, is_original_title)
            SELECT Title_Id, Ordering, Title, Region, Language, Types, Attributes, Is_original_title
            FROM temp_title_akas;
        `;

        // Import data into table Title_Akas
        await connection.query(importTitleAkasQuery);

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        // Close the connection
        await connection.end();

        // Return success message
        return 'Title_Akas file uploaded successfully';
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

// Function to upload data to Name table
async function uploadNameBasics(filePath) {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(uploadDir, 'temp_name_basics.tsv');
        fs.writeFileSync(tempFilePath, 'img_url_asset_name\t' + fileContent, 'utf8');

        // Connect to MySQL using the mysql2 package
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'softeng'
        });

        // Create the temporary table
        const createTempTableQuery = `
            CREATE TEMPORARY TABLE IF NOT EXISTS temp_name_basics (
                N_const VARCHAR(45) NOT NULL,
                Primary_name VARCHAR(255) NOT NULL,
                Birth_year INT NULL,
                Death_year INT NULL,
                Primary_profession VARCHAR(255) NULL,
                Known_for_titles MEDIUMTEXT NULL,
                img_url_asset_name LONGTEXT NULL,
                PRIMARY KEY (N_const),
                UNIQUE INDEX N_const_UNIQUE (N_const ASC)
            );
        `;

        // Execute the create temporary table query
        await connection.query(createTempTableQuery);

        // Import data into temporary table temp_name_basics from the temporary file
        const importTempNameBasicsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}' 
            INTO TABLE temp_name_basics 
            FIELDS TERMINATED BY '\t' 
            LINES TERMINATED BY '\n' 
            IGNORE 1 LINES 
            (N_const, Primary_name, Birth_year, Death_year, Primary_profession, Known_for_titles, img_url_asset_name) ;
        `;

        // Execute the import data query
        await connection.query(importTempNameBasicsQuery);

        // Import data into table Name from the temporary file
        const importNameBasicsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}' 
            INTO TABLE Name
            FIELDS TERMINATED BY '\t' 
            LINES TERMINATED BY '\n' 
            IGNORE 1 LINES 
            (n_const, primary_name, birth_year, death_year, primary_prof, known_for_titles, @img_url_asset_name) 
            SET img_url_asset_name = @img_url_asset_name;
        `;

        // Import data into table Name_Basics
        await connection.query(importNameBasicsQuery);

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        // Close the connection
        await connection.end();

        // Return success message
        return 'Name_Basics file uploaded successfully';
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

// Function to upload data to Title_Crew table
async function uploadTitleCrew(filePath) {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(uploadDir, 'temp_title_crew.tsv');
        fs.writeFileSync(tempFilePath, 'job\tdepartment\tperson_id\tT_const', 'utf8');

        // Connect to MySQL using the mysql2 package
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'softeng'
        });

        // Import data into table Title_Crew from the temporary file
        const importTitleCrewQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}'
            INTO TABLE Crew
            FIELDS TERMINATED BY '\\t'
            LINES TERMINATED BY '\\n'
            IGNORE 1 LINES;
        `;

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        // Close the connection
        await connection.end();

        // Return success message
        return 'Title_Crew file uploaded successfully';
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

// Function to upload data to Title_Episode table
async function uploadTitleEpisode(filePath) {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(uploadDir, 'temp_title_episode.tsv');
        fs.writeFileSync(tempFilePath, 'img_url_asset_episode\t' + fileContent, 'utf8');

        // Connect to MySQL using the mysql2 package
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'softeng'
        });

        // Import data into temporary table Episode from the temporary file
        const importTitleEpisodeQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}' 
            INTO TABLE Episode 
            FIELDS TERMINATED BY '\t' 
            LINES TERMINATED BY '\n' 
            IGNORE 1 LINES;
        `;

        // Import data into table Title_Episode
        await connection.query(importTitleEpisodeQuery);

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        // Close the connection
        await connection.end();

        // Return success message
        return 'Title_Episode file uploaded successfully';
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

// Function to upload data to Title_Principals table
async function uploadTitlePrincipals(filePath) {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(uploadDir, 'temp_title_principals.tsv');
        fs.writeFileSync(tempFilePath, 'characters\t' + fileContent, 'utf8');

        // Connect to MySQL using the mysql2 package
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'softeng'
        });

        // Import data into table Principals from the temporary file
        const importPrincipalsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}'
            INTO TABLE principals
            FIELDS TERMINATED BY '\t'
            LINES TERMINATED BY '\n'
            IGNORE 1 LINES
            (t_const_principals, ordering_principals, n_const_principals, category, job, characters, img_url_asset_principals);
        `;

        // Execute the import data query
        await connection.query(importPrincipalsQuery);

        // Insert data into Title_Basics_has_Principals table
        const insertTitlePrincipalsQuery = `
            INSERT INTO Title_Basics_has_Principals (
                Title_Basics_T_const,
                Principals_t_const_principals,
                Principals_ordering,
                Principals_n_const
            )
            SELECT
                tb.T_const AS Title_Basics_T_const,
                p.t_const_principals AS Principals_t_const_principals,
                p.ordering_principals AS Principals_ordering,
                p.n_const_principals AS Principals_n_const
            FROM
                softeng.Title_Basics tb
            JOIN
                softeng.Principals p ON tb.T_const = p.t_const_principals;
        `;

        // Execute the import data query
        await connection.query(insertTitlePrincipalsQuery);

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        // Close the connection
        await connection.end();

        // Return success message
        return 'Title_Principals file uploaded successfully';
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

// Function to upload data to Title_Ratings table
async function uploadTitleRatings(filePath) {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        // Read the file contents
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Write the file contents to a temporary file with the correct prefix
        const tempFilePath = path.join(uploadDir, 'temp_title_ratings.tsv');
        fs.writeFileSync(tempFilePath, 'img_url_asset_ratings\t' + fileContent, 'utf8');

        // Connect to MySQL using the mysql2 package
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'softeng'
        });

        // Import data into table Title_Ratings from the temporary file
        const importTitleRatingsQuery = `
            LOAD DATA INFILE '${tempFilePath.replace(/\\/g, '/').replace(/'/g, "\\'")}' 
            INTO TABLE ratings
            FIELDS TERMINATED BY '\t'
            LINES TERMINATED BY '\n'
            IGNORE 1 LINES;
        `;

        // Import data into table Title_Ratings
        await connection.query(importTitleRatingsQuery);

        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        // Close the connection
        await connection.end();

        return 'Title_Ratings file uploaded successfully';
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
}

// Combine all endpoints into one
router.post('/admin/upload/all', async (req, res) => {
    try {
        await uploadTitleBasics('./truncated_title.basics.tsv');
        await uploadTitleAkas('./truncated_title.akas.tsv');
        await uploadNameBasics('./truncated_name.basics.tsv');
        await uploadTitleCrew('./truncated_title.crew.tsv');
        await uploadTitleEpisode('./truncated_title.episode.tsv');
        await uploadTitlePrincipals('./truncated_title.principals.tsv');
        await uploadTitleRatings('./truncated_title.ratings.tsv');

        res.status(200).json({ message: 'All files uploaded successfully' });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(401).send("Not Authorized");
        } else {
            return res.status(500).send("Internal error");
        }
    }
});

router.get('/admin/upload/all', (req, res) => {
    // Render the HTML page with the specific message
    const htmlContent = '<html><body><p>Please fill the DB through Postman.</p></body></html>';
    res.send(htmlContent);
});

module.exports = router;
