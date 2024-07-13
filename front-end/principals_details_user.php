<?php
// Include the database connection
require_once 'db.php';

if (isset($_GET['id'])) {
    $nConst = $_GET['id']; // Assign the id from the URL to the variable

    try {
        // Prepare and execute query to fetch principal details
        $stmt = $conn->prepare("SELECT * FROM Name WHERE n_const = :nConst");
        $stmt->bindParam(':nConst', $nConst, PDO::PARAM_STR); // Now the variable is correctly defined
        $stmt->execute();
        $principalDetails = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$principalDetails) {
            echo "Principal not found.";
            exit;
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        exit;
    }
} else {
    echo "No principal selected.";
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

        <!-- <?php
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

        ?> -->

    <div class="movie-detail-flex-container">
        <div class="principal-image">
            <!-- Check if the image URL is available, otherwise use a default image -->
            <img src="<?= !empty($principalDetails['img_url_asset_name']) ? htmlspecialchars($principalDetails['img_url_asset_name']) : 'image_unavailable.png'; ?>" alt="<?= htmlspecialchars($principalDetails['primary_name']); ?>">
        </div>
        <div class="movie-details">
            <h1><?= htmlspecialchars($principalDetails['primary_name']); ?></h1>
            <!-- Display additional details, check if they exist before displaying -->
            <?php if (!empty($principalDetails['birth_year'])): ?>
                <p>Birth Year: <?= htmlspecialchars($principalDetails['birth_year']); ?></p>
            <?php endif; ?>
            <?php if (!empty($principalDetails['death_year'])): ?>
                <p>Death Year: <?= htmlspecialchars($principalDetails['death_year']); ?></p>
            <?php endif; ?>
            <?php if (!empty($principalDetails['primary_prof'])): ?>
                <p>Profession: <?= htmlspecialchars($principalDetails['primary_prof']); ?></p>
            <?php endif; ?>
            <!-- Add more details as needed -->
        </div>
    </div>

    <!-- Other HTML content omitted for brevity -->
</body>
</html>