// Signin function - Updated
async function handleSignin(email, password) {
  const result = await apiCall("signin", { email, password });

  if (result.status === "success") {
    // Save user to localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: result.username || result.user, // support both
        email: email,
        phone: result.phone || "",
        location: result.location || "",
        telegram_username: result.telegram_username || "",
      }),
    );

    const username = result.username || result.user || "User";
    alert("✅ Welcome, " + username + "!");
    window.location.href = "index.html";
  } else {
    alert("❌ " + (result.message || "Login failed"));
  }
}

async function apiCall(endpoint, payload) {
  try {
    const response = await fetch(`/MarketPlace/php/${endpoint}.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload || {}),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      status: "error",
      message: "Connection error. Make sure XAMPP is running.",
    };
  }
}

async function handleSignup(
  username,
  email,
  password,
  phone,
  location,
  telegram_username,
) {
  const result = await apiCall("signup", {
    username,
    email,
    password,
    phone,
    location,
    telegram_username,
  });

  if (result.status === "success") {
    alert("✅ " + (result.message || "Account created successfully"));
    window.location.href = "signin.html";
  } else {
    alert("❌ " + (result.message || "Signup failed"));
  }
}

// Improved checkAuth that also verifies with server
async function checkAuth() {
  // First check localStorage (fast)
  const savedUser = localStorage.getItem("user");
  if (!savedUser) {
    return { loggedin: false };
  }

  // Also verify with server (more reliable)
  try {
    const response = await fetch("/MarketPlace/php/check_auth.php");
    const data = await response.json();

    if (data.loggedin) {
      return {
        loggedin: true,
        user_id: data.user_id,
        username: data.username,
        phone: data.phone || "",
        location: data.location || "",
        telegram_username: data.telegram_username || "",
      };
    } else {
      localStorage.removeItem("user"); // Clean up invalid session
      return { loggedin: false };
    }
  } catch (error) {
    // If server check fails, fall back to localStorage
    const user = JSON.parse(savedUser);
    return {
      loggedin: true,
      username: user.username,
      phone: user.phone || "",
      location: user.location || "",
      telegram_username: user.telegram_username || "",
    };
  }
}
