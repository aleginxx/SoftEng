DROP PROCEDURE IF EXISTS add_to_favourites;

DELIMITER //

CREATE PROCEDURE add_to_favourites(IN inputUserID VARCHAR(45), IN inputMovieID VARCHAR(45))
BEGIN
    DECLARE currentFavorite BINARY(1);

    -- Check if the entry exists
    IF EXISTS (
        SELECT 1
        FROM softeng.user_has_seen_title
        WHERE user_user_id = inputUserID AND Title_Basics_T_const = inputMovieID
    ) THEN
        -- Get the current favorite value
        SELECT favourite INTO currentFavorite
        FROM softeng.user_has_seen_title
        WHERE user_user_id = inputUserID AND Title_Basics_T_const = inputMovieID;

        -- Update the entry only if the current favorite value is not 0
        IF currentFavorite = 0 THEN
            UPDATE softeng.user_has_seen_title
            SET favourite = 1
            WHERE user_user_id = inputUserID AND Title_Basics_T_const = inputMovieID;
        END IF;
    END IF;

END //

DELIMITER ;

-- CALL add_to_favourites('3254b3dd-af24-11ee-8574-0a0027000014', 'tt0101443');

-- SELECT * FROM `softeng`.`user_has_seen_title` WHERE user_user_id = '3254b3dd-af24-11ee-8574-0a0027000014';
