-- DROP PROCEDURE IF EXISTS create_user;

DELIMITER //

CREATE PROCEDURE create_user(
    IN p_username VARCHAR(45),
    IN p_password VARCHAR(45),
    IN p_first_name VARCHAR(45),
    IN p_last_name VARCHAR(45),
    IN p_age INT,
    IN p_email VARCHAR(45)
)
BEGIN
    DECLARE username_exists INT;
    DECLARE email_exists INT;
    DECLARE new_user_id VARCHAR(45);

    -- Check if the username already exists
    SELECT COUNT(*) INTO username_exists
    FROM softeng.user
    WHERE username = p_username;

    -- Check if the email already exists
    SELECT COUNT(*) INTO email_exists
    FROM softeng.user
    WHERE email = p_email;

    -- If username exists, print an error message
    IF username_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This username already exists.';
    END IF;

    -- If email exists, print an error message
    IF email_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This email is already used.';
    END IF;

    -- Generate a UUID for the new user_id
    SET new_user_id = UUID();

    -- Insert the user with is_verified set to 1
    INSERT INTO `softeng`.`user` (
        `user_id`,
        `username`,
        `password`,
        `first_name`,
        `last_name`,
        `age`,
        `is_verified`,
        `email`
    ) VALUES (
        new_user_id,
        p_username,
        p_password,
        p_first_name,
        p_last_name,
        p_age,
        1, -- Set is_verified to 1 upon creation
        p_email
    );
END //

DELIMITER ;

-- CALL create_user('new_username', 'new_password', 'New User First Name', 'New User Last Name', 28, 'new_user@example.com');
-- SELECT * FROM softeng.user WHERE username = 'new_username';
-- DELETE FROM softeng.user WHERE username = 'new_username';
