DROP PROCEDURE IF EXISTS get_best_rated_titles_movies;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS get_best_rated_titles_movies(
    IN p_genre VARCHAR(100),
    IN p_N INT
)
BEGIN
    -- Temporary table to store the results
    CREATE TEMPORARY TABLE temp_results AS
    SELECT DISTINCT
        tb.T_const,
        tb.Primary_title,
        r.average_rating,
        tb.img_url_asset_basics
    FROM
        Title_Basics tb
    JOIN
        Ratings r ON tb.T_const = r.t_const_ratings
    JOIN
        Title_Basics_Has_Genres tbg ON tb.T_const = tbg.Title_Basics_T_const
    JOIN 
        Genres g ON tbg.Genres_GenreID = g.GenreID
    WHERE
        FIND_IN_SET(p_genre, g.GenreName) > 0 
        AND (tb.Title_type = 'movie' OR tb.Title_type = 'short' OR tb.Title_type IS NULL) 
    ORDER BY
        r.average_rating DESC
    LIMIT
        p_N;

    -- Select the results from the temporary table
    SELECT * FROM temp_results;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_results;
END //

DELIMITER ;

 CALL get_best_rated_titles_movies('Drama', 5);
