function passwordval(e) {
  //   e.preventDefault();
  var password = document.getElementById("password").value;
  if (!password || password.length < 8) {
    alert("Password is required and must be at least 8 characters long");
    return false;
  }
  return true;
}
