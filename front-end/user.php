<?php 

session_start();

if(isset($_SESSION['username'])) 

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport"
        content="width-device-width,
        initial-scale=1.0" /> 
        <title>NTUA-flix</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <!-- navigation bar -->
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
                        <a href="/softeng23-16/front-end/user.php" class="navbar__links"> Home </a>
                    </li>
                    <li class="navbar__item">
                        <a href="/books.php" class="navbar__links"> Movies </a>
                    </li>
                    <li class="navbar__item">
                        <a href="/schools.php" class="navbar__links"> Series </a>
                    </li>
                    <li class="navbar__btn">
                        <a href="/softeng23-16/front-end/profile.php" class="button"> My Profile </a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- main section -->
        <div class="main">
            <div class="main__container">
                <div class="main__content">
                    <h1>Hello, <?php echo $_SESSION['first_name']; ?></h1><br><br><br>
                    <h2>Welcome! </h2><br>
                    <button class="main__btn"><a href="/credentials.php">Log Out</a></button>
                </div>
                <div class="main__img--container">
                    <img src="pic2.svg" alt="pic" id="main__img">
                </div>
            </div>
        </div>
        </div>
        <script src="app.js"></script>
    </body>
</html>