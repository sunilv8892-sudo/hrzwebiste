/* =============================================
   HRz PITSTOP – Main Application Entry & Router Module
   Adapted for editorial "Rogue Ride" design
   ============================================= */

window.HRz = window.HRz || {};

class App {
  static async init() {
    console.log("Initializing HRz Pitstop application...");

    await window.HRz.DB.init();
    this.syncDataLoadBanner();

    window.HRz.Garage.init((activeBike) => this.onBikeChanged(activeBike));
    window.HRz.Cart.init();
    window.HRz.Search.init();
    if (window.HRz.Auth) window.HRz.Auth.init();
    if (window.HRz.Menu) window.HRz.Menu.init();

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

    // Scroll action for mobile dock
    let lastScrollY = window.scrollY;
    const dock = document.querySelector(".mobile-dock");
    window.addEventListener("scroll", () => {
      if (!dock) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        dock.classList.add("hidden");
      } else {
        dock.classList.remove("hidden");
      }
      lastScrollY = currentScrollY;
    }, { passive: true });

    // Handle mobile back button for panels
    window.addEventListener("popstate", (e) => {
      const overlay = document.getElementById("overlay");
      if (overlay && overlay.classList.contains("open")) {
        this.closeAllPanels(true); // true = called from popstate, don't trigger back() again
      }
      const viewer = document.getElementById("productGalleryViewer");
      if (viewer && viewer.classList.contains("open")) {
        if (window.HRz.Product && window.HRz.Product.closeViewer) {
          window.HRz.Product.closeViewer(true);
        } else {
          viewer.classList.remove("open");
          document.body.classList.remove("gallery-viewer-open");
        }
      }
      const fitmentModal = document.getElementById("fitmentReportModal");
      if (fitmentModal && fitmentModal.classList.contains("show")) {
        fitmentModal.classList.remove("show");
      }
      const orderModal = document.getElementById("orderDetailsModal");
      if (orderModal && orderModal.classList.contains("open")) {
        this.closeOrderDetailsModal(true);
      }
    });
  }

  static openPanel(panel) {
    if (!panel) return;
    panel.classList.add("open");
    document.getElementById("overlay")?.classList.add("open");
    
    // Push state so Android back button works
    if (!window.history.state || !window.history.state.panelOpen) {
      window.history.pushState({ panelOpen: true }, "");
    }
    
    const input = panel.querySelector("input");
    if (input) setTimeout(() => input.focus(), 100);
  }

  static closeAllPanels(isPopState = false, skipHistory = false) {
    const overlay = document.getElementById("overlay");
    const wasOpen = overlay && overlay.classList.contains("open");

    document.getElementById("overlay")?.classList.remove("open");
    document.getElementById("searchPanel")?.classList.remove("open");
    document.getElementById("quickView")?.classList.remove("open");
    document.getElementById("cartDrawer")?.classList.remove("open");
    if (window.HRz.Menu) window.HRz.Menu.closeAll(true);
    
    // If it was closed manually (not via back button), remove the history state
    if (wasOpen && !isPopState && window.history.state && window.history.state.panelOpen) {
      if (!skipHistory) {
        window.history.back();
      } else {
        window.history.replaceState({}, "");
      }
    }
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

  static syncDataLoadBanner() {
    const loadError = window.HRz.DB.loadError;
    const existing = document.getElementById("dataLoadErrorBanner");

    if (!loadError) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      const banner = document.createElement("div");
      banner.id = "dataLoadErrorBanner";
      banner.style.cssText = [
        "background:#8d1f18",
        "color:#fff",
        "padding:12px 16px",
        "font-size:14px",
        "line-height:1.4",
        "position:relative",
        "z-index:30"
      ].join(";");
      banner.innerHTML = `
        <strong>Data load failed:</strong>
        <span>${window.HRz.Utils.escapeHTML(loadError.message)}</span>
      `;
      const appRoot = document.getElementById("app");
      if (appRoot && appRoot.parentElement) {
        appRoot.parentElement.insertBefore(banner, appRoot);
      }
    } else {
      existing.innerHTML = `
        <strong>Data load failed:</strong>
        <span>${window.HRz.Utils.escapeHTML(loadError.message)}</span>
      `;
    }
  }

  static handleRoute() {
    this.syncDataLoadBanner();
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
      case "about":
        if (window.HRz.Menu) window.HRz.Menu.renderAbout(activeViewEl);
        break;
      case "events":
        if (window.HRz.Menu) window.HRz.Menu.renderEvents(activeViewEl, params.get("tab") || "upcoming");
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
    const escapeHTML = utils.escapeHTML;
    const catImages = {
      Protection: "images/category_protection.png",
      Helmets: "images/category_helmets.png",
      Lights: "images/category_lights.png",
      Luggage: "images/category_luggage.png"
    };

    container.innerHTML = `
      <!-- Hero -->
      <section class="hero">
        <img src="images/hero-rider.png" alt="Motorcyclist and sport motorcycle in a dark garage" />
        <div class="hero-shade"></div>
        <div class="hero-copy">
          <p class="eyebrow">Built for every mile</p>
          <h1>GEAR UP.<br /><em>GO FAR.</em></h1>
          <p class="hero-text">Purpose-built protection and performance for riders who never take the easy road.</p>
          <a class="button button-red" href="#catalog">Browse collection <span>→</span></a>
        </div>
      </section>

      <!-- 3D Bike Selector -->
      <section class="bike-selector-3d section" id="bikeSelector3D">
        <div class="section-head">
          <div><p class="eyebrow red">Select your machine</p><h2>CHOOSE YOUR <em>RIDE</em></h2></div>
        </div>
        <div class="bike-slider-container">
          <div class="bike-slider">
            <!-- Set 1 -->
            <div class="bike-item" data-brand="Royal Enfield" data-model="Classic 350" data-variant="Reborn" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_1.png" alt="Classic 350" /></div>
              <div class="bike-info"><h3>Royal Enfield</h3></div>
            </div>
            <div class="bike-item" data-brand="KTM" data-model="Duke" data-variant="390 Gen-3" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_2.png" alt="390 Duke" /></div>
              <div class="bike-info"><h3>KTM</h3></div>
            </div>
            <div class="bike-item" data-brand="BMW" data-model="GS" data-variant="1250 Adventure" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_3.png" alt="R 1250 GS" /></div>
              <div class="bike-info"><h3>BMW</h3></div>
            </div>
            <div class="bike-item" data-brand="Kawasaki" data-model="Ninja" data-variant="ZX-10R" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_4.png" alt="Ninja ZX-10R" /></div>
              <div class="bike-info"><h3>Kawasaki</h3></div>
            </div>
            <div class="bike-item" data-brand="Yamaha" data-model="R15" data-variant="V4" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_5.png" alt="YZF R15" /></div>
              <div class="bike-info"><h3>Yamaha</h3></div>
            </div>
            <div class="bike-item" data-brand="Ducati" data-model="Panigale" data-variant="V4" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_6.png" alt="Panigale V4" /></div>
              <div class="bike-info"><h3>Ducati</h3></div>
            </div>
            <div class="bike-item" data-brand="Triumph" data-model="Tiger" data-variant="900 Rally Pro" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_7.png" alt="Tiger 900" /></div>
              <div class="bike-info"><h3>Triumph</h3></div>
            </div>
            <!-- Set 2 (Middle, contains active by default) -->
            <div class="bike-item" data-brand="Royal Enfield" data-model="Classic 350" data-variant="Reborn" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_1.png" alt="Classic 350" /></div>
              <div class="bike-info"><h3>Royal Enfield</h3></div>
            </div>
            <div class="bike-item" data-brand="KTM" data-model="Duke" data-variant="390 Gen-3" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_2.png" alt="390 Duke" /></div>
              <div class="bike-info"><h3>KTM</h3></div>
            </div>
            <div class="bike-item active" data-brand="BMW" data-model="GS" data-variant="1250 Adventure" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_3.png" alt="R 1250 GS" /></div>
              <div class="bike-info"><h3>BMW</h3></div>
            </div>
            <div class="bike-item" data-brand="Kawasaki" data-model="Ninja" data-variant="ZX-10R" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_4.png" alt="Ninja ZX-10R" /></div>
              <div class="bike-info"><h3>Kawasaki</h3></div>
            </div>
            <div class="bike-item" data-brand="Yamaha" data-model="R15" data-variant="V4" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_5.png" alt="YZF R15" /></div>
              <div class="bike-info"><h3>Yamaha</h3></div>
            </div>
            <div class="bike-item" data-brand="Ducati" data-model="Panigale" data-variant="V4" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_6.png" alt="Panigale V4" /></div>
              <div class="bike-info"><h3>Ducati</h3></div>
            </div>
            <div class="bike-item" data-brand="Triumph" data-model="Tiger" data-variant="900 Rally Pro" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_7.png" alt="Tiger 900" /></div>
              <div class="bike-info"><h3>Triumph</h3></div>
            </div>
            <!-- Set 3 -->
            <div class="bike-item" data-brand="Royal Enfield" data-model="Classic 350" data-variant="Reborn" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_1.png" alt="Classic 350" /></div>
              <div class="bike-info"><h3>Royal Enfield</h3></div>
            </div>
            <div class="bike-item" data-brand="KTM" data-model="Duke" data-variant="390 Gen-3" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_2.png" alt="390 Duke" /></div>
              <div class="bike-info"><h3>KTM</h3></div>
            </div>
            <div class="bike-item" data-brand="BMW" data-model="GS" data-variant="1250 Adventure" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_3.png" alt="R 1250 GS" /></div>
              <div class="bike-info"><h3>BMW</h3></div>
            </div>
            <div class="bike-item" data-brand="Kawasaki" data-model="Ninja" data-variant="ZX-10R" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_4.png" alt="Ninja ZX-10R" /></div>
              <div class="bike-info"><h3>Kawasaki</h3></div>
            </div>
            <div class="bike-item" data-brand="Yamaha" data-model="R15" data-variant="V4" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_5.png" alt="YZF R15" /></div>
              <div class="bike-info"><h3>Yamaha</h3></div>
            </div>
            <div class="bike-item" data-brand="Ducati" data-model="Panigale" data-variant="V4" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_6.png" alt="Panigale V4" /></div>
              <div class="bike-info"><h3>Ducati</h3></div>
            </div>
            <div class="bike-item" data-brand="Triumph" data-model="Tiger" data-variant="900 Rally Pro" data-year="2024">
              <div class="bike-img-wrap"><img src="images/bike_t_7.png" alt="Tiger 900" /></div>
              <div class="bike-info"><h3>Triumph</h3></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="categories section" id="categories">
        <div class="section-head">
          <div><p class="eyebrow red">Find your essential</p><h2>SHOP BY <em>CATEGORY</em></h2></div>
          <a href="#catalog" class="text-link">View all gear <span>→</span></a>
        </div>
        <div class="category-grid">
          <div class="category large" onclick="window.location.hash='catalog?category=Bike%20Protection'">
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
          <div class="category" onclick="window.location.hash='catalog?category=Luggage%20%26%20Touring'">
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
              <a href="#catalog?category=Bike%20Protection">Explore now →</a>
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
        <div class="product-grid" id="recent-product-grid">
          ${featuredProducts.slice(0, 4).map(p => catalog.renderProductCard(p, activeBike, wishlist)).join("")}
        </div>
      </section>
    `;

    // Bind events
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

    // ═══════════════════════════════════════════════════════════════
    //  3D Bike Selector — Glitch-Free Native CSS Snap + Infinite Loop
    // ═══════════════════════════════════════════════════════════════
    const sliderContainer = container.querySelector(".bike-slider-container");
    const bikeItems       = container.querySelectorAll(".bike-item");

    if (sliderContainer && bikeItems.length > 0) {
      const NUM_BIKES = 7;
      let filterTimer = null;
      let scrollStopTimer = null;
      let lastActive = null;

      const inferBikeCategory = (brand, model) => {
        const brandKey = String(brand || "").toLowerCase();
        const modelKey = String(model || "").toLowerCase();

        if (modelKey.includes("classic")) return "Classic";
        if (modelKey.includes("himalayan") || modelKey.includes("tiger") || modelKey.includes("gs")) return "Adventure";
        if (modelKey.includes("duke") || modelKey.includes("mt-15")) return "Naked";
        if (modelKey.includes("ninja") || modelKey.includes("r15") || modelKey.includes("panigale")) return "Supersport";
        if (brandKey.includes("royal enfield") && modelKey.includes("hunter")) return "Roadster";
        return "Tourer";
      };

      // ─── helpers ──────────────────────────────────────────────────
      const getScrollCenter = () => sliderContainer.scrollLeft + sliderContainer.clientWidth / 2;
      const getMid = (el) => el.offsetLeft + el.clientWidth / 2;

      const getClosestItem = () => {
        const center = getScrollCenter();
        let best = null, bestDist = Infinity;
        bikeItems.forEach(el => {
          const dist = Math.abs(getMid(el) - center);
          if (dist < bestDist) { bestDist = dist; best = el; }
        });
        return best;
      };

      const activateBike = (el) => {
        if (el === lastActive) return;
        lastActive = el;
        bikeItems.forEach(i => i.classList.remove("active"));
        el.classList.add("active");

        const { brand, model, variant, year } = el.dataset;
        if (!brand || !model) return;
        const bikeObj = { brand, model, variant, year, category: inferBikeCategory(brand, model) };
        window.HRz.Storage.setActiveBike(bikeObj);

        clearTimeout(filterTimer);
        filterTimer = setTimeout(() => {
          const f = container.querySelector(".filters .active")?.dataset.filter || "all";
          const items = f === "all"
            ? db.getProductsForBike(bikeObj).slice(0, 8)
            : db.getProductsForBike(bikeObj).filter(p => p.category === f);
          const grid  = container.querySelector("#home-product-grid");
          const count = container.querySelector("#product-count");
          if (grid)  grid.innerHTML = items.map(p => catalog.renderProductCard(p, bikeObj, wishlist)).join("");
          if (count) count.textContent = `${items.length} products`;
          catalog.bindCardEvents(container);
        }, 350);
      };

      // ─── native scroll handling ───────────────────────────────────
      sliderContainer.addEventListener("scroll", () => {
        if (sliderContainer.dataset.isAutoScrolling === "true") return;
        
        const closest = getClosestItem();
        if (closest) activateBike(closest);

        // When scrolling stops completely
        clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(() => {
          const currentClosest = getClosestItem();
          const idx = Array.from(bikeItems).indexOf(currentClosest);
          
          // If we settled outside the middle set, teleport invisibly to the middle set
          if (idx !== -1 && (idx < NUM_BIKES || idx >= NUM_BIKES * 2)) {
            const middleIdx = (idx % NUM_BIKES) + NUM_BIKES; // map to middle set (7-13)
            const targetEl = bikeItems[middleIdx];
            
            // Disable snapping temporarily for the jump
            sliderContainer.style.scrollSnapType = "none";
            const targetPos = getMid(targetEl) - sliderContainer.clientWidth / 2;
            sliderContainer.scrollTo({ left: targetPos, behavior: "instant" });
            
            // Re-enable snapping in next frame
            requestAnimationFrame(() => {
              sliderContainer.style.scrollSnapType = ""; // restores to CSS default
            });
          }
        }, 150);
      }, { passive: true });

      // ─── desktop drag support ─────────────────────────────────────
      let isDragging = false;
      let startX = 0, scrollLeftStart = 0, hasMoved = false;

      sliderContainer.addEventListener("mousedown", e => {
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        scrollLeftStart = sliderContainer.scrollLeft;
        sliderContainer.style.scrollSnapType = "none"; // Disable snap while dragging
        sliderContainer.style.cursor = "grabbing";
      });

      window.addEventListener("mousemove", e => {
        if (!isDragging) return;
        e.preventDefault();
        const walk = (e.clientX - startX) * 1.5;
        if (Math.abs(walk) > 5) hasMoved = true;
        sliderContainer.scrollLeft = scrollLeftStart - walk;
      });

      window.addEventListener("mouseup", e => {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.style.cursor = "grab";
        sliderContainer.style.scrollSnapType = ""; // Re-enable snap
      });
      
      sliderContainer.addEventListener("click", e => {
        if (hasMoved) {
          e.preventDefault();
          return; // It was a drag, ignore click
        }
        
        const clicked = e.target.closest(".bike-item");
        if (clicked) {
          if (clicked.classList.contains("active")) {
            // Already centered & active -> open garage recommendations
            setTimeout(() => { window.location.hash = "garage"; }, 150);
          } else {
            // Not active -> smoothly scroll it to the center
            const targetPos = getMid(clicked) - sliderContainer.clientWidth / 2;
            sliderContainer.scrollTo({ left: targetPos, behavior: "smooth" });
            setTimeout(() => { window.location.hash = "garage"; }, 450);
          }
        }
      });
      
      sliderContainer.addEventListener("dragstart", e => e.preventDefault());

      // ─── initial position & auto-scroll (BMW to Triumph) ────────
      const startEl = bikeItems[NUM_BIKES + 2]; // BMW
      const endEl = bikeItems[NUM_BIKES + 6];   // Triumph
      
      if (startEl && endEl) {
        sliderContainer.dataset.isAutoScrolling = "true";
        requestAnimationFrame(() => {
          sliderContainer.scrollLeft = getMid(startEl) - sliderContainer.clientWidth / 2;
          sliderContainer.dataset.isAutoScrolling = "false";
        });
        
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            sliderContainer.dataset.isAutoScrolling = "true";
            sliderContainer.style.scrollSnapType = "none";
            sliderContainer.style.pointerEvents = "none";
            
            const duration = 2000;
            const startTime = performance.now();
            
            const animateScroll = (time) => {
              const elapsed = time - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
              
              const startPos = getMid(startEl) - sliderContainer.clientWidth / 2;
              const endPos = getMid(endEl) - sliderContainer.clientWidth / 2;
              
              sliderContainer.scrollLeft = startPos + (endPos - startPos) * easeProgress;
              
              if (progress < 1) {
                requestAnimationFrame(animateScroll);
              } else {
                sliderContainer.style.scrollSnapType = "";
                sliderContainer.style.pointerEvents = "";
                sliderContainer.dataset.isAutoScrolling = "false";
                activateBike(endEl);
              }
            };
            requestAnimationFrame(animateScroll);
          }
        }, { threshold: 0.3 });
        
        observer.observe(sliderContainer);
      }
    }
    // ═══════════════════════════════════════════════════════════════
  }

  static getReviewCards() {
    const reviews = window.HRz.DB.getReviews ? window.HRz.DB.getReviews().filter(r => r.status === "published").slice(0, 6) : [];
    const escapeHTML = window.HRz.Utils.escapeHTML;
    if (reviews.length > 0) {
      return reviews.map(r => `
        <article class="review-card">
          <div class="stars">★★★★★</div>
          <blockquote>"${escapeHTML(r.comment)}"</blockquote>
          <div class="reviewer">
            <span>${escapeHTML(r.reviewerName.split(" ").map(n => n[0]).join(""))}</span>
            <p><b>${escapeHTML(r.reviewerName)}</b><small>Verified rider · ${escapeHTML(r.bikeName || "India")}</small></p>
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

  static getOrderStatusClass(status) {
    if (!status) return "";
    const lower = status.toLowerCase();
    if (lower.includes("placed")) return "placed";
    if (lower.includes("processing")) return "processing";
    if (lower.includes("shipped") || lower.includes("transit")) return "shipped";
    if (lower.includes("delivered")) return "delivered";
    if (lower.includes("cancelled")) return "cancelled";
    return "";
  }

  static getOrderTimelineHTML(status) {
    const sClass = this.getOrderStatusClass(status);
    let progress = 0;
    
    // Ordered is always complete unless cancelled before even ordered? No, cancelled is after ordered.
    let procClass = "", shipClass = "", delivClass = "";
    
    if (sClass === "cancelled") {
      return `
        <div class="order-timeline-wrapper">
          <div class="order-timeline" style="max-width: 300px;">
            <div class="order-timeline-progress" style="width: 100%; background: #f44336;"></div>
            
            <div class="timeline-step completed">
              <div class="step-icon">✓</div>
              <div class="step-label">Ordered</div>
            </div>
            
            <div class="timeline-step active" style="margin-left: auto;">
              <div class="step-icon" style="background: #f44336; border-color: #f44336;">✕</div>
              <div class="step-label" style="color: #f44336;">Cancelled</div>
            </div>
          </div>
        </div>
      `;
    }
    
    if (sClass === "processing") {
      progress = 33;
      procClass = "active";
    } else if (sClass === "shipped") {
      progress = 66;
      procClass = "completed";
      shipClass = "active";
    } else if (sClass === "delivered") {
      progress = 100;
      procClass = "completed";
      shipClass = "completed";
      delivClass = "active";
    }
    // if placed, progress = 0, no extra classes

    return `
      <div class="order-timeline-wrapper">
        <div class="order-timeline">
          <div class="order-timeline-progress" style="width: ${progress}%;"></div>
          
          <div class="timeline-step completed">
            <div class="step-icon">✓</div>
            <div class="step-label">Ordered</div>
          </div>
          
          <div class="timeline-step ${procClass}">
            <div class="step-icon">${procClass === 'completed' ? '✓' : '⚙'}</div>
            <div class="step-label">Processing</div>
          </div>
          
          <div class="timeline-step ${shipClass}">
            <div class="step-icon">${shipClass === 'completed' ? '✓' : '🚚'}</div>
            <div class="step-label">Shipped</div>
          </div>
          
          <div class="timeline-step ${delivClass}">
            <div class="step-icon">${delivClass === 'completed' || delivClass === 'active' ? '✓' : '📦'}</div>
            <div class="step-label">Delivered</div>
          </div>
        </div>
      </div>
    `;
  }

  static renderTrackingView(container) {
    const orders = window.HRz.DB.getOrders();
    const utils = window.HRz.Utils;
    const escapeHTML = utils.escapeHTML;

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
          ${orders.map(o => {
            const firstItem = o.items[0];
            const badgeClass = this.getOrderStatusClass(o.status);
            
            return `
              <div class="order-card" onclick="window.HRz.App.openOrderDetailsModal('${escapeHTML(o.id)}')">
                <div class="order-card-header">
                  <div>
                    <strong>Order ID: ${escapeHTML(o.id)}</strong>
                    <small>Placed on ${escapeHTML(o.date)}</small>
                  </div>
                  <span class="order-status-badge ${badgeClass}">${escapeHTML(o.status)}</span>
                </div>
                
                <div class="order-card-body">
                  <div class="order-items-preview-row">
                    ${o.items.map(i => `
                      <img src="${escapeHTML(i.image || 'images/helmet_product.png')}" alt="${escapeHTML(i.name)}" class="order-item-thumb" onerror="this.src='images/helmet_product.png'" />
                    `).join("")}
                    <div class="order-item-details-compact">
                      <strong>${escapeHTML(firstItem ? firstItem.name : "Accessories")}</strong>
                      <small>${o.items.length > 1 ? `+ ${o.items.length - 1} more items` : "1 item"}</small>
                    </div>
                  </div>
                  
                  ${this.getOrderTimelineHTML(o.status)}
                </div>
                
                <div class="order-card-footer">
                  <span>Tracking: <code>${escapeHTML(o.trackingId)}</code></span>
                  <strong>${utils.formatCurrency(o.total)} <small style="font-size:14px; font-weight:normal;">→</small></strong>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `}
    `;
  }

  static openOrderDetailsModal(orderId) {
    const order = window.HRz.DB.getOrders().find(o => o.id === orderId);
    if (!order) return;

    let modal = document.getElementById("orderDetailsModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "orderDetailsModal";
      modal.className = "order-details-modal";
      document.body.appendChild(modal);
    }

    const utils = window.HRz.Utils;
    const escapeHTML = utils.escapeHTML;
    
    // Calculate progress for modal timeline
    const sClass = this.getOrderStatusClass(order.status);
    let progress = 0;
    let procClass = "", shipClass = "", delivClass = "";
    
    let timelineHTML = "";

    if (sClass === "cancelled") {
      timelineHTML = `
        <div class="modal-timeline-wrapper">
          <div class="modal-timeline">
            <div class="modal-timeline-progress" style="height: 100%; background: #f44336;"></div>
            
            <div class="modal-timeline-step completed">
              <div class="step-icon">✓</div>
              <div class="step-content">
                <strong>Order Placed</strong>
                <small>We received your order.</small>
              </div>
            </div>
            
            <div class="modal-timeline-step active">
              <div class="step-icon" style="background: #f44336; border-color: #f44336;">✕</div>
              <div class="step-content">
                <strong style="color: #f44336;">Cancelled</strong>
                <small>This order has been cancelled.</small>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      if (sClass === "processing") {
        progress = 33;
        procClass = "active";
      } else if (sClass === "shipped") {
        progress = 66;
        procClass = "completed";
        shipClass = "active";
      } else if (sClass === "delivered") {
        progress = 100;
        procClass = "completed";
        shipClass = "completed";
        delivClass = "active";
      }

      timelineHTML = `
        <div class="modal-timeline-wrapper">
          <div class="modal-timeline">
            <div class="modal-timeline-progress" style="height: ${progress}%;"></div>
            
            <div class="modal-timeline-step completed">
              <div class="step-icon">✓</div>
              <div class="step-content">
                <strong>Order Placed</strong>
                <small>We've received your order.</small>
              </div>
            </div>
            
            <div class="modal-timeline-step ${procClass}">
              <div class="step-icon">${procClass === 'completed' ? '✓' : '⚙'}</div>
              <div class="step-content">
                <strong>Processing</strong>
                <small>Verifying fitment & packing.</small>
              </div>
            </div>
            
            <div class="modal-timeline-step ${shipClass}">
              <div class="step-icon">${shipClass === 'completed' ? '✓' : '🚚'}</div>
              <div class="step-content">
                <strong>Shipped</strong>
                <small>Handed over to courier partner.</small>
              </div>
            </div>
            
            <div class="modal-timeline-step ${delivClass}">
              <div class="step-icon">${delivClass === 'completed' || delivClass === 'active' ? '✓' : '📦'}</div>
              <div class="step-content">
                <strong>Delivered</strong>
                <small>Enjoy the ride.</small>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="order-details-header">
        <h2>Order Details</h2>
        <button class="order-details-close" id="closeOrderModalBtn" aria-label="Close modal">×</button>
      </div>
      
      <div class="order-details-content">
        <div class="order-details-main">
          
          <div class="order-section-card">
            <h3>Items Ordered</h3>
            <div class="full-order-items-list">
              ${order.items.map(item => `
                <div class="full-order-item">
                  <img src="${escapeHTML(item.image || 'images/helmet_product.png')}" alt="${escapeHTML(item.name)}" onerror="this.src='images/helmet_product.png'" />
                  <div class="full-order-item-info">
                    <strong>${escapeHTML(item.name)}</strong>
                    <small>Qty: ${item.quantity} · SKU: ${escapeHTML(item.sku || 'N/A')}</small>
                  </div>
                  <div class="full-order-item-price">
                    ${utils.formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          
          <div class="order-section-card">
            <h3>Order Information</h3>
            <div class="order-info-grid">
              <div class="info-block">
                <span>Order ID</span>
                <strong>${escapeHTML(order.id)}</strong>
              </div>
              <div class="info-block">
                <span>Order Date</span>
                <strong>${escapeHTML(order.date)}</strong>
              </div>
              <div class="info-block">
                <span>Payment Method</span>
                <strong>${escapeHTML(order.paymentMethod || 'Prepaid')}</strong>
              </div>
              <div class="info-block">
                <span>Shipping Address</span>
                <strong>${escapeHTML(order.shippingAddress || 'Address details not available')}</strong>
              </div>
              <div class="info-block">
                <span>Bike Fitment Verified</span>
                <strong>${escapeHTML(order.bike)}</strong>
              </div>
            </div>
          </div>
          
        </div>
        
        <div class="order-details-sidebar">
          
          <div class="order-section-card">
            <h3>Tracking & Status</h3>
            <div class="info-block" style="margin-bottom:16px;">
              <span>Waybill / Tracking ID</span>
              <strong style="font-family:'DM Mono', monospace; font-size:16px; background:rgba(255,255,255,0.05); padding:8px; border-radius:4px; display:block;">${escapeHTML(order.trackingId)}</strong>
            </div>
            
            ${timelineHTML}
          </div>
          
          <div class="order-section-card">
            <h3>Summary</h3>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
              <span style="color:var(--mute);">Subtotal</span>
              <span>${utils.formatCurrency(order.total)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid var(--border);">
              <span style="color:var(--mute);">Shipping</span>
              <span style="color:#81c784;">Free</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <strong>Grand Total</strong>
              <strong style="font-size:20px;">${utils.formatCurrency(order.total)}</strong>
            </div>
          </div>
          
        </div>
      </div>
    `;

    // Add close events
    const closeBtn = modal.querySelector("#closeOrderModalBtn");
    if (closeBtn) {
      closeBtn.onclick = () => this.closeOrderDetailsModal();
    }
    
    // Add escape key support
    this._orderModalKeyHandler = (e) => {
      if (e.key === "Escape") this.closeOrderDetailsModal();
    };
    document.addEventListener("keydown", this._orderModalKeyHandler);

    // Open animation
    // Force reflow
    void modal.offsetWidth; 
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    
    if (!window.history.state || !window.history.state.orderModalOpen) {
      window.history.pushState({ orderModalOpen: true }, "");
    }
  }

  static closeOrderDetailsModal(isPopState = false, skipHistory = false) {
    const modal = document.getElementById("orderDetailsModal");
    if (!modal) return;
    
    const wasOpen = modal.classList.contains("open");
    modal.classList.remove("open");
    document.body.style.overflow = "";
    
    if (this._orderModalKeyHandler) {
      document.removeEventListener("keydown", this._orderModalKeyHandler);
      this._orderModalKeyHandler = null;
    }

    if (wasOpen && !isPopState && window.history.state && window.history.state.orderModalOpen) {
      if (!skipHistory) {
        window.history.back();
      } else {
        window.history.replaceState({}, "");
      }
    }
  }

  static renderReviewsView(container) {
    const reviews = window.HRz.DB.getReviews().filter(r => r.status === "published");
    const utils = window.HRz.Utils;
    const escapeHTML = utils.escapeHTML;

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
              <span class="reviewer-name"><b>${escapeHTML(r.reviewerName)}</b></span>
              <span class="review-bike-tag">Verified ${escapeHTML(r.bikeName)}</span>
              <span class="review-date">${escapeHTML(r.date)}</span>
            </div>
            <div class="review-rating">${utils.renderStarRating(r.rating)}</div>
            <h4 class="review-title">${escapeHTML(r.title)}</h4>
            <p class="review-comment" style="color:var(--mute); margin-top:8px;">${escapeHTML(r.comment)}</p>
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
