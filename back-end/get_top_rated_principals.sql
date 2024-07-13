DELIMITER //

CREATE PROCEDURE get_top_rated_principals(
    IN p_limit INT
)
BEGIN
    -- Temporary table to store the results
    CREATE TEMPORARY TABLE temp_results AS
    SELECT
        n.primary_name AS principal_name,
        MAX(r.average_rating) AS highest_rating
    FROM
        softeng.Principals p
    JOIN
        softeng.Name n ON p.n_const_principals = n.n_const
    JOIN
        softeng.Ratings r ON p.t_const_principals = r.t_const_ratings
    GROUP BY
        n.primary_name
    ORDER BY
        highest_rating DESC
    LIMIT
        p_limit;

    -- Select the results from the temporary table
    SELECT * FROM temp_results;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_results;
END //

DELIMITER ;

-- CALL get_top_rated_principals(5);
