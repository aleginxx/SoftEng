-- DROP PROCEDURE IF EXISTS get_top_genres_by_principal;

DELIMITER //

CREATE PROCEDURE get_top_genres_by_principal(
    IN p_principal_name VARCHAR(100),
    IN p_num_genres INT
)
BEGIN
    -- Temporary table to store the results
    CREATE TEMPORARY TABLE temp_results AS
    SELECT
        n.primary_name AS principal_name,
        g.GenreName AS genre,
        MAX(r.average_rating) AS max_rating
    FROM
        softeng.Principals p
    JOIN
        softeng.Name n ON p.n_const_principals = n.n_const
    JOIN
        softeng.Title_Basics tb ON p.t_const_principals = tb.T_const
	JOIN
		softeng.Title_Basics_Has_Genres tbg ON tb.T_const = tbg.Title_Basics_T_const
	JOIN 
		softeng.Genres g ON tbg.Genres_GenreID = g.GenreID
    LEFT JOIN
        softeng.Ratings r ON tb.T_const = r.t_const_ratings
    WHERE
        n.primary_name = p_principal_name
    GROUP BY
        g.GenreName;

    -- Select the top N genres based on max rating
    SELECT
        principal_name,
        genre,
        max_rating
    FROM
        temp_results
    ORDER BY
        max_rating DESC
    LIMIT p_num_genres;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_results;
END //

DELIMITER ;

-- CALL get_top_genres_by_principal('Ernst Behmer', 5);
