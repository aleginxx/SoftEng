<?php
// Database connection
$host = 'localhost';
$dbname = 'softeng';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Handle search form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $genre = $_POST['genre'];  // Assuming you have an input field named 'genre' in your form
        $N = $_POST['N'];          // Assuming you have an input field named 'N' in your form

        // Call the stored procedure
        $sql = "CALL get_best_rated_titles_movies(:genre, :N)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':genre', $genre, PDO::PARAM_STR);
        $stmt->bindParam(':N', $N, PDO::PARAM_INT);
        $stmt->execute();

        // Fetch the results
        $films = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        // If the form is not submitted, fetch all movies as default
        $sql = "SELECT T_const, Primary_title, img_url_asset_basics FROM title_basics WHERE Title_type IN ('movie', 'short')";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $films = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NTUA-flix / Movies</title>
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

    <!-- Search form -->
<!-- Search form -->
<div class="search-container">
    <form method="post" action="/softeng23-16/front-end/movies_user.php">
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

        <label for="N">Number of Films:</label>
        <input type="number" id="N" name="N" required min="1">

        <button type="submit" class="search-button">Search</button>
    </form>
</div>

    <!-- Movie Content -->
    <div class="movies-container">
        <?php if (!empty($films)): ?>
            <?php foreach ($films as $row): ?>
                <div class="movie">
                    <a href="/softeng23-16/front-end/movie_details_user.php?id=<?= htmlspecialchars($row['T_const']); ?>">
                        <?php
                            // Trim the value to remove whitespace and newlines, and check for the placeholder '\N'
                            $image_url = trim($row['img_url_asset_basics']);
                            $isUnavailable = $image_url === 'N' || $image_url === '\N' || $image_url === '';
                        ?>
                        <?php if (!$isUnavailable): ?>
                            <img src="<?= htmlspecialchars($image_url); ?>" alt="<?= htmlspecialchars($row['Primary_title']); ?>">
                        <?php else: ?>
                            <img src="Image_unavailable.png" alt="Default Image">
                        <?php endif; ?>
                        <div class="movie-title"><?= htmlspecialchars($row['Primary_title']); ?></div>
                    </a>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>No results</p>
        <?php endif; ?>
    </div>
    <script src="app.js"></script>
</body>
</html>