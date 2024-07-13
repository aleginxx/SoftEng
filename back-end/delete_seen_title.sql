DROP PROCEDURE IF EXISTS delete_seen_titles;

DELIMITER //

CREATE PROCEDURE delete_seen_title(IN in_user_id VARCHAR(45), IN in_T_const VARCHAR(45))
BEGIN
    -- Delete the entry from user_has_seen_title
    DELETE FROM user_has_seen_title
    WHERE user_user_id = in_user_id AND Title_Basics_T_const = in_T_const;
END //

DELIMITER ;
