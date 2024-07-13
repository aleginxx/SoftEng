-- DROP PROCEDURE IF EXISTS get_highest_rated_title_by_principal;

DELIMITER //

CREATE PROCEDURE get_highest_rated_title_by_principal(
    IN p_principal_name VARCHAR(100)
)
BEGIN
    -- Temporary table to store the results
    CREATE TEMPORARY TABLE temp_results AS
    SELECT
        tb.T_const,
        tb.Primary_title,
        r.average_rating
    FROM
        softeng.Title_Basics tb
    JOIN
        softeng.Ratings r ON tb.T_const = r.t_const_ratings
    JOIN
        softeng.Principals p ON tb.T_const = p.t_const_principals
    JOIN
        softeng.Name n ON p.n_const_principals = n.n_const
    WHERE
        n.primary_name = p_principal_name
    ORDER BY
        r.average_rating DESC
    LIMIT
        1;

    -- Select the results from the temporary table
    SELECT * FROM temp_results;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_results;
END //

DELIMITER ;

-- SELECT * FROM `softeng`.`Principals` LIMIT 20;
-- SELECT * FROM`softeng`.`Name` WHERE n_const ='nm0066941';
-- CALL get_highest_rated_title_by_principal('Ernst Behmer');

