/* =============================================
   HRz PITSTOP – Main Application Entry & Router Module
   ============================================= */

window.HRz = window.HRz || {};

class App {
  static async init() {
    console.log("Initializing HRz Pitstop application...");

    await window.HRz.DB.init();

    window.HRz.Garage.init((activeBike) => this.onBikeChanged(activeBike));
    window.HRz.Cart.init();
    window.HRz.Search.init();

    window.addEventListener("hashchange", () => this.handleRoute());
    this.bindNavigation();

    this.handleRoute();
  }

  static onBikeChanged(activeBike) {
    const currentHash = window.location.hash.replace("#", "").split("?")[0];
    if (currentHash === "catalog" || currentHash === "" || currentHash === "home") {
      this.handleRoute();
    }
  }

  static bindNavigation() {
    document.querySelectorAll(".primary-nav .nav-pill").forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        if (view) {
          window.location.hash = view;
        }
      };
    });

    document.querySelectorAll("[data-view-target]").forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const target = btn.dataset.viewTarget;
        const filter = btn.dataset.filter;
        if (filter) {
          window.location.hash = `catalog?category=${encodeURIComponent(filter)}`;
        } else if (target) {
          window.location.hash = target;
        }
      };
    });
  }

  static handleRoute() {
    const rawHash = window.location.hash.replace("#", "") || "home";
    const [route, queryString] = rawHash.split("?");
    const params = new URLSearchParams(queryString || "");

    document.querySelectorAll(".primary-nav .nav-pill").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.view === route);
    });

    document.querySelectorAll(".main-grid .view").forEach(v => {
      v.classList.remove("active");
    });

    const activeViewEl = document.getElementById(route) || document.getElementById("home");
    if (activeViewEl) {
      activeViewEl.classList.add("active");
      window.scrollTo(0, 0);
    }

    if (window.HRz.SEO) {
      window.HRz.SEO.updateSEOForView(route, {
        product: route === "product" ? window.HRz.DB.getProductById(params.get("id")) : null
      });
    }

    switch (route) {
      case "home":
        this.renderHomeView(activeViewEl);
        break;
      case "catalog":
        window.HRz.Catalog.render(activeViewEl, {
          category: params.get("category") || "All",
          search: params.get("search") || ""
        });
        break;
      case "product":
        window.HRz.Product.render(activeViewEl, params.get("id"));
        break;
      case "garage":
        window.HRz.Garage.renderGarageView(activeViewEl);
        break;
      case "checkout":
        window.HRz.Checkout.render(activeViewEl);
        break;
      case "admin":
        window.HRz.Admin.render(activeViewEl);
        break;
      case "wishlist":
        this.renderWishlistView(activeViewEl);
        break;
      case "tracking":
        this.renderTrackingView(activeViewEl);
        break;
      case "reviews":
        this.renderReviewsView(activeViewEl);
        break;
      case "help":
        this.renderHelpView(activeViewEl);
        break;
      default:
        this.renderHomeView(activeViewEl);
        break;
    }
  }

  static renderHomeView(container) {
    const activeBike = window.HRz.Storage.getActiveBike();
    const hero = window.HRz.Storage.getHeroBanner();
    const db = window.HRz.DB;
    const featuredProducts = db.getProductsForBike(activeBike).slice(0, 4);
    const bundles = db.getBundles();
    const utils = window.HRz.Utils;
    const catalog = window.HRz.Catalog;

    container.innerHTML = `
      <!-- Customizable Hero Promo & Offer Banner -->
      <section class="rider-hero" style="background: linear-gradient(135deg, rgba(24, 27, 38, 0.85), rgba(10, 11, 14, 0.92)), url('${hero.bgImage}') center/cover no-repeat;">
        <div class="hero-content-box">
          <span class="hero-badge">${hero.badge}</span>
          <h1 class="hero-headline">${hero.title}</h1>
          <p class="hero-subhead">${hero.subtitle}</p>
          
          <div class="hero-bike-action-card">
            <div class="active-bike-summary">
              <span class="bike-icon">🏍️</span>
              <div>
                <small>Currently Shopping For:</small>
                <strong>${activeBike ? activeBike.brand + " " + activeBike.model + " (" + activeBike.variant + ")" : "No Bike Selected"}</strong>
              </div>
            </div>
            <button class="accent-button hero-select-bike-btn" id="heroSelectBikeBtn">
              ${activeBike ? "Change Motorcycle" : "Select Your Motorcycle"}
            </button>
          </div>
        </div>
      </section>

      <section class="home-categories-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Shop By Category</p>
            <h2>Gear & Protection Categories</h2>
          </div>
        </div>
        <div class="category-cards-grid">
          <div class="cat-card" onclick="window.location.hash='catalog?category=Protection'">
            <img src="images/category_protection.png" alt="Protection" loading="lazy" />
            <div class="cat-overlay"><h3>Crash Guards & Sliders</h3><span>Explore Parts ▶</span></div>
          </div>
          <div class="cat-card" onclick="window.location.hash='catalog?category=Helmets'">
            <img src="images/category_helmets.png" alt="Helmets" loading="lazy" />
            <div class="cat-overlay"><h3>Helmets & Intercoms</h3><span>Explore Gear ▶</span></div>
          </div>
          <div class="cat-card" onclick="window.location.hash='catalog?category=Lights'">
            <img src="images/category_lights.png" alt="Lights" loading="lazy" />
            <div class="cat-overlay"><h3>LED Fog Lights</h3><span>Explore Lights ▶</span></div>
          </div>
          <div class="cat-card" onclick="window.location.hash='catalog?category=Luggage'">
            <img src="images/category_luggage.png" alt="Luggage" loading="lazy" />
            <div class="cat-overlay"><h3>Waterproof Saddlebags</h3><span>Explore Luggage ▶</span></div>
          </div>
        </div>
      </section>

      <section class="home-products-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Handpicked For Your Bike</p>
            <h2>Top Recommended Upgrades</h2>
          </div>
          <button class="text-link-btn" onclick="window.location.hash='catalog'">View Full Catalog (${db.getProducts().length} items) ▶</button>
        </div>

        <div class="product-grid">
          ${featuredProducts.map(p => catalog.renderProductCard(p, activeBike, window.HRz.Storage.getWishlist())).join("")}
        </div>
      </section>

      <section class="home-bundles-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Complete Riding Packages</p>
            <h2>Curated Rider Bundles</h2>
          </div>
        </div>

        <div class="bundles-grid">
          ${bundles.map(b => `
            <div class="bundle-card">
              <span class="bundle-badge">${b.badge}</span>
              <h3>${b.name}</h3>
              <p class="bundle-desc">${b.description}</p>
              <div class="bundle-price-row">
                <span class="bundle-price">${utils.formatCurrency(b.price)}</span>
                <span class="bundle-orig-price">${utils.formatCurrency(b.originalPrice)}</span>
                <span class="bundle-save-tag">Save ${b.discountPercent}%</span>
              </div>
              <button class="accent-button add-bundle-btn" data-id="${b.id}">
                Add Complete Bundle to Bag
              </button>
            </div>
          `).join("")}
        </div>
      </section>
    `;

    const selectBtn = container.querySelector("#heroSelectBikeBtn");
    if (selectBtn) {
      selectBtn.onclick = () => window.HRz.Garage.openBikeModal();
    }

    catalog.bindCardEvents(container);

    container.querySelectorAll(".add-bundle-btn").forEach(btn => {
      btn.onclick = () => {
        const bundle = bundles.find(b => b.id === btn.dataset.id);
        if (bundle) {
          bundle.items.forEach(itemId => {
            const item = db.getProductById(itemId);
            if (item) window.dispatchEvent(new CustomEvent("hrz:add-to-cart", { detail: { product: item } }));
          });
          utils.showToast(`Added ${bundle.name} to bag!`, "success");
        }
      };
    });
  }

  static renderWishlistView(container) {
    const wishlistIds = window.HRz.Storage.getWishlist();
    const activeBike = window.HRz.Storage.getActiveBike();
    const products = window.HRz.DB.getProducts().filter(p => wishlistIds.includes(p.id));
    const catalog = window.HRz.Catalog;

    container.innerHTML = `
      <div class="breadcrumb-trail">
        <a href="#home">Home</a> / <span class="current">My Wishlist</span>
      </div>

      <div class="view-header">
        <div>
          <p class="eyebrow">Saved Items</p>
          <h2>My Wishlist (${products.length})</h2>
        </div>
      </div>

      ${products.length === 0 ? `
        <div class="empty-state-card">
          <div class="empty-icon">❤️</div>
          <h3>Your Wishlist is Empty</h3>
          <p>Tap the heart icon on any product to save it to your wishlist for later.</p>
          <button class="accent-button" onclick="window.location.hash='catalog'">Explore Products</button>
        </div>
      ` : `
        <div class="product-grid">
          ${products.map(p => catalog.renderProductCard(p, activeBike, wishlistIds)).join("")}
        </div>
      `}
    `;

    catalog.bindCardEvents(container);
  }

  static renderTrackingView(container) {
    const orders = window.HRz.DB.getOrders();
    const utils = window.HRz.Utils;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <p class="eyebrow">Order History & Track Waybill</p>
          <h2>My Orders</h2>
        </div>
      </div>

      ${orders.length === 0 ? `
        <div class="empty-state-card">
          <div class="empty-icon">📦</div>
          <h3>No Orders Found</h3>
          <p>When you place an order, your tracking updates and fitment records will appear here.</p>
        </div>
      ` : `
        <div class="orders-history-list">
          ${orders.map(o => `
            <div class="order-card">
              <div class="order-card-header">
                <div>
                  <strong>Order ID: ${o.id}</strong>
                  <small>Placed on ${o.date}</small>
                </div>
                <span class="order-status-badge">${o.status}</span>
              </div>
              <div class="order-bike-tag">
                <span>🏍️</span> Bike: <strong>${o.bike}</strong>
              </div>
              <div class="order-items-preview">
                ${o.items.map(i => `<p>• ${i.name} (x${i.quantity}) — ${utils.formatCurrency(i.price * i.quantity)}</p>`).join("")}
              </div>
              <div class="order-card-footer">
                <span>Tracking Number: <code>${o.trackingId}</code></span>
                <strong>Total: ${utils.formatCurrency(o.total)}</strong>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    `;
  }

  static renderReviewsView(container) {
    const reviews = window.HRz.DB.getReviews().filter(r => r.status === "published");
    const utils = window.HRz.Utils;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <p class="eyebrow">Rider Community Feedback</p>
          <h2>Verified Rider Reviews</h2>
        </div>
      </div>

      <div class="reviews-list">
        ${reviews.map(r => `
          <div class="review-card">
            <div class="review-header">
              <span class="reviewer-name">${r.reviewerName}</span>
              <span class="review-bike-tag">Verified ${r.bikeName}</span>
              <span class="review-date">${r.date}</span>
            </div>
            <div class="review-rating">${utils.renderStarRating(r.rating)}</div>
            <h4 class="review-title">${r.title}</h4>
            <p class="review-comment">${r.comment}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  static renderHelpView(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <p class="eyebrow">Help & Support Center</p>
          <h2>Frequently Asked Questions</h2>
        </div>
      </div>

      <div class="faq-accordion">
        <div class="faq-card">
          <h3>How does the 100% Fitment Guarantee work?</h3>
          <p>When you select your bike from our dropdown (Make, Model, Year, Variant), our catalog filters only items engineered for that model. If an item marked as compatible fails to fit, we issue a free return waybill and refund 100% of your money.</p>
        </div>
        <div class="faq-card">
          <h3>What are the shipping charges and timeline?</h3>
          <p>Orders above ₹2,999 get FREE Express Shipping across India. Orders below ₹2,999 have a flat ₹199 delivery fee. Orders are dispatched within 24 hours.</p>
        </div>
        <div class="faq-card">
          <h3>How do I report a part that didn't fit?</h3>
          <p>Go to the product page or your account order history and click "Didn't Fit My Bike?". Fill out the brief report form and our team will issue an immediate return label.</p>
        </div>
      </div>
    `;
  }
}

window.HRz.App = App;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.init());
} else {
  App.init();
}
