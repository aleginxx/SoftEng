DROP PROCEDURE IF EXISTS GetFilteredTitles;

DELIMITER //

CREATE PROCEDURE GetFilteredTitles(
    IN qgenre VARCHAR(255),
    IN minrating DOUBLE,
    IN yrFrom INT,
    IN yrTo INT
)
BEGIN
    SET @sql = CONCAT('
        SELECT
            TB.T_const AS titleID,
            TB.Title_type AS type,
            TB.Original_title AS originalTitle,
            TB.img_url_asset_basics AS titlePoster,
            TB.Start_year AS startYear,
            TB.End_year AS endYear,
            JSON_ARRAY(JSON_OBJECT(''genreTitle'', GROUP_CONCAT(DISTINCT G.GenreName))) AS genreTitle,
            JSON_ARRAY(JSON_OBJECT(''akaTitle'', GROUP_CONCAT(DISTINCT TA.title), ''regionAbbrev'', GROUP_CONCAT(DISTINCT TA.Region))) AS akaTitle,
            JSON_ARRAY(JSON_OBJECT(''nameID'', GROUP_CONCAT(DISTINCT N.n_const), ''name'', GROUP_CONCAT(N.primary_name), ''category'', GROUP_CONCAT(DISTINCT P.job))) AS principals,
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
            G.GenreName = ? 
            AND R.average_rating >= ?
            AND (
                (TB.Start_year >= ? AND TB.Start_year <= ?)
                OR
                (TB.End_year IS NOT NULL AND TB.End_year >= ? AND TB.End_year <= ?)
            )
        GROUP BY
            TB.T_const');

    SET @genre = qgenre;
    SET @rating = minrating;
    SET @startYear = yrFrom;
    SET @endYear = yrTo;

    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @genre, @rating, @startYear, @endYear, @startYear, @endYear;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

CALL GetFilteredTitles('Comedy', 8, 1990, 1992);