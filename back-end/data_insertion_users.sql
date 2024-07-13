-- Create stored procedure to generate and insert random data for users
DROP PROCEDURE IF EXISTS generate_random_users;

DELIMITER //

CREATE PROCEDURE generate_random_users(IN num_rows INT)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE new_user_id VARCHAR(45);
    DECLARE new_username VARCHAR(45);
    DECLARE new_email VARCHAR(45);
    
    WHILE i < num_rows DO
        SET new_user_id = UUID();
        SET new_username = CONCAT('user_', ROUND(RAND() * 100000));
        SET new_email = CONCAT(new_username, '@example.com');

        -- Check if the generated values already exist
        WHILE EXISTS (
            SELECT 1 FROM `softeng`.`user` 
            WHERE `user_id` = new_user_id 
               OR `username` = new_username 
               OR `email` = new_email
        ) DO
            SET new_user_id = UUID();
            SET new_username = CONCAT('user_', ROUND(RAND() * 100000));
            SET new_email = CONCAT(new_username, '@example.com');
        END WHILE;

        INSERT INTO `softeng`.`user` (
            `user_id`,
            `username`,
            `password`,
            `first_name`,
            `last_name`,
            `age`,
            `is_verified`,
            `email`
        )
        VALUES (
            new_user_id,
            new_username,
            MD5(RAND()),
            CONCAT('First_', ROUND(RAND() * 100)),
            CONCAT('Last_', ROUND(RAND() * 100)),
            ROUND(RAND() * (99 - 18) + 18),
            ROUND(RAND()),
            new_email
        );
        
        SET i = i + 1;
    END WHILE;
    
END //

DELIMITER ;

-- Call generate_random_users to insert random user data
CALL generate_random_users(5000);

-- Create stored procedure to insert random user-movie pairs
DROP PROCEDURE IF EXISTS InsertRandomUserMoviePairs;

DELIMITER //

CREATE PROCEDURE InsertRandomUserMoviePairs(IN numEntries INT)
BEGIN
    DECLARE userId VARCHAR(45);
    DECLARE movieId VARCHAR(45);
    DECLARE favorite INT; -- Changed data type to INT
    DECLARE pairCount INT DEFAULT 0;

    -- Loop to pair users with movies
    userLoop: LOOP
        -- Select a random user
        SELECT user_id INTO userId
        FROM softeng.user
        ORDER BY RAND()
        LIMIT 1;

        -- Select a random movie
        SELECT T_const INTO movieId
        FROM softeng.Title_Basics
        ORDER BY RAND()
        LIMIT 1;

        -- Check if the entry already exists
        IF NOT EXISTS (
            SELECT 1
            FROM softeng.user_has_seen_title
            WHERE user_user_id = userId AND Title_Basics_T_const = movieId
        ) THEN
            -- Generate a random favorite value
            SET favorite = FLOOR(RAND() * 2); -- Generates 0 or 1

            -- Insert the user-movie pair into the user_has_seen_title table
            INSERT INTO softeng.user_has_seen_title (user_user_id, Title_Basics_T_const, favourite)
            VALUES (userId, movieId, favorite);

            -- Increment the count
            SET pairCount = pairCount + 1;
        END IF;

        -- Exit the loop when the desired number of entries is reached
        IF pairCount >= numEntries THEN
            LEAVE userLoop;
        END IF;
    END LOOP userLoop;

END //

DELIMITER ;

-- Call InsertRandomUserMoviePairs to insert random user-movie pairs
CALL InsertRandomUserMoviePairs(10);

-- Select data from user_has_seen_title table to verify
SELECT * FROM `softeng`.`user_has_seen_title` LIMIT 20;
