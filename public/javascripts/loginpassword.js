const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
togglePassword.addEventListener("click", function () {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  togglePassword.classList.toggle("fa-eye-slash");
  togglePassword.classList.toggle("fa-eye");
});
