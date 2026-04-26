document.addEventListener("DOMContentLoaded", function () {
  const titleEl = document.getElementById("itemTitle");
  const priceEl = document.getElementById("itemPrice");
  const descEl = document.getElementById("itemDescription");
  const imageEl = document.querySelector(".item-image");
  const sellerEl = document.getElementById("sellerName");
  const sellerTelegramEl = document.getElementById("sellerTelegram");
  const contactSellerBtn = document.getElementById("contactSellerBtn");
  const commentForm = document.getElementById("commentForm");
  const commentText = document.getElementById("commentText");
  const commentsList = document.getElementById("commentsList");
  const addToCartBtn = document.getElementById("addToCartBtn");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    if (titleEl) titleEl.textContent = "Item not found";
    if (descEl) descEl.textContent = "Missing item id.";
    return;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderComments(comments) {
    if (!commentsList) return;

    const list = Array.isArray(comments) ? comments : [];
    if (list.length === 0) {
      commentsList.innerHTML = "<p>No comments yet.</p>";
      return;
    }

    commentsList.innerHTML = list
      .map((c) => {
        const name = escapeHtml(c.username || "User");
        const text = escapeHtml(c.comment_text || "");
        return `<div class="review"><h4>${name}</h4><p>${text}</p></div>`;
      })
      .join("");
  }

  async function loadComments() {
    if (!commentsList) return;
    try {
      const res = await fetch(
        `/MarketPlace/php/get_comments.php?item_id=${encodeURIComponent(id)}`,
      );
      const data = await res.json();
      if (data.status === "success") {
        renderComments(data.comments);
      } else {
        commentsList.innerHTML = `<p>${escapeHtml(data.message || "Could not load comments")}</p>`;
      }
    } catch (e) {
      commentsList.innerHTML = "<p>Could not load comments.</p>";
    }
  }

  loadComments();

  if (commentForm) {
    commentForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (typeof checkAuth !== "function") {
        alert("Please sign in first.");
        window.location.href = "signin.html";
        return;
      }

      const auth = await checkAuth();
      if (!auth.loggedin) {
        alert("Please sign in to comment.");
        window.location.href = "signin.html";
        return;
      }

      const text = (commentText && commentText.value ? commentText.value : "").trim();
      if (!text) return;

      try {
        const res = await fetch("/MarketPlace/php/add_comment.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_id: parseInt(id, 10), comment_text: text }),
        });
        const data = await res.json();

        if (data.status === "success") {
          if (commentText) commentText.value = "";
          await loadComments();
        } else {
          alert(data.message || "Could not post comment");
        }
      } catch (err) {
        alert("Connection error. Make sure XAMPP is running.");
      }
    });
  }

  fetch(`/MarketPlace/php/get_item.php?id=${encodeURIComponent(id)}`)
    .then((response) => response.json())
    .then((item) => {
      if (!item || item.status === "error") {
        if (titleEl) titleEl.textContent = "Item not found";
        if (descEl) descEl.textContent = (item && item.message) || "Could not load item.";
        return;
      }

      if (titleEl) titleEl.textContent = item.name || "Item";

      if (sellerEl) sellerEl.textContent = item.username || "Seller";

      const telegramUsername = (item.telegram_username || "").trim();
      if (sellerTelegramEl) {
        if (telegramUsername) {
          sellerTelegramEl.style.display = "block";
          sellerTelegramEl.textContent = `Telegram: @${telegramUsername.replace(/^@/, "")}`;
        } else {
          sellerTelegramEl.style.display = "none";
          sellerTelegramEl.textContent = "";
        }
      }

      if (contactSellerBtn) {
        contactSellerBtn.onclick = function () {
          if (!telegramUsername) {
            alert("Seller did not add Telegram username.");
            return;
          }
          const clean = telegramUsername.replace(/^@/, "");
          window.open(`https://t.me/${encodeURIComponent(clean)}`, "_blank");
        };
      }

      if (priceEl) {
        const price = parseFloat(item.price || 0);
        priceEl.textContent = `Price: ${price.toLocaleString()} ETB`;
      }

      if (descEl) descEl.textContent = item.description || "";

      if (imageEl) {
        let src = "https://via.placeholder.com/600x400?text=No+Image";
        if (item.image && item.image !== "" && item.image !== null) {
          src = `/MarketPlace/uploads/${item.image}`;
        }
        imageEl.src = src;
        imageEl.onerror = function () {
          this.onerror = null;
          this.src = "https://via.placeholder.com/600x400?text=Image+Failed";
        };
      }

      if (addToCartBtn) {
        addToCartBtn.onclick = function () {
          let cart = [];
          try {
            const raw = localStorage.getItem("cart");
            cart = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(cart)) cart = [];
          } catch (e) {
            cart = [];
          }

          const cartItem = {
            id: item.id,
            name: item.name || "Item",
            price: parseFloat(item.price || 0),
            image: item.image || "",
            qty: 1,
          };

          const existingIndex = cart.findIndex((x) => String(x.id) === String(cartItem.id));
          if (existingIndex >= 0) {
            cart[existingIndex].qty = (parseInt(cart[existingIndex].qty || 1, 10) || 1) + 1;
          } else {
            cart.push(cartItem);
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Added to cart!");
        };
      }
    })
    .catch(() => {
      if (titleEl) titleEl.textContent = "Failed to load";
      if (descEl) descEl.textContent = "Connection error. Make sure XAMPP is running.";
    });
});
