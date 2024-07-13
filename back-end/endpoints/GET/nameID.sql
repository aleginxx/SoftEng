DROP PROCEDURE IF EXISTS GetNameInfo;

DELIMITER //

CREATE PROCEDURE GetNameInfo(IN inputNameID VARCHAR(255))
BEGIN
    SET @sql = CONCAT('
        SELECT
            N.n_const AS nameID,
            N.primary_name AS name,
            N.img_url_asset_name AS namePoster,
            N.birth_year AS birthYr,
            N.death_year AS deathYr,
            N.primary_prof AS profession,
            P.t_const_principals AS titleID,
            P.category AS category
        FROM
            Name N
        LEFT JOIN
            Principals P ON N.n_const = P.n_const_principals
        WHERE
            N.n_const = ?');

    SET @nameID = inputNameID;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @nameID;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

CALL GetNameInfo('nm0874096');