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
      
      // Save the user ID to local storage
      localStorage.setItem("loggedInUser", data.userId); 
      
      // Look at the isAdmin value we just sent from the server
      if (Number(data.isAdmin) === 1) {
          window.location.href = "admin.html"; // Admins go here
      } else {
          window.location.href = "index2.html"; // Regular users (0) go here
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    message.textContent = "Network error. Could not connect to the server.";
    message.style.color = "red";
  }
}