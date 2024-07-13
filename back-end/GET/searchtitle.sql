DROP PROCEDURE IF EXISTS GetTitlesByOriginalTitle;

DELIMITER //

CREATE PROCEDURE GetTitlesByOriginalTitle(IN inputTitlePattern VARCHAR(255))
BEGIN
    SET @sql = CONCAT('
        SELECT
            TB.T_const AS titleID,
            TB.Title_type AS type,
            TB.Original_title AS originalTitle,
            TB.img_url_asset_basics AS titlePoster,
            TB.Start_year AS startYear,
            TB.End_year AS endYear,
            CONCAT(\'[\', GROUP_CONCAT(DISTINCT CONCAT(\'{"genreTitle":"\', G.GenreName, \'"}\')), \']\') AS genreTitle,
            CONCAT(\'[\', GROUP_CONCAT(DISTINCT CONCAT(\'{"akaTitle":"\', TA.title, \'","regionAbbrev":"\', TA.Region, \'"}\')), \']\') AS akaTitle,
            CONCAT(\'[\', GROUP_CONCAT(DISTINCT CONCAT(\'{"nameID":"\', N.n_const, \'","name":"\', N.primary_name, \'","category":"\', P.job, \'"}\')), \']\') AS principals,
            JSON_OBJECT(\'avRating\', COALESCE(R.average_rating, 0), \'nVotes\', COALESCE(R.num_votes, 0)) AS rating
        FROM
            Title_Basics TB
        LEFT JOIN
            Title_Basics_Has_Genres BG ON TB.T_const = BG.Title_Basics_T_const
        LEFT JOIN
            Genres G ON BG.Genres_GenreID = G.GenreID
        LEFT JOIN
            Title_akas TA ON TB.T_const = TA.Title_Id
        LEFT JOIN
            Principals P ON TB.T_const = P.t_const_principals
        LEFT JOIN
            Name N ON P.n_const_principals = N.n_const
        LEFT JOIN
            Ratings R ON TB.T_const = R.t_const_ratings
        WHERE
            TB.Original_title LIKE ?');

    SET @titlePattern = inputTitlePattern;

    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @titlePattern;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

CALL GetTitlesByOriginalTitle('Klebolin klebt alles');
