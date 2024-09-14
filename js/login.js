document.addEventListener("DOMContentLoaded", function () {
  checkUserStatusAndUpdateUI();

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", handleLogin);
  const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", handleRegister);
});