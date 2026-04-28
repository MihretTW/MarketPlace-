// js/navbar.js
document.addEventListener("DOMContentLoaded", function () {
  const placeholder = document.getElementById("navbar-placeholder");

  if (placeholder) {
    fetch("navbar.html")
      .then((response) => response.text())
      .then((data) => {
        placeholder.innerHTML = data;

        const signinLi = document.getElementById("nav-signin");
        const signupLi = document.getElementById("nav-signup");
        const logoutLi = document.getElementById("nav-logout");
        const logoutLink = document.getElementById("logout-link");

        if (logoutLink) {
          logoutLink.addEventListener("click", async function (e) {
            e.preventDefault();
            try {
              await fetch("/MarketPlace/php/logout.php");
            } catch (error) {
              // ignore
            }
            localStorage.removeItem("user");
            window.location.href = "index.html";
          });
        }

        checkAuth().then((auth) => {
          if (auth.loggedin) {
            if (signinLi) signinLi.style.display = "none";
            if (signupLi) signupLi.style.display = "none";
            if (logoutLi) logoutLi.style.display = "list-item";
          } else {
            if (signinLi) signinLi.style.display = "list-item";
            if (signupLi) signupLi.style.display = "list-item";
            if (logoutLi) logoutLi.style.display = "none";
          }
        });
      })
      .catch((error) => {
        console.error("Navbar load error:", error);
      });
  }
});
