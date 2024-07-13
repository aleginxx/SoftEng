DROP PROCEDURE IF EXISTS GetPrincipalsByName;

DELIMITER //

CREATE PROCEDURE GetPrincipalsByName(IN inputName VARCHAR(255))
BEGIN
    SET @sql = CONCAT('
        SELECT
            N.n_const AS nameID,
            N.primary_name AS name,
            N.img_url_asset_name AS img_url_asset_name,
            N.birth_year AS birthYr,
            N.death_year AS deathYr,
            P.job AS profession,
            P.t_const_principals AS titleID,
            P.category AS category
        FROM
            Principals P
        JOIN
            Name N ON P.n_const_principals = N.n_const
        WHERE
            N.primary_name LIKE CONCAT(''%'', ? ,''%'')');

    SET @name = inputName;

    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @name;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

CALL GetPrincipalsByName('Fernando Trueba');