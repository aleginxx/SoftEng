DELIMITER //

CREATE PROCEDURE get_user_seen_titles(
    IN p_user_id VARCHAR(45)
)
BEGIN
    -- Select titles seen by the user
    SELECT
        t.Primary_title
    FROM
        softeng.user_has_seen_title ust
    JOIN
        softeng.Title_Basics t ON ust.Title_Basics_T_const = t.T_const
    WHERE
        ust.user_user_id = p_user_id;
END //

DELIMITER ;

-- CALL get_user_seen_titles('fafe5a20-939d-11ee-856c-0a0027000013');
