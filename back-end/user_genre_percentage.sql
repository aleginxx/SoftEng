DELIMITER //

CREATE PROCEDURE user_genre_percentage (
    IN p_user_id VARCHAR(100)
)
BEGIN
    DECLARE total_titles INT;

    DROP TEMPORARY TABLE IF EXISTS temp_genre_counts;

    CREATE TEMPORARY TABLE temp_genre_counts AS
    SELECT
        g.GenreID,
        g.GenreName,
        COUNT(*) AS title_count
    FROM
        softeng.user_has_seen_title u
    JOIN
        softeng.Title_Basics_has_Genres tg ON u.Title_Basics_T_const = tg.Title_Basics_T_const
    JOIN
        softeng.Genres g ON tg.Genres_GenreID = g.GenreID
    WHERE
        u.user_user_id = p_user_id
    GROUP BY
        g.GenreID, g.GenreName;

    SELECT COUNT(*) INTO total_titles FROM softeng.user_has_seen_title WHERE user_user_id = p_user_id;

    SELECT
        GenreName,
        title_count / total_titles * 100 AS percentage
    FROM
        temp_genre_counts;
END //

DELIMITER ;
