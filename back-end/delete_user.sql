DROP PROCEDURE IF EXISTS delete_user;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS delete_user (
	IN p_username VARCHAR(45)
)
BEGIN
	DELETE FROM softeng.user WHERE username = p_username;
END //

DELIMITER ;

-- CALL delete_user('new_username');
