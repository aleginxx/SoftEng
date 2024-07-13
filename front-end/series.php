<?php
// Database connection
require_once 'db.php';

try {
    // Fetch series before search
    $preSearchStmt = $conn->prepare("SELECT T_const, Primary_title, Original_title, Start_year, img_url_asset_basics
                                    FROM Title_Basics
                                    WHERE Title_type = 'tvEpisode'");
    $preSearchStmt->execute();
    $preSeries = $preSearchStmt->fetchAll(PDO::FETCH_ASSOC);

    // Prepare the SQL statement to select tv episodes
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $genre = $_POST['genre'];
        $N = $_POST['N'];

        // Ensure N is a positive integer
        if (!is_numeric($N) || $N <= 0) {
            // Handle the error as needed
            echo "Invalid value for N";
            exit;
        }

        // Call the stored procedure for episodes
        $sql = "CALL get_best_rated_titles_episodes(:genre, :N)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':genre', $genre, PDO::PARAM_STR);
        $stmt->bindParam(':N', $N, PDO::PARAM_INT);
        $stmt->execute();

        // Fetch the results
        $series = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $stmt = $conn->prepare("SELECT T_const, Primary_title, Original_title, Start_year, img_url_asset_basics
                                FROM Title_Basics
                                WHERE Title_type = 'tvEpisode'");
        $stmt->execute();
        $series = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NTUA-flix / Series</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body class = background>
    <!-- Navigation bar -->
    <nav class="navbar">
        <div class="navbar__container">
            <a href="/" id="navbar__logo"> ntua-flix </a>
            <div class="navbar__toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <ul class="navbar__menu">
                <li class="navbar__item">
                    <a href="/softeng23-16/front-end/index.php" class="navbar__links"> Home </a>
                </li>
                <li class="navbar__item">
                    <a href="/softeng23-16/front-end/movies.php" class="navbar__links"> Movies </a>
                </li>
                <li class="navbar__item">
                    <a href="/softeng23-16/front-end/series.php" class="navbar__links"> Series </a>
                </li>
                <li class="navbar__item">
                    <a href="/softeng23-16/front-end/principals.php" class="navbar__links"> Principals </a>
                </li>
                <li class="navbar__btn">
                    <a href="/softeng23-16/front-end/credentials.php" class="button"> Log In / Sign Up </a>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Search form -->
    <div class="search-container">
        <form method="post" action="/softeng23-16/front-end/series.php">
            <label for="genre">Genre:</label>
                <select id="genre" name="genre" required>
                    <?php
                    // Fetch genres from the database
                    $genreQuery = "SELECT GenreName FROM genres";
                    $stmt = $conn->prepare($genreQuery);
                    $stmt->execute();
                    $genres = $stmt->fetchAll(PDO::FETCH_COLUMN);
                    
                    // Populate the dropdown list with genres
                    foreach ($genres as $genre) {
                        echo "<option value=\"$genre\">$genre</option>";
                    }
                    ?>
                </select>
            <label for="N">Number of Episodes:</label>
            <input type="number" id="N" name="N" required min="1">
            <button type="submit" class="search-button">Search</button>
        </form>
    </div>

    <!-- Series Content -->
    <div class="movies-container">
        <?php foreach ($series as $episode): ?>
            <div class="movie">
                <a href="/softeng23-16/front-end/series_details.php?id=<?= htmlspecialchars($episode['T_const']); ?>">
                    <img src="<?= $episode['img_url_asset_basics'] ?: 'image_unavailable.png'; ?>" alt="<?= htmlspecialchars($episode['Primary_title']); ?>">
                    <div class="movie-title"><?= htmlspecialchars($episode['Primary_title']); ?></div>
                </a>
            </div>
        <?php endforeach; ?>
    </div>
    <script src="app.js"></script>
</body>
</html>
