DROP PROCEDURE IF EXISTS rate_title;

DELIMITER //

CREATE PROCEDURE rate_title(IN t_const_ratings_param VARCHAR(45), IN rating_param INT)
BEGIN
    DECLARE current_average_rating DOUBLE;
    DECLARE current_num_votes INT;

    -- Get the current average rating and number of votes
    SELECT `average_rating`, `num_votes` INTO current_average_rating, current_num_votes
    FROM `softeng`.`Ratings`
    WHERE `t_const_ratings` = t_const_ratings_param;

    -- Update the num_votes and average_rating based on the formula
    UPDATE `softeng`.`Ratings`
    SET
        `num_votes` = current_num_votes + 1,
        `average_rating` = (current_average_rating * current_num_votes + rating_param) / (current_num_votes + 1)
    WHERE `t_const_ratings` = t_const_ratings_param;
END //

DELIMITER ;

-- CALL rate_title('tt0000929', 3);