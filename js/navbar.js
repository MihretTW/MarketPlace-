// js/navbar.js
document.addEventListener("DOMContentLoaded", function () {
  const placeholder = document.getElementById("navbar-placeholder");

  if (placeholder) {
    const inPagesFolder = window.location.pathname.includes("/pages/");
    const navbarHtmlPath = inPagesFolder ? "navbar.html" : "pages/navbar.html";
    const navbarCssHref = inPagesFolder ? "../css/navbar.css" : "css/navbar.css";
    const existingNavbarCss = document.querySelector(
      `link[rel="stylesheet"][href="${navbarCssHref}"]`,
    );
    if (!existingNavbarCss) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = navbarCssHref;
      document.head.appendChild(link);
    }

    fetch(navbarHtmlPath)
      .then((response) => response.text())
      .then((data) => {
        placeholder.innerHTML = data;

        const navbar = placeholder.querySelector("nav");
        if (navbar) {
          const links = navbar.querySelectorAll("a[href]");
          links.forEach((link) => {
            const href = link.getAttribute("href");
            if (!href) return;

            const isExternal = /^https?:\/\//i.test(href);
            const isAbsolute = href.startsWith("/");
            const isHash = href.startsWith("#");

            if (isExternal || isAbsolute || isHash) return;

            if (!inPagesFolder && !href.startsWith("pages/")) {
              link.setAttribute("href", `pages/${href}`);
            }
          });
        }

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
            window.location.href = inPagesFolder ? "index.html" : "pages/index.html";
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
