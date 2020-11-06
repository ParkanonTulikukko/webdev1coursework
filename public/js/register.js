window.onload = function() {

    const registerButton = document.getElementById('btnRegister');
    registerButton.addEventListener("click", function (e) {
      (async () => {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const data = {
          '_id': undefined,
          'name': name,
          'email': email,
          'password': password,
          'role': undefined
        }
        await postOrPutJSON("/api/register", "POST", data);
      })();
      e.preventDefault();
    });

    }

/**
 * TODO: 8.3 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */
