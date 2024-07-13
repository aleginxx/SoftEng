-- Import data into table title_basics from file 'truncated_title_basics.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title_basics.tsv'
INTO TABLE `softeng`.`Title_Basics`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(T_const, Title_type, Primary_title, Original_title, Is_adult, Start_year, End_year, Runtime, @dummy, @img_url_asset_basics)
SET img_url_asset_basics = NULLIF(@img_url_asset_basics, '\\N');

-- Import data into table Genres from file 'truncated_title_basics.tsv'
-- Step 1: Load data from the TSV file into a temporary table
CREATE TEMPORARY TABLE IF NOT EXISTS `softeng`.`temp_title_basics` (
    T_const VARCHAR(45) NOT NULL,
    Title_type VARCHAR(45) NOT NULL,
    Primary_title MEDIUMTEXT NOT NULL,
    Original_title MEDIUMTEXT NOT NULL,
    Is_adult BINARY(1) NOT NULL,
    Start_year INT NOT NULL,
    End_year INT NULL,
    Runtime INT NULL,
    Genres VARCHAR(45) NULL,
    img_url_asset_basics LONGTEXT NULL
);

LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title_basics.tsv'
INTO TABLE `softeng`.`temp_title_basics`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(T_const, Title_type, Primary_title, Original_title, Is_adult, Start_year, End_year, Runtime, Genres, @img_url_asset_basics)
SET img_url_asset_basics = NULLIF(@img_url_asset_basics, '\\N');

-- Step 2: Split comma-separated values and insert into the Genres table, excluding NULL, empty, and spaces-only values
INSERT INTO `softeng`.`Genres` (GenreName)
SELECT DISTINCT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(temp_title_basics.Genres, ',', n.digit + 1), ',', -1)) AS GenreName
FROM temp_title_basics
JOIN (SELECT 0 AS digit UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) n
  ON LENGTH(temp_title_basics.Genres) - LENGTH(REPLACE(temp_title_basics.Genres, ',', '')) >= n.digit
WHERE temp_title_basics.Genres IS NOT NULL AND TRIM(temp_title_basics.Genres) <> ''  -- Exclude NULL, empty, and spaces-only values
ORDER BY temp_title_basics.T_const;

-- Import data into table TitleGenres
INSERT IGNORE INTO `softeng`.`Title_Basics_Has_Genres` (`Title_Basics_T_const`, `Genres_GenreID`)
SELECT DISTINCT ttb.T_const, g.GenreID
FROM `softeng`.`temp_title_basics` ttb
JOIN `softeng`.`Genres` g ON FIND_IN_SET(g.GenreName, ttb.Genres) > 0;

DROP TEMPORARY TABLE IF EXISTS `softeng`.`temp_title_basics`;

-- Import data into table crew from file 'truncated_title_crew.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title_crew.tsv'
INTO TABLE `softeng`.`crew`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Import data into table episode from file 'truncated_title_episode.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title_episode.tsv'
INTO TABLE `softeng`.`episode`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Import data into table name from file 'truncated_name_basics.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_name_basics.tsv'
INTO TABLE `softeng`.`name`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(n_const, primary_name, birth_year, death_year, primary_prof, known_for_titles, @img_url_asset_name)
SET img_url_asset_name = NULLIF(@img_url_asset, '\\N');

-- Import data into table principals from file 'truncated_title_principals.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title_principals.tsv'
INTO TABLE `softeng`.`principals`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(t_const_principals, ordering_principals, n_const_principals, category, job, characters, @img_url_asset_principals)
SET img_url_asset_principals = NULLIF(@img_url_asset, '\\N');

-- Import data into table ratings from file 'truncated_title_ratings.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title_ratings.tsv'
INTO TABLE `softeng`.`ratings`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Import data into table title_akas from file 'truncated_title_akas.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title_akas.tsv'
INTO TABLE `softeng`.`title_akas`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- SELECT * FROM `softeng`.`crew` LIMIT 20;
-- SELECT * FROM `softeng`.`episode` LIMIT 20;
-- SELECT * FROM `softeng`.`name` LIMIT 20;
-- SELECT * FROM `softeng`.`principals` LIMIT 20;
-- SELECT * FROM `softeng`.`ratings` LIMIT 20;
-- SELECT * FROM `softeng`.`title_akas` LIMIT 20;
-- SELECT * FROM `softeng`.`title_basics` LIMIT 20;
-- SELECT * FROM `softeng`.`Genres` LIMIT 25;
-- SELECT * FROM `softeng`.`TitleGenres` LIMIT 20;

INSERT INTO `softeng`.`Title_Basics_has_Principals` (
    `Title_Basics_T_const`,
    `Principals_t_const_principals`,
    `Principals_ordering`,
    `Principals_n_const`
)
SELECT
    tb.`T_const` AS `Title_Basics_T_const`,
    p.`t_const_principals` AS `Principals_t_const_principals`,
    p.`ordering_principals` AS `Principals_ordering`,
    p.`n_const_principals` AS `Principals_n_const`
FROM
    `softeng`.`Title_Basics` tb
JOIN
    `softeng`.`Principals` p
ON
    tb.`T_const` = p.`t_const_principals`;


-- -- SELECT * FROM `softeng`.`Title_Basics_has_Principals` LIMIT 20;
