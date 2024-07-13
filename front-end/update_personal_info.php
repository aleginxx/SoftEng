<?php
session_start();
require_once 'db.php'; // Database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Fetch new personal information from form
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];
    $username = $_SESSION['username']; // Assuming username is stored in session

    // Prepare SQL query to update user information
    $stmt = $conn->prepare("UPDATE user SET first_name = :firstName, last_name = :lastName, email = :email WHERE username = :username");
    $stmt->bindParam(':firstName', $firstName);
    $stmt->bindParam(':lastName', $lastName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':username', $username);

    // Execute the update
    if ($stmt->execute()) {
        // Update was successful, update session variables
        $_SESSION['first_name'] = $firstName;
        $_SESSION['last_name'] = $lastName;
        $_SESSION['email'] = $email;

        // Redirect to profile.php
        header('Location: profile.php');
        exit();
    } else {
        // Handle error
        echo "An error occurred.";
    }
}
?>