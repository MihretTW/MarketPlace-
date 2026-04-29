document.addEventListener("DOMContentLoaded", function () {
  if (typeof checkAuth === "function") {
    checkAuth().then((auth) => {
      if (!auth.loggedin) {
        window.location.href = "signin.html";
        return;
      }

      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : {};

      const username = auth.username || user.username || "User";
      const email = user.email || "";
      const phone = auth.phone || user.phone || "";
      const location = auth.location || user.location || "";
      const telegram = auth.telegram_username || user.telegram_username || "";

      const nameEl = document.getElementById("name");
      const phoneEl = document.getElementById("phone");
      const locationEl = document.getElementById("location");
      const telegramEl = document.getElementById("Telegram-user-name");
      const emailEl = document.getElementById("email");
      const passwordBtn = document.getElementById("password");

      if (nameEl) nameEl.textContent = `Full Name: ${username}`;
      if (phoneEl) phoneEl.textContent = `Phone number: ${phone}`;
      if (locationEl) locationEl.textContent = `Location: ${location}`;
      if (telegramEl) telegramEl.textContent = `Telegram user-name: ${telegram}`;
      if (emailEl) emailEl.textContent = `email: ${email}`;

      if (passwordBtn) {
        passwordBtn.addEventListener("click", async function () {
          const old_password = prompt("Enter your old password:");
          if (old_password === null) return;

          const new_password = prompt("Enter your new password (min 6 chars):");
          if (new_password === null) return;

          try {
            const response = await fetch("/MarketPlace/php/change_password.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ old_password, new_password }),
            });
            const result = await response.json();

            if (result.status === "success") {
              alert(result.message || "Password updated successfully");
            } else {
              alert(result.message || "Could not change password");
            }
          } catch (error) {
            alert("Connection error. Make sure XAMPP is running.");
          }
        });
      }
    });
  }
});