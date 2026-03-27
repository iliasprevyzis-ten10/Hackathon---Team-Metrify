// --- REGISTER FUNCTION ---
async function registerUser(event) {
  if (event) event.preventDefault(); // Prevents the page from refreshing

  // 1. Grab the values from the HTML inputs
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  // 2. Check if they are empty
  if (!email || !password) {
    message.textContent = "Please enter both an email and a password.";
    return;
  }

  try {
    // 3. Send the data to your backend server
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }) 
    });

    // 4. Handle the server's response
    if (response.ok) {
      message.textContent = "Account created successfully! You can now log in.";
      message.style.color = "green"; // Optional: make success message green
    } else {
      const errorData = await response.json();
      message.textContent = errorData.message || "Registration failed.";
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Registration error:", error);
    message.textContent = "Network error. Is your backend server running?";
    message.style.color = "red";
  }
}

// --- LOGIN FUNCTION ---
async function loginUser(event) {
  if (event) event.preventDefault(); 

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!email || !password) {
    message.textContent = "Please enter both an email and a password.";
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    });

    if (response.ok) {
      const data = await response.json();
      
      // Store the user ID so the rest of your app knows who is logged in
      localStorage.setItem("loggedInUser", data.userId); 
      
      // Redirect to the main dashboard!
      window.location.href = "index2.html"; 
    } else {
      const errorData = await response.json();
      message.textContent = errorData.message || "Invalid credentials.";
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Login error:", error);
    message.textContent = "Network error. Could not connect to the server.";
    message.style.color = "red";
  }
}