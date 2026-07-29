/* =============================================
   HRz PITSTOP – Product Catalog & Filtering Module
   ============================================= */

window.HRz = window.HRz || {};

class CatalogView {
  static activeCategory = "All";
  static searchQuery = "";
  static sortBy = "featured";

  static render(container, options = {}) {
    if (options.category) this.activeCategory = options.category;
    if (options.search) this.searchQuery = options.search;

    const activeBike = window.HRz.Storage.getActiveBike();
    const wishlist = window.HRz.Storage.getWishlist();

    let products = window.HRz.DB.getProductsForBike(activeBike);

    if (this.activeCategory !== "All") {
      products = products.filter(p => p.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (this.sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    const categories = ["All", "Protection", "Helmets", "Lights", "Luggage", "Touring"];

    container.innerHTML = `
      <div class="catalog-header-bar">
        <div>
          <p class="eyebrow">Guaranteed Motorcycle Parts</p>
          <h2>Product Catalog</h2>
          ${activeBike ? `<p class="active-bike-filter-note">Showing parts compatible with <strong>${activeBike.brand} ${activeBike.model} (${activeBike.variant})</strong></p>` : ""}
        </div>

        <div class="catalog-controls">
          <div class="sort-wrapper">
            <label for="catalogSort">Sort By:</label>
            <select id="catalogSort">
              <option value="featured" ${this.sortBy === "featured" ? "selected" : ""}>Featured</option>
              <option value="price-low" ${this.sortBy === "price-low" ? "selected" : ""}>Price: Low to High</option>
              <option value="price-high" ${this.sortBy === "price-high" ? "selected" : ""}>Price: High to Low</option>
              <option value="rating" ${this.sortBy === "rating" ? "selected" : ""}>Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div class="category-filter-pills">
        ${categories.map(cat => `
          <button class="filter-pill ${this.activeCategory === cat ? "active" : ""}" data-category="${cat}">
            ${cat}
          </button>
        `).join("")}
      </div>

      ${products.length === 0 ? `
        <div class="empty-state-card">
          <div class="empty-icon">🔍</div>
          <h3>No Compatible Parts Found</h3>
          <p>We couldn't find any products in "${this.activeCategory}" matching your criteria for ${activeBike ? activeBike.brand + " " + activeBike.model : "this filter"}.</p>
          <button class="secondary-button" id="resetCatalogFiltersBtn">Reset All Filters</button>
        </div>
      ` : `
        <div class="product-grid">
          ${products.map(p => this.renderProductCard(p, activeBike, wishlist)).join("")}
        </div>
      `}
    `;

    const sortSelect = container.querySelector("#catalogSort");
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        this.sortBy = e.target.value;
        this.render(container);
      };
    }

    container.querySelectorAll(".filter-pill").forEach(pill => {
      pill.onclick = () => {
        this.activeCategory = pill.dataset.category;
        this.render(container);
      };
    });

    const resetBtn = container.querySelector("#resetCatalogFiltersBtn");
    if (resetBtn) {
      resetBtn.onclick = () => {
        this.activeCategory = "All";
        this.searchQuery = "";
        this.render(container);
      };
    }

    this.bindCardEvents(container);
  }

  static renderProductCard(p, activeBike, wishlist) {
    const isWishlisted = wishlist ? wishlist.includes(p.id) : false;
    const fitment = window.HRz.DB.checkFitment(p.id, activeBike);
    const utils = window.HRz.Utils;
    
    return `
      <div class="product-card" data-id="${p.id}" style="cursor:pointer;">
        <div class="product-card-media">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
          <button class="wishlist-toggle-btn ${isWishlisted ? "active" : ""}" data-id="${p.id}" aria-label="Toggle wishlist">
            ${isWishlisted ? "❤️" : "🤍"}
          </button>
          <img src="${p.image}" alt="${p.name}" loading="lazy" width="300" height="220" onerror="this.src='images/helmet_product.png'" />
          
          ${fitment ? `
            <div class="fitment-confidence-tag verified">
              <span class="fit-icon">✓</span> Fits ${activeBike.model} (${fitment.fitType})
            </div>
          ` : `
            <div class="fitment-confidence-tag universal">
              Universal Fit
            </div>
          `}
        </div>

        <div class="product-card-content">
          <div class="card-category-strip">${p.category} · SKU: ${p.sku}</div>
          <h3 class="product-title">${p.name}</h3>
          
          <div class="card-social-proof">
            ${utils.renderStarRating(p.rating)}
            <span class="riders-installed-count">Installed by <strong>${p.ridersInstalled || 120}+</strong> Riders</span>
          </div>

          <div class="price-action-row">
            <div class="price-lockup">
              <span class="current-price">${utils.formatCurrency(p.price)}</span>
              ${p.originalPrice ? `<span class="original-price">${utils.formatCurrency(p.originalPrice)}</span>` : ""}
            </div>

            <button class="accent-button add-to-cart-btn" data-id="${p.id}">
              + Bag
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static bindCardEvents(container) {
    container.querySelectorAll(".product-card").forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest(".wishlist-toggle-btn") || e.target.closest(".add-to-cart-btn")) {
          return; // Ignore card click if button was clicked
        }
        const id = card.dataset.id;
        if (id) {
          window.location.hash = `product?id=${encodeURIComponent(id)}`;
        }
      };
    });

    container.querySelectorAll(".wishlist-toggle-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = btn.dataset.id;
        const isAdded = window.HRz.Storage.toggleWishlist(id);
        btn.classList.toggle("active", isAdded);
        btn.innerHTML = isAdded ? "❤️" : "🤍";
        window.HRz.Utils.showToast(isAdded ? "Added to Wishlist" : "Removed from Wishlist", "info");
        
        const countBadge = document.getElementById("wishlistCount");
        if (countBadge) countBadge.textContent = window.HRz.Storage.getWishlist().length;
      };
    });

    container.querySelectorAll(".add-to-cart-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = btn.dataset.id;
        const prod = window.HRz.DB.getProductById(id);
        if (prod) {
          window.dispatchEvent(new CustomEvent("hrz:add-to-cart", { detail: { product: prod } }));
        }
      };
    });
  }
}

window.HRz.Catalog = CatalogView;
