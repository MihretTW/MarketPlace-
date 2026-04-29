document.addEventListener("DOMContentLoaded", function () {
  if (typeof checkAuth === "function") {
    checkAuth().then((auth) => {
      if (!auth.loggedin) {
        window.location.href = "signin.html";
      }
    });
  }
});

document
  .getElementById("postForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = "";

    const formData = new FormData(this); // Handles file + text fields

    try {
      const response = await fetch("/MarketPlace/php/add_item.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        messageDiv.innerHTML = `<p style="color: green;">✅ ${result.message}</p>`;

        // Clear form
        this.reset();

        // Redirect to homepage after 1.5 seconds
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        messageDiv.innerHTML = `<p style="color: red;">❌ ${result.message}</p>`;
      }
    } catch (error) {
      messageDiv.innerHTML = `<p style="color: red;">❌ Connection error. Make sure XAMPP is running.</p>`;
    }
  });