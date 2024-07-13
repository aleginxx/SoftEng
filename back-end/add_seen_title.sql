DELIMITER //

CREATE PROCEDURE add_seen_title(
    IN p_user_id VARCHAR(45),
    IN p_title_tconst VARCHAR(45)
)
BEGIN
    -- Insert the new record into user_has_seen_title

    INSERT INTO softeng.user_has_seen_title (user_user_id, Title_Basics_T_const, favourite)
    VALUES (p_user_id, p_title_tconst, 0);

    -- Select updated list of titles seen by the user
    SELECT
        t.Primary_title,
        us.username
    FROM
        softeng.user_has_seen_title ust
    JOIN
        softeng.Title_Basics t ON ust.Title_Basics_T_const = t.T_const
    JOIN
        softeng.user us ON ust.user_user_id = us.user_id
    WHERE
        ust.user_user_id = p_user_id;
END //

DELIMITER ;

-- CALL add_seen_title('2e87ff8e-92b2-11ee-9466-0a0027000013', '381662d7-92bf-11ee-9466-0a0027000013');
-- DELETE FROM softeng.user_has_seen_title WHERE user_user_id = '2e87ff8e-92b2-11ee-9466-0a0027000013';
-- DROP PROCEDURE add_seen_title;
