<?php 
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
include "db-connection.php";

if (isset($_POST['username']) && isset($_POST['password'])) {

    function validate($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    $username = validate($_POST['username']);
    $password = validate($_POST['password']);

    if(empty($username)) {
        header("Location: credentials.php?error=Username is missing");
        exit();
    }else if(empty($password)) {
        header("Location: credentials.php?error=Password is missing");
        exit();
    }else {
        $sql = "SELECT * FROM user WHERE username='$username' AND password='$password'";
        $result = mysqli_query($conn, $sql);
        

        if(mysqli_num_rows($result) === 1) {
            $row = mysqli_fetch_assoc($result);
            $user_type = $row['role'];

            if($row['username'] === $username && $row['password'] === $password) {
                $_SESSION['username'] = $row['username'];
                $_SESSION['first_name'] = $row['first_name'];
                $_SESSION['last_name'] = $row['last_name'];
                header("Location: user.php");
                exit();
            }else {
                header("Location: credentials.php?error=Incorrect username or password");
                exit();
            }

        }else {
            header("Location: credentials.php?error=Incorrect username or password");
            exit();
        }
    }
}else {
    header("Location: credentials.php");
    exit();
}
