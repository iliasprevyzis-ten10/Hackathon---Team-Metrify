async function registerUser() {
  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!userId || !password) {
    message.textContent = "Please enter both ID and password.";
    return;
  }

  try {
    // Pointed to port 3000
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, password })
    });

    if (response.ok) {
      message.textContent = "Account created successfully. You can now log in.";
    } else {
      const errorData = await response.json();
      message.textContent = errorData.message || "Registration failed.";
    }
  } catch (error) {
    console.error("Registration error:", error);
    message.textContent = "Network error. Is the server running on port 3000?";
  }
}

async function loginUser() {
  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!userId || !password) {
    message.textContent = "Please enter both ID and password.";
    return;
  }

  try {
    // Pointed to port 3000
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, password })
    });

    if (response.ok) {
      const data = await response.json();
      
      // Store the session info
      localStorage.setItem("loggedInUser", userId); 
      
      // Redirect
      window.location.href = "index.html";
    } else {
      const errorData = await response.json();
      message.textContent = errorData.message || "Invalid credentials.";
    }
  } catch (error) {
    console.error("Login error:", error);
    message.textContent = "Network error. Could not connect to the server.";
  }
}