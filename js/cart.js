document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("cartItems");
  const emptyEl = document.querySelector(".cart-empty");
  const totalEl = document.getElementById("cartTotal");
  const clearBtn = document.getElementById("clearCartBtn");

  function readCart() {
    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      return Array.isArray(cart) ? cart : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart || []));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render() {
    const cart = readCart();

    if (emptyEl) emptyEl.style.display = cart.length === 0 ? "block" : "none";
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = "";
      if (totalEl) totalEl.textContent = "Total: 0 ETB";
      return;
    }

    let total = 0;
    container.innerHTML = cart
      .map((item) => {
        const id = escapeHtml(item.id);
        const name = escapeHtml(item.name || "Item");
        const qty = parseInt(item.qty || 1, 10) || 1;
        const price = parseFloat(item.price || 0) || 0;
        total += qty * price;

        let imgSrc = "";
        if (item.image) {
          imgSrc = `/MarketPlace/uploads/${escapeHtml(item.image)}`;
        }

        return `
          <div class="cart-item">
            ${imgSrc ? `<img src="${imgSrc}" alt="${name}" />` : ""}
            <div class="cart-item-info">
              <h4>${name}</h4>
              <p>Price: ${price.toLocaleString()} ETB</p>
              <p>Qty: ${qty}</p>
              <button class="remove-btn" data-id="${id}">Remove</button>
            </div>
          </div>
        `;
      })
      .join("");

    if (totalEl) totalEl.textContent = `Total: ${total.toLocaleString()} ETB`;

    container.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const removeId = this.getAttribute("data-id");
        const updated = readCart().filter((x) => String(x.id) !== String(removeId));
        writeCart(updated);
        render();
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      writeCart([]);
      render();
    });
  }

  render();
});
