function registerUser() {
  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!userId || !password) {
    message.textContent = "Please enter both ID and password.";
    return;
  }

  const existingUser = localStorage.getItem(userId);

  if (existingUser) {
    message.textContent = "This user already exists.";
    return;
  }

  const user = {
    userId,
    password
  };

  localStorage.setItem(userId, JSON.stringify(user));
  message.textContent = "Account created successfully. You can now log in.";
}

function loginUser() {
  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  const savedUser = localStorage.getItem(userId);

  if (!savedUser) {
    message.textContent = "User not found.";
    return;
  }

  const parsedUser = JSON.parse(savedUser);

  if (parsedUser.password !== password) {
    message.textContent = "Incorrect password.";
    return;
  }

  // Save who is currently logged in, then teleport to the dashboard!
  localStorage.setItem("loggedInUser", userId);
  window.location.href = "index.html";
}