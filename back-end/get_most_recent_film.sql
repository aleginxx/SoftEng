-- DROP PROCEDURE IF EXISTS get_most_recent_film;

DELIMITER //

CREATE PROCEDURE get_most_recent_film(
    IN p_principal_name VARCHAR(100)
)
BEGIN
    -- Temporary table to store the results
    CREATE TEMPORARY TABLE temp_results AS
    SELECT
        n.primary_name AS principal_name,
        tb.Primary_title AS title,
        tb.Start_year AS start_year
    FROM
        softeng.Principals p
    JOIN
        softeng.Name n ON p.n_const_principals = n.n_const
    JOIN
        softeng.Title_Basics tb ON p.t_const_principals = tb.T_const
    WHERE
        n.primary_name = p_principal_name
    ORDER BY
        tb.Start_year DESC
    LIMIT 1;

    -- Select the results from the temporary table
    SELECT * FROM temp_results;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_results;
END //

DELIMITER ;

-- CALL get_most_recent_film('Ernst Behmer');