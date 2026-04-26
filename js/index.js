document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("itemsContainer");

  fetch("/MarketPlace/php/get_items.php")
    .then((response) => response.json())
    .then((items) => {
      if (!Array.isArray(items)) {
        const message = (items && items.message) || "Failed to load items";
        container.innerHTML = `<p style="color:red;text-align:center;padding:30px;">${message}</p>`;
        return;
      }

      displayItems(items);
    })
    .catch((error) => {
      console.error("Error:", error);
      container.innerHTML = `<p style="color:red;text-align:center;padding:30px;">Failed to load items</p>`;
    });
});

function displayItems(items) {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = `<p style="text-align:center;padding:40px;color:#8fd3f4;">No items yet.<br>Post some items!</p>`;
    return;
  }

  items.forEach((item) => {
    // Improved image path
    let imageSrc = "https://via.placeholder.com/300x200?text=No+Image";

    if (item.image && item.image !== "" && item.image !== null) {
      imageSrc = `/MarketPlace/uploads/${item.image}`;
    }

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src="${imageSrc}" 
                 alt="${item.name}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Failed';"
                 style="width:100%; height:200px; object-fit:cover; border-radius:8px 8px 0 0;">
            <h3>${item.name}</h3>
            <p><strong>Price:</strong> ${parseFloat(item.price).toLocaleString()} ETB</p>
            ${item.description ? `<p style="font-size:14px;color:#ccc;">${item.description.substring(0, 80)}...</p>` : ""}
            <a href="item.html?id=${item.id}" class="detail-btn">View Details</a>
        `;
    container.appendChild(card);
  });
}
