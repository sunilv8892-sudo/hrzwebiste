/* =============================================
   HRz PITSTOP – Main Application Entry & Router Module
   Adapted for editorial "Rogue Ride" design
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
    this.bindGlobalUI();

    this.handleRoute();
  }

  static onBikeChanged(activeBike) {
    const currentHash = window.location.hash.replace("#", "").split("?")[0];
    if (currentHash === "catalog" || currentHash === "" || currentHash === "home") {
      this.handleRoute();
    }
  }

  static bindNavigation() {
    // Main nav links
    document.querySelectorAll(".main-nav .nav-link").forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) window.location.hash = view;
      };
    });

    // Footer links and other data-view-target links
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

    // Wishlist nav button
    const wishlistBtn = document.getElementById("wishlistNavBtn");
    if (wishlistBtn) {
      wishlistBtn.onclick = () => { window.location.hash = "wishlist"; };
    }
  }

  static bindGlobalUI() {
    const overlay = document.getElementById("overlay");
    const searchBtn = document.getElementById("searchBtn");
    const closeSearchBtn = document.getElementById("closeSearchBtn");
    const searchPanel = document.getElementById("searchPanel");
    const mobileSearch = document.getElementById("mobileSearch");
    const mobileCart = document.getElementById("mobileCart");

    // Search panel
    if (searchBtn) searchBtn.onclick = () => this.openPanel(searchPanel);
    if (closeSearchBtn) closeSearchBtn.onclick = () => this.closeAllPanels();
    if (mobileSearch) mobileSearch.onclick = () => this.openPanel(searchPanel);
    if (mobileCart) mobileCart.onclick = () => document.getElementById("openCartBtn")?.click();

    // Overlay closes everything
    if (overlay) overlay.onclick = () => this.closeAllPanels();

    // Sync mobile cart count
    this.syncMobileCartCount();
  }

  static openPanel(panel) {
    if (!panel) return;
    panel.classList.add("open");
    document.getElementById("overlay")?.classList.add("open");
    const input = panel.querySelector("input");
    if (input) setTimeout(() => input.focus(), 100);
  }

  static closeAllPanels() {
    document.getElementById("overlay")?.classList.remove("open");
    document.getElementById("searchPanel")?.classList.remove("open");
    document.getElementById("quickView")?.classList.remove("open");
    document.getElementById("cartDrawer")?.classList.remove("open");
  }

  static syncMobileCartCount() {
    const mainBadge = document.getElementById("cartCountBadge");
    const mobileBadge = document.getElementById("mobileCartCount");
    if (mainBadge && mobileBadge) {
      new MutationObserver(() => {
        mobileBadge.textContent = mainBadge.textContent;
      }).observe(mainBadge, { childList: true, characterData: true, subtree: true });
    }
  }

  static handleRoute() {
    const rawHash = window.location.hash.replace("#", "") || "home";
    const [route, queryString] = rawHash.split("?");
    const params = new URLSearchParams(queryString || "");

    // Update nav active state
    document.querySelectorAll(".main-nav .nav-link").forEach(link => {
      link.classList.toggle("active", link.dataset.view === route);
    });
    document.querySelectorAll(".mobile-dock .dock-item").forEach(item => {
      item.classList.toggle("active", item.dataset.dock === route);
    });

    // Switch views
    document.querySelectorAll("#app .view").forEach(v => v.classList.remove("active"));
    const activeViewEl = document.getElementById(route) || document.getElementById("home");
    if (activeViewEl) {
      activeViewEl.classList.add("active");
      window.scrollTo(0, 0);
    }

    // Ensure footer is visible across all views
    const footer = document.getElementById("siteFooter");
    if (footer) footer.style.display = "flex";

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
    const heroBanner = window.HRz.Storage.getHeroBanner();
    const db = window.HRz.DB;
    const featuredProducts = db.getProductsForBike(activeBike).slice(0, 8);
    const utils = window.HRz.Utils;
    const catalog = window.HRz.Catalog;
    const wishlist = window.HRz.Storage.getWishlist();
    const categories = db.getProducts();
    const catImages = {
      Protection: "images/category_protection.png",
      Helmets: "images/category_helmets.png",
      Lights: "images/category_lights.png",
      Luggage: "images/category_luggage.png"
    };

    container.innerHTML = `
      <!-- Hero -->
      <section class="hero">
        <img src="${heroBanner.bgImage || 'images/hero-rider.png'}" alt="Hero Banner" />
        <div class="hero-shade"></div>
        <div class="hero-copy">
          <p class="eyebrow red">${heroBanner.badge || 'Built for every mile'}</p>
          <h1 class="hero-headline-custom">${heroBanner.title || 'GEAR UP. <em>GO FAR.</em>'}</h1>
          <p class="hero-text">${heroBanner.subtitle || 'Purpose-built protection and performance for riders who never take the easy road.'}</p>

          <div class="hero-bike-action-card">
            <div class="active-bike-summary">
              <span class="bike-icon">🏍️</span>
              <div>
                <small>Currently Shopping For:</small>
                <strong>${activeBike ? activeBike.brand + " " + activeBike.model + " (" + activeBike.variant + ")" : "No Bike Selected"}</strong>
              </div>
            </div>
            <button class="button button-red hero-select-bike-btn" id="heroSelectBikeBtn" style="position: relative;">
              ${!activeBike ? '<div class="tutorial-pointer">Start Here</div>' : ''}
              ${activeBike ? "Change Motorcycle" : "Select Your Motorcycle"} <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Benefits Strip -->
      <section class="benefits" aria-label="Store benefits">
        <div><b>✦</b><p><strong>Built to protect</strong><small>Tested where it matters</small></p></div>
        <div><b>↗</b><p><strong>Fast, free delivery</strong><small>On orders above ₹2,999</small></p></div>
        <div><b>↺</b><p><strong>Easy 7-day returns</strong><small>Fitment guaranteed</small></p></div>
        <div><b>◉</b><p><strong>Rider support</strong><small>Real experts, real help</small></p></div>
      </section>

      <!-- Categories -->
      <section class="categories section" id="categories">
        <div class="section-head">
          <div><p class="eyebrow red">Find your essential</p><h2>SHOP BY <em>CATEGORY</em></h2></div>
          <a href="#catalog" class="text-link">View all gear <span>→</span></a>
        </div>
        <div class="category-grid">
          <div class="category large" onclick="window.location.hash='catalog?category=Protection'">
            <img src="${catImages.Protection}" alt="Crash guards and protection gear" />
            <span><small>01</small> Crash Guards <b>→</b></span>
          </div>
          <div class="category" onclick="window.location.hash='catalog?category=Helmets'">
            <img src="${catImages.Helmets}" alt="Helmets and intercoms" />
            <span><small>02</small> Helmets <b>→</b></span>
          </div>
          <div class="category" onclick="window.location.hash='catalog?category=Lights'">
            <img src="${catImages.Lights}" alt="LED fog lights" />
            <span><small>03</small> Fog Lights <b>→</b></span>
          </div>
          <div class="category" onclick="window.location.hash='catalog?category=Luggage'">
            <img src="${catImages.Luggage}" alt="Saddlebags and luggage" />
            <span><small>04</small> Luggage <b>→</b></span>
          </div>
        </div>
      </section>

      <!-- Bestsellers / Products -->
      <section class="products-section section" id="shop">
        <div class="section-head">
          <div><p class="eyebrow red">Rider approved</p><h2>THE <em>BESTSELLERS</em></h2></div>
          <div class="filters">
            <button class="active" data-filter="all">All gear</button>
            <button data-filter="Protection">Protection</button>
            <button data-filter="Lights">Performance</button>
          </div>
        </div>
        <div class="shop-toolbar">
          <span id="product-count">${featuredProducts.length} products</span>
          <div>
            <label>Sort <select id="home-sort-select">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select></label>
          </div>
        </div>
        <div class="product-grid" id="home-product-grid">
          ${featuredProducts.map(p => catalog.renderProductCard(p, activeBike, wishlist)).join("")}
        </div>
      </section>

      <!-- Reviews -->
      <section class="reviews-section section">
        <div class="section-head">
          <div><p class="eyebrow red">The word on the street</p><h2>RIDER <em>REVIEWS</em></h2></div>
          <div class="review-arrows">
            <button id="review-prev" aria-label="Previous review">←</button>
            <button id="review-next" aria-label="Next review">→</button>
          </div>
        </div>
        <div class="review-window">
          <div class="review-track" id="review-track">
            ${this.getReviewCards()}
          </div>
        </div>
      </section>

      <!-- Fit Finder -->
      <section class="fit-finder">
        <div>
          <p class="eyebrow">Need a hand?</p>
          <h2>FIND YOUR<br /><em>PERFECT FIT.</em></h2>
          <p>Answer three quick questions and we'll point you to the kit that matches your ride.</p>
          <button class="button button-red" id="fit-button">Start fit finder <span>→</span></button>
        </div>
        <div class="fit-steps">
          <span>01<br /><b>Your ride</b></span>
          <span>02<br /><b>Your style</b></span>
          <span>03<br /><b>Your gear</b></span>
        </div>
      </section>

      <!-- Statement -->
      <section class="statement">
        <div class="statement-image"><img src="images/hero_banner.png" alt="Motorcycle rider on the road" /></div>
        <div class="statement-copy">
          <p class="eyebrow red">The HRz standard</p>
          <h2>NOT JUST<br />A <em>RIDE.</em></h2>
          <p>Every curve, every downpour, every mile past midnight. The right gear means you can focus on what brought you here: the road in front of you.</p>
          <a href="#help" class="button button-outline">Our story <span>→</span></a>
          <div class="stat-row">
            <div><strong>12k+</strong><small>Riders equipped</small></div>
            <div><strong>4.9/5</strong><small>Rider rating</small></div>
          </div>
        </div>
      </section>

      <!-- New Drops -->
      <section class="new section" id="new">
        <div class="section-head">
          <div><p class="eyebrow red">Fresh off the truck</p><h2>NEW <em>DROPS</em></h2></div>
          <a href="#catalog" class="text-link">Shop new arrivals <span>→</span></a>
        </div>
        <div class="drop-grid">
          <article class="drop-card">
            <img src="images/category_helmets.png" alt="Premium motorcycle helmet" />
            <div>
              <span class="drop-tag">NEW / HELMETS</span>
              <h3>Premium Series</h3>
              <a href="#catalog?category=Helmets">Explore now →</a>
            </div>
          </article>
          <article class="drop-card">
            <img src="images/category_protection.png" alt="Crash guard kit" />
            <div>
              <span class="drop-tag">NEW / PROTECTION</span>
              <h3>Guard Series</h3>
              <a href="#catalog?category=Protection">Explore now →</a>
            </div>
          </article>
        </div>
      </section>

      <!-- Newsletter -->
      <section class="newsletter" id="journal">
        <p class="eyebrow red">Join the ride</p>
        <h2>ROAD NOTES,<br /><em>DELIVERED.</em></h2>
        <p>New gear, routes worth taking, and 10% off your first order.</p>
        <form id="newsletter-form">
          <input type="email" required placeholder="Your email address" aria-label="Your email address" />
          <button class="button button-red">Sign me up <span>→</span></button>
        </form>
        <small id="form-message"></small>
      </section>

      <!-- Service Strip -->
      <section class="service-strip">
        <div><b>✦</b><span><strong>Safe payments</strong><small>Cards · UPI · Wallets</small></span></div>
        <div><b>⌂</b><span><strong>Track your order</strong><small>Live delivery updates</small></span></div>
        <div><b>?</b><span><strong>Need help?</strong><small>Chat with a gear expert</small></span></div>
      </section>

      <!-- FAQ -->
      <section class="faq-section section">
        <p class="eyebrow red">Before you ride</p>
        <h2>QUICK <em>ANSWERS.</em></h2>
        <details><summary>How does the fitment guarantee work?</summary><p>When you select your bike from our dropdown, our catalog filters only items engineered for that model. If an item marked as compatible fails to fit, we issue a free return waybill and refund 100% of your money.</p></details>
        <details><summary>What are the shipping charges?</summary><p>Orders above ₹2,999 get FREE Express Shipping across India. Orders below ₹2,999 have a flat ₹199 delivery fee. Orders are dispatched within 24 hours.</p></details>
        <details><summary>Can I return gear?</summary><p>Yes. Unused gear can be returned within 7 days with a simple online return request. Fitment-related returns are always free.</p></details>
      </section>

      <!-- Recently Viewed -->
      <section class="recent section">
        <div class="section-head">
          <div><p class="eyebrow red">Keep exploring</p><h2>RECENTLY <em>VIEWED</em></h2></div>
        </div>
        <div class="recent-grid">
          ${featuredProducts.slice(0, 3).map(p => `
            <a href="#product?id=${p.id}">
              <img src="${p.image}" alt="${p.name}">
              <span>${p.name} <b>${utils.formatCurrency(p.price)}</b></span>
            </a>
          `).join("")}
        </div>
      </section>
    `;

    // Bind events
    const selectBtn = container.querySelector("#heroSelectBikeBtn");
    if (selectBtn) selectBtn.onclick = () => window.HRz.Garage.openBikeModal();

    catalog.bindCardEvents(container);

    // Filter buttons
    container.querySelectorAll(".filters button").forEach(b => {
      b.onclick = () => {
        container.querySelector(".filters .active")?.classList.remove("active");
        b.classList.add("active");
        const filter = b.dataset.filter;
        let filtered = filter === "all"
          ? db.getProductsForBike(activeBike).slice(0, 8)
          : db.getProductsForBike(activeBike).filter(p => p.category === filter);
        const grid = container.querySelector("#home-product-grid");
        const count = container.querySelector("#product-count");
        if (grid) grid.innerHTML = filtered.map(p => catalog.renderProductCard(p, activeBike, wishlist)).join("");
        if (count) count.textContent = `${filtered.length} products`;
        catalog.bindCardEvents(container);
      };
    });

    // Sort
    const sortSelect = container.querySelector("#home-sort-select");
    if (sortSelect) {
      sortSelect.onchange = () => {
        let items = [...db.getProductsForBike(activeBike).slice(0, 8)];
        if (sortSelect.value === "low") items.sort((a, b) => a.price - b.price);
        if (sortSelect.value === "high") items.sort((a, b) => b.price - a.price);
        const grid = container.querySelector("#home-product-grid");
        if (grid) grid.innerHTML = items.map(p => catalog.renderProductCard(p, activeBike, wishlist)).join("");
        catalog.bindCardEvents(container);
      };
    }

    // Review carousel
    const reviewNext = container.querySelector("#review-next");
    const reviewPrev = container.querySelector("#review-prev");
    const reviewTrack = container.querySelector("#review-track");
    if (reviewNext && reviewTrack) {
      reviewNext.onclick = () => reviewTrack.append(reviewTrack.firstElementChild);
    }
    if (reviewPrev && reviewTrack) {
      reviewPrev.onclick = () => reviewTrack.prepend(reviewTrack.lastElementChild);
    }

    // Fit finder
    const fitBtn = container.querySelector("#fit-button");
    if (fitBtn) fitBtn.onclick = () => utils.showToast("Fit finder is warming up — browse the catalog.", "info");

    // Newsletter
    const nlForm = container.querySelector("#newsletter-form");
    if (nlForm) {
      nlForm.onsubmit = (e) => {
        e.preventDefault();
        e.currentTarget.reset();
        const msg = container.querySelector("#form-message");
        if (msg) msg.textContent = "You're on the list — welcome to the ride.";
        utils.showToast("Subscribed successfully!", "success");
      };
    }
  }

  static getReviewCards() {
    const reviews = window.HRz.DB.getReviews ? window.HRz.DB.getReviews().filter(r => r.status === "published").slice(0, 6) : [];
    if (reviews.length > 0) {
      return reviews.map(r => `
        <article class="review-card">
          <div class="stars">★★★★★</div>
          <blockquote>"${r.comment}"</blockquote>
          <div class="reviewer">
            <span>${r.reviewerName.split(" ").map(n => n[0]).join("")}</span>
            <p><b>${r.reviewerName}</b><small>Verified rider · ${r.bikeName || "India"}</small></p>
          </div>
        </article>
      `).join("");
    }
    // Fallback review cards
    return `
      <article class="review-card">
        <div class="stars">★★★★★</div>
        <blockquote>"Finally, gear that feels as good on the fifth hour as it does when you roll out."</blockquote>
        <div class="reviewer"><span>JM</span><p><b>Jai Malhotra</b><small>Verified rider · Pune</small></p></div>
      </article>
      <article class="review-card">
        <div class="stars">★★★★★</div>
        <blockquote>"The crash guard fitted perfectly on my Himalayan. Zero modifications needed."</blockquote>
        <div class="reviewer"><span>AK</span><p><b>Amar Kapoor</b><small>Verified rider · Delhi</small></p></div>
      </article>
      <article class="review-card">
        <div class="stars">★★★★★</div>
        <blockquote>"Clean site, serious kit, fast delivery. This is now my go-to for every upgrade."</blockquote>
        <div class="reviewer"><span>RS</span><p><b>Riya Shah</b><small>Verified rider · Mumbai</small></p></div>
      </article>
    `;
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
          <p class="eyebrow red">Saved Items</p>
          <h2>MY <em>WISHLIST</em> (${products.length})</h2>
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
        <div class="product-grid inner-section">
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
      <div class="breadcrumb-trail">
        <a href="#home">Home</a> / <span class="current">My Orders</span>
      </div>
      <div class="view-header">
        <div>
          <p class="eyebrow red">Order History & Track Waybill</p>
          <h2>MY <em>ORDERS</em></h2>
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
                  <small> · Placed on ${o.date}</small>
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
                <span>Tracking: <code>${o.trackingId}</code></span>
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
      <div class="breadcrumb-trail">
        <a href="#home">Home</a> / <span class="current">Reviews</span>
      </div>
      <div class="view-header">
        <div>
          <p class="eyebrow red">Rider Community Feedback</p>
          <h2>VERIFIED RIDER <em>REVIEWS</em></h2>
        </div>
      </div>
      <div class="inner-section">
        ${reviews.map(r => `
          <div class="review-card">
            <div class="review-header">
              <span class="reviewer-name"><b>${r.reviewerName}</b></span>
              <span class="review-bike-tag">Verified ${r.bikeName}</span>
              <span class="review-date">${r.date}</span>
            </div>
            <div class="review-rating">${utils.renderStarRating(r.rating)}</div>
            <h4 class="review-title">${r.title}</h4>
            <p class="review-comment" style="color:var(--mute); margin-top:8px;">${r.comment}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  static renderHelpView(container) {
    container.innerHTML = `
      <div class="breadcrumb-trail">
        <a href="#home">Home</a> / <span class="current">FAQ & Support</span>
      </div>
      <div class="view-header">
        <div>
          <p class="eyebrow red">Help & Support Center</p>
          <h2>QUICK <em>ANSWERS</em></h2>
        </div>
      </div>
      <div class="faq-section inner-section">
        <details>
          <summary>How does the 100% Fitment Guarantee work?</summary>
          <p>When you select your bike from our dropdown (Make, Model, Year, Variant), our catalog filters only items engineered for that model. If an item marked as compatible fails to fit, we issue a free return waybill and refund 100% of your money.</p>
        </details>
        <details>
          <summary>What are the shipping charges and timeline?</summary>
          <p>Orders above ₹2,999 get FREE Express Shipping across India. Orders below ₹2,999 have a flat ₹199 delivery fee. Orders are dispatched within 24 hours.</p>
        </details>
        <details>
          <summary>How do I report a part that didn't fit?</summary>
          <p>Go to the product page or your account order history and click "Didn't Fit My Bike?". Fill out the brief report form and our team will issue an immediate return label.</p>
        </details>
        <details>
          <summary>What payment methods do you accept?</summary>
          <p>We accept UPI (GPay, PhonePe, Paytm), all major credit and debit cards (Visa, Mastercard, RuPay, Amex), and Cash on Delivery (COD).</p>
        </details>
        <details>
          <summary>Do you ship internationally?</summary>
          <p>Currently we ship PAN-India only. International shipping is planned for Q4 2026. Sign up for our newsletter to be notified.</p>
        </details>
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
