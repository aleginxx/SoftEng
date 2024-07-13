<?php 
session_start();

// Include database connection file
require_once 'db.php'; // Assume 'db.php' connects to your database

// Initialize variables
$email = '';

// Fetch user details from the database
if ($conn) { // Check if the database connection is successful
    $username = $_SESSION['username'];
    $query = "SELECT email FROM user WHERE username = :username";
    
    // Prepare statement
    $stmt = $conn->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);

    // Execute the statement
    $stmt->execute();

    // Fetch the result
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $email = $result['email']; // Assign the email from the result
    } else {
        // Handle case where no user is found
        echo "No user found with that username.";
    }

    // No need to explicitly close the statement in PDO
} else {
    // Handle database connection error
    echo "Database connection error.";
}
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
        <link rel="stylesheet" href="styles.css">
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

    <div class="main">
        <div class="main__container">
            <div class="main__content">
                <h1>My Profile</h1>
                <p>Welcome, <?php echo $_SESSION['first_name']; // Display user's first name ?></p><br><br>
                <button class="main__btn"><a href="/softeng23-16/front-end/change_info.php">Change Information</a></button><br>
                <button class="main__btn"><a href="/softeng23-16/front-end/logout.php">Log Out</a></button>
                </div>
            <!-- Display user information -->
            <div class="user_details">
                <p><strong><u>First Name:</u></strong> <?php echo $_SESSION['first_name']; // Display user's first name ?></p>
                <p><strong><u>Last Name:</u></strong> <?php echo $_SESSION['last_name']; // Display user's last name ?></p>
                <p><strong><u>E-mail:</u></strong> <?php echo $email; ?></p>
            </div> 
            <div class="main__img--container">
                <img src="pic1.svg" alt="pic" id="main__img">
            </div>
        </div>
        
        <!-- Form to change password -->
        <!-- <div class="change-password">
            <h2></h2>
            <form action="update_password.php" method="post"> 
                <input type="password" name="current_password" placeholder="Current Password" required>
                <input type="password" name="new_password" placeholder="New Password" required>
                <input type="password" name="confirm_password" placeholder="Confirm New Password" required>
                <button type="submit">Update Password</button>
            </form>
        </div> -->

        <!-- Form to update personal information -->
        <!-- <div class="update-info">
            <h2></h2>
            <form action="update_info.php" method="post"> 
                <button type="submit">Update Information</button>
            </form>
        </div> -->
    </div>

    <script src="app.js"></script>
</body>
</html>
