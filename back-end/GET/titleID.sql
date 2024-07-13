DROP PROCEDURE IF EXISTS GetTitleInfo;

DELIMITER //

CREATE PROCEDURE GetTitleInfo(IN inputTitleID VARCHAR(255))
BEGIN
    SET @sql = CONCAT('
        SELECT
            TB.T_const AS titleID,
            TB.Title_type AS type,
            TB.Original_title AS originalTitle,
            TB.img_url_asset_basics AS titlePoster,
            TB.Start_year AS startYear,
            TB.End_year AS endYear,
            JSON_ARRAY(JSON_OBJECT(''genreTitle'', GROUP_CONCAT(DISTINCT G.GenreName))) AS genres,
            JSON_ARRAY(JSON_OBJECT(''akaTitle'', GROUP_CONCAT(DISTINCT TA.title), ''regionAbbrev'', GROUP_CONCAT(DISTINCT TA.Region))) AS titleAkas,
            JSON_ARRAY(JSON_OBJECT(''nameID'', GROUP_CONCAT(DISTINCT N.n_const), ''name'', GROUP_CONCAT(DISTINCT N.primary_name), ''category'', GROUP_CONCAT(DISTINCT P.job))) AS principals,
            JSON_OBJECT(''avRating'', R.average_rating, ''nVotes'', R.num_votes) AS rating
        FROM
            Title_Basics TB
        JOIN
            Title_Basics_Has_Genres BG ON TB.T_const = BG.Title_Basics_T_const
        JOIN
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
            TB.T_const = ?');

    SET @titleID = inputTitleID;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @titleID;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

CALL GetTitleInfo('tt0000929');
