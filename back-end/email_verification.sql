-- DROP PROCEDURE IF EXISTS email_verification;

DELIMITER //

CREATE PROCEDURE email_verification (
    IN p_user_id VARCHAR(45)
)
BEGIN
    UPDATE softeng.user SET is_verified = 1 WHERE user_id = p_user_id;
END //

DELIMITER ;
