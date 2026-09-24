/* =============================================
   HRz PITSTOP – Product Catalog & Filtering Module
   Adapted for editorial design
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
    const escapeHTML = window.HRz.Utils.escapeHTML;

    let products = window.HRz.DB.getProductsForBike(activeBike);

    if (this.searchQuery) {
      // Search across ALL products, not just bike-specific
      products = window.HRz.DB.products;
      const bikeProductIds = new Set(window.HRz.DB.getProductsForBike(activeBike).map(p => p.id));
      
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      ).sort((a, b) => {
        const aFit = bikeProductIds.has(a.id) ? 1 : 0;
        const bFit = bikeProductIds.has(b.id) ? 1 : 0;
        return bFit - aFit; // Boost products that fit the bike
      });
    }

    if (this.activeCategory !== "All") {
      products = products.filter(p => p.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    if (this.sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    const categories = ["All", ...window.HRz.DB.getCategories()];

    container.innerHTML = `
      <div class="breadcrumb-trail">
        <a href="#home">Home</a> / <span class="current">Shop All</span>
      </div>

      <div class="view-header">
        <div>
          <p class="eyebrow red">Guaranteed Motorcycle Parts</p>
          <h2>PRODUCT <em>CATALOG</em></h2>
          ${activeBike ? `<p class="active-bike-filter-note" style="margin-top:8px;">Showing parts compatible with <strong>${escapeHTML(activeBike.brand)} ${escapeHTML(activeBike.model)} (${escapeHTML(activeBike.variant)})</strong></p>` : ""}
        </div>
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
          <p>We couldn't find any products in "${escapeHTML(this.activeCategory)}" matching your criteria for ${activeBike ? escapeHTML(activeBike.brand) + " " + escapeHTML(activeBike.model) : "this filter"}.</p>
          <button class="accent-button" id="resetCatalogFiltersBtn">Reset All Filters</button>
        </div>
      ` : `
        <div class="product-grid inner-section" id="catalogProductGrid">
          ${this.renderSkeletons(Math.min(products.length, 8))}
        </div>
      `}
    `;

    // Bind events first (pills, sort, reset)
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

    // Lazy-load real cards after a brief shimmer delay
    const grid = container.querySelector("#catalogProductGrid");
    if (grid && products.length > 0) {
      setTimeout(() => {
        grid.innerHTML = products.map(p => this.renderProductCard(p, activeBike, wishlist)).join("");
        this.bindCardEvents(container);
      }, 350);
    }

    return; // Skip the old bindCardEvents call below
  }

  static renderSkeletons(count = 6) {
    return Array.from({ length: count }, () => `
      <div class="product-card-skeleton">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-line short"></div>
          <div class="skeleton skeleton-line title"></div>
          <div class="skeleton skeleton-line long"></div>
          <div class="skeleton skeleton-line price"></div>
        </div>
      </div>
    `).join("");
  }

  static renderProductCard(p, activeBike, wishlist) {
    const isWishlisted = wishlist ? wishlist.includes(p.id) : false;
    const fitment = window.HRz.DB.checkFitment(p.id, activeBike);
    const utils = window.HRz.Utils;
    const escapeHTML = utils.escapeHTML;
    
    return `
      <div class="product-card reveal" data-id="${escapeHTML(p.id)}" style="cursor:pointer;">
        <div class="product-card-media">
          ${p.badge ? `<span class="product-badge">${escapeHTML(p.badge)}</span>` : ""}
          <button class="wishlist-toggle-btn ${isWishlisted ? "active" : ""}" data-id="${escapeHTML(p.id)}" aria-label="Toggle wishlist">
            ${isWishlisted ? "❤️" : "🤍"}
          </button>
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.src='images/helmet_product.png'" />
        </div>
        <div class="product-card-content">
          <div class="card-category-strip">${escapeHTML(p.category)}</div>
          <h3 class="product-title">${escapeHTML(p.name)}</h3>
          <div class="price-action-row">
            <div class="price-lockup">
              <span class="current-price">${utils.formatCurrency(p.price)}</span>
              ${p.originalPrice ? `<span class="original-price">${utils.formatCurrency(p.originalPrice)}</span>` : ""}
            </div>
            <button class="accent-button add-to-cart-btn" data-id="${escapeHTML(p.id)}" ${!p.inStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              ${p.inStock ? '+ Bag' : 'Out of Stock'}
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
          return;
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
