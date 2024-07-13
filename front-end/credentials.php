<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport"
        content="width-device-width,
        initial-scale=1.0" /> 
        <title>ntua-flix / Login and Registration</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/style-credentials.css">
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
                </ul>
            </div>
        </nav>

        <!-- main section -->
        <div class="main">
            <div class="form__box">
                <div class="button__box">
                    <div id="btn"></div>
                    <button type="button" class="toggle__btn" onclick="login()"><b>Sign In</b></button>
                    <button type="button" class="toggle__btn" onclick="register()"><b>Sign Up</b></button>
                </div>
                <br>
               
                <form id="login" class="input__group" action="login" method="POST">
                    <p class="access__account"><b> Access your account: </b></p>
                    <input id="username" name="username" type="text" class="input__field" placeholder="username" required>
                    <input id="password" name="password" class="input__field" placeholder="password" required>
                    <input type="checkbox" class="check__box" id="showPasswordCheckbox" onchange="togglePasswordVisibility()">
                    <span id="showpassword">Show Password</span>
                    <input type="checkbox" class="check__box"><span>Remember me</span>
                    <button type="submit" class="submit__button"><b>Log In</b></button>
                </form>
                <form id="register" class="input__group" action="signup" method="POST">
                <p class="create__account"><b> Create an account: </b></p>
                    <input type="text" name="uname" class="input__field" placeholder="choose username" required>
                    <input id="password" name="pass" class="input__field" placeholder="set password" required>
                    <input id="confirmPassword" name="repass" class="input__field" placeholder="confirm password" oninput="validatePassword()" required><span id="passwordMismatch">Passwords do not match!</span>
                    <!-- <input type="checkbox" class="check__box" id="showPasswordCheckbox" onchange="togglePasswordVisibility()">
                    <span id="showpassword">Show Password</span> -->
                    <input type="text" name="fname" class="input__field" placeholder="first name" required>
                    <input type="text" name="lname" class="input__field" placeholder="last name" required>
                    <input type="text" name="age" class="input__field" placeholder="age" required>
                    <input type="text" name="email" class="input__field" placeholder="email" required>
                    <input type="checkbox" class="check__box" required>
                    <span>I agree to the terms and conditions</span>
                    <button type="submit" class="submit__button"><b>Register</b></button>
                </form>
            </div>
        </div>
        <script>
            var x = document.getElementById("login")
            var y = document.getElementById("register")
            var z = document.getElementById("btn")

            function register() {
                x.style.left = "-400px"
                y.style.left = "5px"
                z.style.left = "110px"
            }

            function login() {
                x.style.left = "0px"
                y.style.left = "450px"
                z.style.left = "0px"
            }
            
        </script>
        <script>
            // JavaScript code
            function validatePassword() {
                var password = document.getElementById("password").value;
                var confirmPassword = document.getElementById("confirmPassword").value;
                var mismatchMessage = document.getElementById("passwordMismatch");
    
                if (confirmPassword.length === password.length) {
                    if (password !== confirmPassword) {
                        mismatchMessage.style.display = "block";
                    } else {
                        mismatchMessage.style.display = "none";
                    }
                } else {
                    mismatchMessage.style.display = "block";
                }
            }
        </script>
        <script>
           function togglePasswordVisibility() {
            var passwordInput = document.getElementById("password");
            var confirmPasswordInput = document.getElementById("confirmPassword");
            var showPasswordCheckbox = document.getElementById("showPasswordCheckbox");

            if (showPasswordCheckbox.checked) {
                passwordInput.type = "text";
                confirmPasswordInput.type = "text";
            } else {
                passwordInput.type = "password";
                confirmPasswordInput.type = "password";
            }
        }
        </script> 
    </body>
</html>