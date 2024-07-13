-- Import data into table title_basics from file 'truncated_title_basics.tsv'
LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title.basics.tsv'
INTO TABLE `softeng`.`Title_Basics`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(T_const, Title_type, Primary_title, Original_title, Is_adult, Start_year, End_year, Runtime, @genres, @img_url_asset_basics)
SET img_url_asset_basics = @img_url_asset_basics;

-- Import data into table Genres from file 'truncated_title_basics.tsv'
-- Step 1: Load data from the TSV file into a temporary table
DROP TEMPORARY TABLE IF EXISTS `softeng`.`temp_title_basics`;
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
    img_url_asset_basics LONGTEXT NULL,
    PRIMARY KEY (`T_const`),
	UNIQUE INDEX `T_const_UNIQUE` (`T_const` ASC) 
);

LOAD DATA INFILE 'C:/xampp/mysql/data/softeng/truncated_data/truncated_title.basics.tsv'
INTO TABLE `softeng`.`temp_title_basics`
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(T_const, Title_type, Primary_title, Original_title, Is_adult, Start_year, End_year, Runtime, Genres, img_url_asset_basics);

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
