<?php
// Include the database connection
require_once 'db.php';

if (isset($_GET['id'])) {
    $filmId = $_GET['id'];

    try {
        // Prepare the SQL statement
        // $stmt = $conn->prepare("SELECT 
        //                             tb.T_const,
        //                             tb.Primary_title,
        //                             tb.Original_title,
        //                             tb.Start_year,
        //                             tb.Runtime,
        //                             tb.img_url_asset_basics,
        //                             GROUP_CONCAT(DISTINCT g.GenreName ORDER BY g.GenreName ASC SEPARATOR ', ') AS Genres,
        //                             c.directors,
        //                             c.writters,
        //                             GROUP_CONCAT(DISTINCT n.primary_name ORDER BY n.primary_name ASC SEPARATOR ', ') AS Actors,
        //                             r.average_rating,
        //                             r.num_votes
        //                         FROM 
        //                             Title_Basics tb
        //                         LEFT JOIN 
        //                             Title_Basics_has_Genres tbg ON tb.T_const = tbg.Title_Basics_T_const
        //                         LEFT JOIN 
        //                             Genres g ON tbg.Genres_GenreID = g.GenreID
        //                         LEFT JOIN 
        //                             Crew c ON tb.T_const = c.t_const_crew
        //                         LEFT JOIN 
        //                             Ratings r ON tb.T_const = r.t_const_ratings
        //                         LEFT JOIN 
        //                             Principals p ON tb.T_const = p.t_const_principals AND p.category IN ('actor', 'actress')
        //                         LEFT JOIN 
        //                             Name n ON p.n_const_principals = n.n_const
        //                         WHERE 
        //                             tb.T_const = :filmId
        //                         GROUP BY 
        //                             tb.T_const");
        $stmt = $conn->prepare("SELECT 
                                    tb.T_const,
                                    tb.Primary_title,
                                    tb.Original_title,
                                    tb.Start_year,
                                    e.season_number,
                                    e.episode_number,
                                    tb.img_url_asset_basics
                                 
                                FROM 
                                    Title_Basics tb
                                LEFT JOIN 
                                    Episode e ON tb.T_const = e.t_const_episode
                            
                                WHERE 
                                    tb.T_const = :filmId
                                ");
        // Bind the film ID parameter
        $stmt->bindParam(':filmId', $filmId, PDO::PARAM_STR);
        // Execute the statement
        $stmt->execute();
        // Fetch the results
        $filmDetails = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$filmDetails) {
            echo "Film not found.";
            exit;
        }
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
        exit;
    }
} else {
    echo "No film selected.";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport"
        content="width-device-width,
        initial-scale=1.0" /> 
        <title>NTUA-flix / Movies </title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="styles.css">
    </head>
    <body class="background">
        <!-- navigation bar -->
        <nav class="navbar">
            <div class="navbar__container">
                <a href="/softeng23-16/front-end/user.php" id="navbar__logo"> ntua-flix </a>
                <div class="navbar__toggle" id="mobile-menu">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
                <ul class="navbar__menu">
                    <li class="navbar__item">
                        <a href="/softeng23-16/front-end/user.php" class="navbar__links"> Home </a>
                    </li>
                    <li class="navbar__item">
                        <a href="/softeng23-16/front-end/movies_user.php" class="navbar__links"> Movies </a>
                    </li>
                    <li class="navbar__item">
                        <a href="/softeng23-16/front-end/series_user.php" class="navbar__links"> Series </a>
                    </li>
                    <li class="navbar__item">
                        <a href="/softeng23-16/front-end/principals_user.php" class="navbar__links"> Principals </a>
                    </li>
                    <li class="navbar__btn">
                        <a href="/softeng23-16/front-end/profile.php" class="button"> My Profile </a>
                    </li>
                </ul>
            </div>
        </nav>

        <?php
            // Assuming $filmDetails contains the details of the movie
            // Trim the value to remove whitespace and newlines, and check for the placeholder '\N'
            $image_url = trim($filmDetails['img_url_asset_basics']);
            // Check if the image URL is 'N', '\N', or an empty string
            $isUnavailable = $image_url === 'N' || $image_url === '\N' || $image_url === '';
        ?>

        <?php
            // After you fetch the details of the movie into $filmDetails
            $actors = $filmDetails['Actors'] ?? '';  // Use the null coalescing operator to handle the case where 'Actors' might not be set
            $actors = !empty($actors) ? $actors : 'N/A';  // If actors are not available, set to 'N/A'
            // Check if genres are available
            $genres = $filmDetails['Genres'] ?? ''; // Use the null coalescing operator to handle the case where 'Genres' might not be set
            // If genres are not available, set to '-'
            $genres = !empty($genres) ? $genres : '-';

            $directorIds = explode(",", $filmDetails['directors']); // Assuming the IDs are comma-separated
            $directorNames = [];
            foreach ($directorIds as $directorId) {
                $directorId = trim($directorId); // Trim any whitespace
                // Fetch the director's name using another prepared statement
                // Ensure you have the correct SQL statement to get the director's name based on the director ID
                $directorStmt = $conn->prepare("SELECT primary_name FROM Name WHERE n_const = :directorId");
                $directorStmt->bindParam(':directorId', $directorId, PDO::PARAM_STR);
                $directorStmt->execute();
                $directorName = $directorStmt->fetch(PDO::FETCH_ASSOC);
                if ($directorName) {
                    $directorNames[] = $directorName['primary_name'];
                }
            }
            // Now, you should add the director names to the $filmDetails array
            $filmDetails['DirectorNames'] = implode(", ", $directorNames);

        ?>

        <div class="movie-detail-flex-container">
            <div class="movie-image">
                <?php if (!$isUnavailable): ?>
                    <!-- If the image URL is available, display the image -->
                    <img src="<?= htmlspecialchars($image_url); ?>" alt="<?= htmlspecialchars($filmDetails['Primary_title']); ?>" class="movie-detail-image">
                <?php else: ?>
                    <!-- If the image URL is not available, display a placeholder image -->
                    <img src="image_unavailable.png" alt="Default Image" class="movie-detail-image">
                <?php endif; ?>
            </div>
            <div class="movie-details">
                <h1><?= htmlspecialchars($filmDetails['Primary_title']); ?></h1>
                <p><strong>Original Title:</strong> <?= htmlspecialchars($filmDetails['Original_title']); ?></p>
                <p><strong>Year:</strong> <?= htmlspecialchars($filmDetails['Start_year']); ?></p>
                <p><strong>Duration:</strong> <?= htmlspecialchars($filmDetails['Runtime']); ?> minutes</p>
                <p><strong>Genres:</strong> <?= htmlspecialchars($genres); ?></p>
                <p><strong>Director:</strong> <?= htmlspecialchars($filmDetails['DirectorNames']); ?></p>
                <p><strong>Actors:</strong> <?= htmlspecialchars($actors); ?></p>
            </div>
            <div class="movie-rating-votes">
                <div class="rating">
                    <span class="icon">⭐</span> <!-- Replace with an actual star icon image if necessary -->
                    <span class="rating-value"><?= htmlspecialchars($filmDetails['average_rating'] ?? 'N/A'); ?></span>
                </div>
                <div class="votes">
                    <span class="icon">👍</span> <!-- Replace with an actual thumbs up icon image if necessary -->
                    <span class="votes-value"><?= htmlspecialchars($filmDetails['num_votes'] ?? 'N/A'); ?></span>
                </div>
            </div>
        </div>

    </body>
</html>