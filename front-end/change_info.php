<?php
session_start();

// Include database connection file
require_once 'db.php';

// Initialize variables to hold current user information
$currentFirstName = '';
$currentLastName = '';
$currentEmail = '';

// Check if the user is logged in and the session variable for username is set
if (isset($_SESSION['username'])) {
    $username = $_SESSION['username']; // The current logged-in username

    // Replace 'your_table_name' with the actual name of your table that contains the user data
    $stmt = $conn->prepare("SELECT first_name, last_name, email FROM user WHERE username = :username");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    // Fetch the result
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Assign current information to variables
        $currentFirstName = $row['first_name'];
        $currentLastName = $row['last_name'];
        $currentEmail = $row['email'];
    } else {
        // Handle case where no user data is found
        echo "No user found with that username.";
    }
} else {
    // Redirect to login page or give an error message if the user is not logged in
    header("Location: login.php");
    exit;
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Assign variables from form data
    $currentPassword = $_POST['current_password'];
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_password'];
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];

    // You would need to validate the current password and check for the uniqueness of the new email and username here
    // ...

    // If validation passes, update the database
    // ...
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
            <!-- Personal Information Update Section -->
            <div class="main__content">
                <h1>Update <br>Personal Information</h1>
                <form method="post" action="update_personal_info.php"> <!-- Point to a PHP script for updating personal info -->
                    <p>
                        <label for="first_name"><strong>First Name:</strong></label>
                        <input type="text" name="first_name" value="<?php echo htmlspecialchars($currentFirstName); ?>" required>
                    </p>
                    <p>
                        <label for="last_name"><strong>Last Name:</strong></label>
                        <input type="text" name="last_name" value="<?php echo htmlspecialchars($currentLastName); ?>" required>
                    </p>
                    <p>
                        <label for="email"><strong>Email:</strong></label>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($currentEmail); ?>" required>
                    </p>
                    <button class="main__btn" type="submit"><a>Update Information</a></button>
                </form>
            </div>

            <!-- Password Update Section -->
            <div class="main__content">
                <h1>Change Password</h1>
                <form method="post" action="update_password.php"> <!-- action should point to a script that handles password update -->
                    <p>
                        <label for="current_password"><strong>Current Password:</strong></label>
                        <input type="password" name="current_password" required>
                    </p>
                    
                    <p>
                        <label for="new_password"><strong>New Password:</strong></label>
                        <input type="password" name="new_password" required>
                    </p>
                    
                    <p>
                        <label for="confirm_password"><strong>Confirm New Password:</strong></label>
                        <input type="password" name="confirm_password" required>
                    </p>
                    
                    <button class="main__btn" type="submit"> <a> Change Password </a> </button>
                </form>
            </div>
        </div>
    </div>

</body>
</html>
