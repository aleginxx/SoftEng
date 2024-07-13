<?php
// Database connection
require_once 'db.php';

try {
    // Initialize variables
    $allPrincipals = [];
    $topRatedPrincipals = [];
    $searchResults = [];
    $searchTopGenresResults = [];
    $searchHighestRatedTitleResults = [];
    $searchHighestRatedTitlePrincipal = "";
    $searchTopGenresPrincipal = "";

    // Handle top rated principals form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['limit'])) {
        $limit = $_POST['limit'];

        // Call the stored procedure to get top rated principals
        $sqlTopRated = "CALL get_top_rated_principals(:limit)";
        $stmtTopRated = $conn->prepare($sqlTopRated);
        $stmtTopRated->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmtTopRated->execute();

        // Fetch the results
        $topRatedPrincipals = $stmtTopRated->fetchAll(PDO::FETCH_ASSOC);
    }

    // Handle search principal form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['search_type'])) {
        $searchType = $_POST['search_type'];
        $searchPrincipal = $_POST['search_principal'];

        switch ($searchType) {
            case 'recent':
                // Call the stored procedure to get most recent film for the searched principal
                $sqlSearch = "CALL get_most_recent_film(:principal_name)";
                $stmtSearch = $conn->prepare($sqlSearch);
                $stmtSearch->bindParam(':principal_name', $searchPrincipal, PDO::PARAM_STR);
                $stmtSearch->execute();

                // Fetch the results
                $searchResults = $stmtSearch->fetchAll(PDO::FETCH_ASSOC);
                break;

            case 'top_genres':
                // Call the stored procedure to get top genres by principal
                $sqlSearchTopGenres = "CALL get_top_genres_by_principal(:principal_name, :num_genres)";
                $stmtSearchTopGenres = $conn->prepare($sqlSearchTopGenres);
                $stmtSearchTopGenres->bindParam(':principal_name', $searchPrincipal, PDO::PARAM_STR);
                $stmtSearchTopGenres->bindParam(':num_genres', $numGenres, PDO::PARAM_INT);
                $numGenres = 5;
                $stmtSearchTopGenres->execute();

                // Fetch the results
                $searchTopGenresResults = $stmtSearchTopGenres->fetchAll(PDO::FETCH_ASSOC);
                break;

            case 'highest_rated_title':
                // Call the stored procedure to get highest rated title by principal
                $sqlSearchHighestRatedTitle = "CALL get_highest_rated_title_by_principal(:principal_name)";
                $stmtSearchHighestRatedTitle = $conn->prepare($sqlSearchHighestRatedTitle);
                $stmtSearchHighestRatedTitle->bindParam(':principal_name', $searchPrincipal, PDO::PARAM_STR);
                $stmtSearchHighestRatedTitle->execute();

                // Fetch the results
                $searchHighestRatedTitleResults = $stmtSearchHighestRatedTitle->fetchAll(PDO::FETCH_ASSOC);
                break;

            default:
                // Handle any other search type if needed
                break;
        }
    }

    // Prepare and execute query to fetch all principals
    $stmtAll = $conn->prepare("SELECT n_const, primary_name FROM Name");
    $stmtAll->execute();
    $allPrincipals = $stmtAll->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
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
<body class="background">
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
        <!-- Search form for most recent film -->
        <form method="post" action="/softeng23-16/front-end/principals.php">
            <label for="search_principal">Principal Name:</label>
            <input type="text" id="search_principal" name="search_principal" required>
            <button type="submit" class="search-button" name="search_type" value="recent">Most Recent Title</button>
            <button type="submit" class="search-button" name="search_type" value="top_genres">Top Genres</button>
            <button type="submit" class="search-button" name="search_type" value="highest_rated_title">Highest Rated Title</button>
        </form>

        <!-- Search form for top rated principals -->
        <form method="post" action="/softeng23-16/front-end/principals.php">
            <label for="limit">#Top Rated Principals:</label>
            <input type="number" id="limit" name="limit" required min="1">
            <button type="submit" class="search-button">Search</button>
        </form>
    </div>

    <!-- Principals Content -->
    <div class="principals-container">
        <?php if (!empty($topRatedPrincipals)): ?>
            <h2><?= count($topRatedPrincipals); ?> Top Rated Principals</h2>
            <ul>
                <?php foreach ($topRatedPrincipals as $principal): ?>
                    <li><?= htmlspecialchars($principal['principal_name']); ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <?php if (!empty($searchResults)): ?>
            <h2>Most Recent Title for <?= htmlspecialchars($searchPrincipal); ?></h2>
            <ul>
                <?php foreach ($searchResults as $result): ?>
                    <li><?= htmlspecialchars($result['title']); ?> (<?= htmlspecialchars($result['start_year']); ?>)</li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <?php if (!empty($searchTopGenresResults)): ?>
            <h2>Top Genres for <?= htmlspecialchars($searchPrincipal); ?></h2>
            <ul>
                <?php foreach ($searchTopGenresResults as $result): ?>
                    <li><?= htmlspecialchars($result['genre']); ?> (<?= htmlspecialchars($result['max_rating']); ?>)</li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <?php if (!empty($searchHighestRatedTitleResults)): ?>
            <h2>Highest Rated Title for <?= htmlspecialchars($searchPrincipal); ?></h2>
            <ul>
                <?php foreach ($searchHighestRatedTitleResults as $result): ?>
                    <li><?= htmlspecialchars($result['Primary_title']); ?> (<?= htmlspecialchars($result['average_rating']); ?>)</li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <?php if (empty($topRatedPrincipals) && empty($searchResults) && empty($searchTopGenresResults) && empty($searchHighestRatedTitleResults)): ?>
            <?php foreach ($allPrincipals as $principal): ?>
                <div class="principal">
                    <a href="principal_details.php?id=<?= htmlspecialchars($principal['n_const']); ?>">
                        <?= htmlspecialchars($principal['primary_name']); ?>
                    </a>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <script src="app.js"></script>
</body>
</html>