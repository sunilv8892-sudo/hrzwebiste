/* =============================================
   HRz PITSTOP – Admin CMS & Control Center Module
   Dashboard UI Redesign
   ============================================= */

window.HRz = window.HRz || {};

class AdminCMS {
  static activeTab = "hero";
  static catalogPage = 1;
  static catalogSearch = "";

  static render(container) {
    const db = window.HRz.DB;
    const storage = window.HRz.Storage;
    const utils = window.HRz.Utils;
    const escapeHTML = utils.escapeHTML;

    const products = db.getProducts();
    const compatibility = db.getCompatibility();
    const bikes = db.getBikes();
    const reviews = db.getReviews();
    const orders = db.getOrders();
    const auditLogs = storage.getAuditLogs();
    const heroBanner = storage.getHeroBanner();

    const pendingReviews = reviews.filter(r => r.status === 'pending').length;

    container.innerHTML = `
      <div class="admin-dashboard-layout">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <p class="eyebrow">HRz PITSTOP</p>
            <h2>Admin Center</h2>
          </div>
          <div class="admin-tabs-list">
            <button class="admin-tab-btn ${this.activeTab === "hero" ? "active" : ""}" data-tab="hero">
              🎯 Hero Offer Banner
            </button>
            <button class="admin-tab-btn ${this.activeTab === "catalog" ? "active" : ""}" data-tab="catalog">
              📦 Product Catalog <span class="badge">${products.length}</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === "compatibility" ? "active" : ""}" data-tab="compatibility">
              🏍️ Compatibility Matrix <span class="badge">${compatibility.length}</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === "reviews" ? "active" : ""}" data-tab="reviews">
              ⭐ Moderation Queue ${pendingReviews > 0 ? `<span class="badge" style="background:var(--gold);color:#000;">${pendingReviews}</span>` : ""}
            </button>
            <button class="admin-tab-btn ${this.activeTab === "orders" ? "active" : ""}" data-tab="orders">
              📜 Customer Orders <span class="badge">${orders.length}</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === "csv" ? "active" : ""}" data-tab="csv">
              📊 CSV Import/Export
            </button>
            <button class="admin-tab-btn ${this.activeTab === "logs" ? "active" : ""}" data-tab="logs">
              ⏱️ Audit Logs
            </button>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="admin-main">
          <!-- Topbar -->
          <div class="admin-topbar">
            <div class="admin-page-title">
              <h1>${this.getPageTitle(this.activeTab)}</h1>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="admin-tab-content">
            ${this.renderTabContent(this.activeTab, { products, compatibility, bikes, reviews, orders, auditLogs, heroBanner })}
          </div>
        </main>
      </div>
    `;

    container.querySelectorAll(".admin-tab-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        this.render(container);
      };
    });

    this.bindTabEvents(container);
  }

  static getPageTitle(tab) {
    const titles = {
      hero: "Hero Promotional Banner",
      catalog: "Product Catalog Management",
      compatibility: "Bike Compatibility Matrix",
      reviews: "Review Moderation Queue",
      orders: "Customer Orders",
      csv: "Bulk Data Tools",
      logs: "System Audit Logs"
    };
    return titles[tab] || "Dashboard";
  }

  static renderTabContent(tab, data) {
    const utils = window.HRz.Utils;
    const db = window.HRz.DB;
    const escapeHTML = utils.escapeHTML;

    if (tab === "hero") {
      const hero = data.heroBanner;
      return `
        <div class="admin-panel-card">
          <div class="cms-toolbar">
            <div>
              <h3>Customize Homepage Hero</h3>
              <p>Change the main headline, promotional offer badge, and background banner image.</p>
            </div>
          </div>

          <form id="heroCmsForm" class="admin-form-grid">
            <div class="form-group">
              <label for="heroBadgeInput">Promotional Offer Badge *</label>
              <input type="text" id="heroBadgeInput" value="${escapeHTML(hero.badge || '')}" required placeholder="e.g. MONSOON MEGA SALE · FLAT 20% OFF" />
            </div>

            <div class="form-group">
              <label for="heroTitleInput">Main Hero Headline *</label>
              <input type="text" id="heroTitleInput" value="${escapeHTML(hero.title || '')}" required placeholder="e.g. Guaranteed Fitment for Your Motorcycle" />
            </div>

            <div class="form-group admin-form-full">
              <label for="heroSubheadInput">Subhead Explanation</label>
              <textarea id="heroSubheadInput" rows="2" required>${escapeHTML(hero.subtitle || '')}</textarea>
            </div>

            <div class="form-group admin-form-full">
              <label for="heroBgImageInput">Hero Background Image URL or Path *</label>
              <input type="text" id="heroBgImageInput" value="${escapeHTML(hero.bgImage || 'images/hero_banner.jpg')}" required />
              
              <div class="image-preset-picker">
                <button type="button" class="preset-img-btn" data-url="images/hero-rider.png">Default Rider PNG</button>
                <button type="button" class="preset-img-btn" data-url="images/hero_banner.jpg">Hero Banner JPG</button>
                <button type="button" class="preset-img-btn" data-url="images/category_protection.png">Protection Banner</button>
              </div>

              <div class="file-upload-row">
                <label for="heroBgFileUpload" class="small-action-btn" style="display:inline-block;">📤 Upload Custom Banner</label>
                <input type="file" id="heroBgFileUpload" accept="image/*" style="display:none;" />
              </div>
            </div>

            <div class="admin-form-full hero-preview-box">
              <h4>Live Banner Preview</h4>
              <div class="rider-hero" style="background: linear-gradient(135deg, rgba(9, 10, 12, 0.85), rgba(9, 10, 12, 0.95)), url('${escapeHTML(hero.bgImage)}') center/cover no-repeat;">
                <div class="hero-content-box">
                  <span class="hero-badge" id="previewBadge">${escapeHTML(hero.badge)}</span>
                  <h1 class="hero-headline" id="previewTitle">${escapeHTML(hero.title)}</h1>
                  <p class="hero-subhead" id="previewSubhead">${escapeHTML(hero.subtitle)}</p>
                </div>
              </div>
            </div>

            <div class="admin-form-full" style="margin-top:16px;">
              <button type="submit" class="accent-button">Save & Publish Hero Banner</button>
            </div>
          </form>
        </div>
      `;
    }

    if (tab === "catalog") {
      const activeCategoryFilter = document.getElementById("app")?.dataset.catalogFilter || "All";
      const categories = ["All", ...window.HRz.DB.getCategories()];
      
      let filteredProducts = data.products;
      if (activeCategoryFilter !== "All") {
        filteredProducts = filteredProducts.filter(p => p.category === activeCategoryFilter);
      }
      
      if (this.catalogSearch) {
        const query = this.catalogSearch.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(query) || 
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
        );
      }

      const itemsPerPage = 50;
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
      if (this.catalogPage > totalPages) this.catalogPage = totalPages;
      if (this.catalogPage < 1) this.catalogPage = 1;
      
      const startIndex = (this.catalogPage - 1) * itemsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

      return `
        <!-- Metrics Row -->
        <div class="admin-metrics-row">
          <div class="admin-metric-card">
            <span class="title">Total Products</span>
            <span class="value">${data.products.length}</span>
          </div>
          <div class="admin-metric-card">
            <span class="title">Categories</span>
            <span class="value">${categories.length - 1}</span>
          </div>
          <div class="admin-metric-card">
            <span class="title">Low Stock Alerts</span>
            <span class="value" style="color:var(--gold);">0</span>
          </div>
        </div>

        <div class="admin-panel-card">
          <div class="cms-toolbar">
            <div>
              <h3>Product Inventory</h3>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="accent-button" id="exportCatalogBtn">📥 Export JSON</button>
              <button class="accent-button" id="addNewProductBtn">+ Add New Product</button>
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <input type="text" id="adminCatalogSearchInput" value="${escapeHTML(this.catalogSearch)}" placeholder="Search products by name or SKU..." style="width:100%; padding: 10px; border-radius: 6px; background: #1c1e22; border: 1px solid #333; color: white; font-size: 14px;" />
          </div>

          <div class="category-filter-pills" style="margin-bottom: 24px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${categories.map(cat => `
              <button class="filter-pill admin-cat-filter ${activeCategoryFilter === cat ? "active" : ""}" data-filter="${escapeHTML(cat)}" style="padding: 6px 14px; border: 1px solid #333; border-radius: 20px; background: ${activeCategoryFilter === cat ? 'var(--red)' : '#1a1c1e'}; color: white; cursor:pointer; font-size:12px;">${escapeHTML(cat)}</button>
            `).join("")}
          </div>

          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name & SKU</th>
                  <th>Category</th>
                  <th>Price (INR)</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${paginatedProducts.map(p => `
                  <tr>
                    <td><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" width="44" height="44" style="object-fit:cover; border-radius:6px; border:1px solid #333;" onerror="this.src='images/helmet_product.png'" /></td>
                    <td><strong>${escapeHTML(p.name)}</strong> ${p.isVisible === false ? '<span style="color:var(--red); font-size:10px; border:1px solid var(--red); padding:2px 4px; border-radius:3px; margin-left:4px;">HIDDEN</span>' : ''}<br/><small style="color:#888;">SKU: ${escapeHTML(p.sku)}</small></td>
                    <td><span class="cat-tag">${escapeHTML(p.category)}</span></td>
                    <td>${utils.formatCurrency(p.price)}</td>
                    <td>${p.inStock ? "<span class='stock-tag in'>In Stock</span>" : "<span class='stock-tag out'>Out of Stock</span>"}</td>
                    <td>
                      <button class="small-action-btn edit-prod-btn" data-id="${escapeHTML(p.id)}">Edit</button>
                      <button class="small-action-btn delete-prod-btn danger" data-id="${escapeHTML(p.id)}">Delete</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          
          <div class="admin-pagination" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #333;">
            <button class="small-action-btn" id="prevCatPageBtn" ${this.catalogPage <= 1 ? 'disabled' : ''} style="cursor: ${this.catalogPage <= 1 ? 'not-allowed' : 'pointer'}; opacity: ${this.catalogPage <= 1 ? '0.5' : '1'};">&laquo; Prev</button>
            <span style="color: #aaa; font-size: 14px;">Page ${this.catalogPage} of ${totalPages}</span>
            <button class="small-action-btn" id="nextCatPageBtn" ${this.catalogPage >= totalPages ? 'disabled' : ''} style="cursor: ${this.catalogPage >= totalPages ? 'not-allowed' : 'pointer'}; opacity: ${this.catalogPage >= totalPages ? '0.5' : '1'};">Next &raquo;</button>
          </div>
        </div>
      `;
    }

    if (tab === "compatibility") {
      return `
        <div class="admin-panel-card">
          <div class="cms-toolbar">
            <div>
              <h3>Fitment Rules</h3>
              <p>Manage product compatibility with specific motorcycles.</p>
            </div>
            <button class="accent-button" id="addCompRuleBtn">+ Add Fitment Rule</button>
          </div>
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Rule ID</th>
                  <th>Product</th>
                  <th>Compatible Bike</th>
                  <th>Fit Type</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${data.compatibility.map(c => {
                  const prod = db.getProductById(c.productId);
                  const bike = data.bikes.find(b => b.id === c.bikeId);
                  return `
                    <tr>
                      <td><code style="color:#888;">${c.id}</code></td>
                      <td><strong>${prod ? escapeHTML(prod.name) : escapeHTML(c.productId)}</strong></td>
                      <td>${bike ? `${escapeHTML(bike.brand)} ${escapeHTML(bike.model)}` : "Universal"}</td>
                      <td><span class="cat-tag">${escapeHTML(c.fitType)}</span></td>
                      <td><small style="color:#888;">${escapeHTML(c.notes || "N/A")}</small></td>
                      <td>
                        <button class="small-action-btn delete-comp-btn danger" data-id="${escapeHTML(c.id)}">Delete</button>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === "reviews") {
      return `
        <div class="admin-panel-card">
          <div class="cms-toolbar">
            <div>
              <h3>Customer Reviews Queue</h3>
              <p>Approve or reject customer installation reviews before they appear on the storefront.</p>
            </div>
          </div>
          <div class="reviews-moderation-grid">
            ${data.reviews.map(r => `
              <div class="moderation-card ${r.status}">
                <div class="mod-header">
                  <strong>${escapeHTML(r.reviewerName)}</strong>
                  <span class="status-badge ${r.status}">${escapeHTML(r.status.toUpperCase())}</span>
                </div>
                <p class="bike-info">Bike: ${escapeHTML(r.bikeName)}</p>
                <h4 class="title">${escapeHTML(r.title)}</h4>
                <p class="comment">"${escapeHTML(r.comment)}"</p>
                <div class="mod-actions">
                  ${r.status !== "published" ? `<button class="small-action-btn approve-rev-btn" data-id="${escapeHTML(r.id)}">Approve</button>` : ""}
                  ${r.status !== "rejected" ? `<button class="small-action-btn danger reject-rev-btn" data-id="${escapeHTML(r.id)}">Reject</button>` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    if (tab === "orders") {
      return `
        <div class="admin-panel-card">
          <div class="cms-toolbar">
            <div>
              <h3>Customer Orders</h3>
              <p>Process orders and update tracking statuses.</p>
            </div>
          </div>
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Bike Fitment</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${data.orders.map(o => `
                  <tr>
                    <td><strong>${escapeHTML(o.id)}</strong></td>
                    <td><small style="color:#888;">${escapeHTML(o.date)}</small></td>
                    <td>${escapeHTML(o.bike)}</td>
                    <td>${utils.formatCurrency(o.total)}</td>
                    <td>
                      <select class="order-status-select" data-id="${escapeHTML(o.id)}" style="background:#1a1c1e; color:#fff; border:1px solid #333; padding:6px; border-radius:4px;">
                        <option value="Order Placed" ${o.status === "Order Placed" || o.status.includes("Placed") ? "selected" : ""}>Order Placed</option>
                        <option value="Processing & Fitment Checked" ${o.status.includes("Processing") ? "selected" : ""}>Processing</option>
                        <option value="Shipped - In Transit" ${o.status.includes("Transit") || o.status.includes("Shipped") ? "selected" : ""}>Shipped</option>
                        <option value="Delivered" ${o.status.includes("Delivered") ? "selected" : ""}>Delivered</option>
                        <option value="Cancelled" ${o.status.includes("Cancelled") ? "selected" : ""}>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === "csv") {
      return `
        <div class="admin-panel-card">
          <h3>CSV Import & Export</h3>
          <p style="color:var(--mute); font-size:14px; margin-bottom: 24px;">Export the full relational compatibility table or bulk upload new fitment rules via CSV.</p>
          
          <div style="display:flex; gap:16px;">
            <button class="accent-button" id="exportCsvBtn">📥 Download Compatibility CSV</button>
            <label for="importCsvInput" class="small-action-btn" style="padding:10px 16px; font-size:14px; display:inline-flex; align-items:center;">📤 Upload Compatibility CSV</label>
            <input type="file" id="importCsvInput" accept=".csv" style="display:none;" />
          </div>
        </div>
      `;
    }

    if (tab === "logs") {
      return `
        <div class="admin-panel-card">
          <h3>System Audit Logs</h3>
          <p style="color:var(--mute); font-size:14px; margin-bottom: 24px;">Track CMS changes and moderator actions.</p>
          
          <div class="audit-log-list">
            ${data.auditLogs.map(l => `
              <div class="log-item">
                <span class="log-time">${escapeHTML(new Date(l.timestamp).toLocaleTimeString())}</span>
                <strong class="log-user">${escapeHTML(l.user)}:</strong>
                <span class="log-text">${escapeHTML(l.action)}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
  }

  static bindTabEvents(container) {
    const db = window.HRz.DB;
    const storage = window.HRz.Storage;
    const utils = window.HRz.Utils;
    const appContainer = document.getElementById("app");

    // Hero CMS Events
    const heroForm = container.querySelector("#heroCmsForm");
    if (heroForm) {
      const bgInput = container.querySelector("#heroBgImageInput");
      const fileInput = container.querySelector("#heroBgFileUpload");

      container.querySelectorAll(".preset-img-btn").forEach(btn => {
        btn.onclick = () => { bgInput.value = btn.dataset.url; };
      });

      if (fileInput) {
        fileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => { bgInput.value = evt.target.result; };
            reader.readAsDataURL(file);
          }
        };
      }

      heroForm.onsubmit = (e) => {
        e.preventDefault();
        const badge = container.querySelector("#heroBadgeInput").value;
        const title = container.querySelector("#heroTitleInput").value;
        const subtitle = container.querySelector("#heroSubheadInput").value;
        const bgImage = bgInput.value;

        storage.setHeroBanner({ badge, title, subtitle, bgImage });
        utils.showToast("Hero Promo Banner updated! Check the storefront.", "success");
        this.render(container);
      };
    }

    // Catalog Events
    container.querySelectorAll(".admin-cat-filter").forEach(btn => {
      btn.onclick = () => {
        if (appContainer) appContainer.dataset.catalogFilter = btn.dataset.filter;
        this.catalogPage = 1;
        this.render(container);
      };
    });

    const searchInput = container.querySelector("#adminCatalogSearchInput");
    if (searchInput) {
      // Focus restoration trick
      const focusEnd = () => {
        if (searchInput) {
          searchInput.focus();
          const len = searchInput.value.length;
          searchInput.setSelectionRange(len, len);
        }
      };
      
      searchInput.oninput = (e) => {
        this.catalogSearch = e.target.value;
        this.catalogPage = 1;
        this.render(container);
        
        // Wait for next render cycle to restore focus
        setTimeout(() => {
          const newSearch = document.getElementById("adminCatalogSearchInput");
          if (newSearch) {
            newSearch.focus();
            const l = newSearch.value.length;
            newSearch.setSelectionRange(l, l);
          }
        }, 0);
      };
    }
    
    const prevBtn = container.querySelector("#prevCatPageBtn");
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.catalogPage > 1) {
          this.catalogPage--;
          this.render(container);
        }
      };
    }

    const nextBtn = container.querySelector("#nextCatPageBtn");
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.catalogPage++;
        this.render(container);
      };
    }

    const exportCatBtn = container.querySelector("#exportCatalogBtn");
    if (exportCatBtn) {
      exportCatBtn.onclick = () => {
        const json = JSON.stringify(db.getProducts(), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `products_export_${Date.now()}.json`;
        a.click();
        utils.showToast("Catalog exported as JSON", "success");
      };
    }

    const addProdBtn = container.querySelector("#addNewProductBtn");
    if (addProdBtn) {
      addProdBtn.onclick = () => this.openAddProductModal(container);
    }

    container.querySelectorAll(".edit-prod-btn").forEach(btn => {
      btn.onclick = () => this.openEditProductModal(container, btn.dataset.id);
    });

    container.querySelectorAll(".delete-prod-btn").forEach(btn => {
      btn.onclick = () => {
        if (confirm("Are you sure you want to delete this product?")) {
          db.deleteProduct(btn.dataset.id);
          utils.showToast("Product deleted", "info");
          this.render(container);
        }
      };
    });

    // Fitment Rules
    container.querySelectorAll(".delete-comp-btn").forEach(btn => {
      btn.onclick = () => {
        db.deleteCompatibilityRule(btn.dataset.id);
        utils.showToast("Compatibility rule deleted", "info");
        this.render(container);
      };
    });

    const addCompBtn = container.querySelector("#addCompRuleBtn");
    if (addCompBtn) addCompBtn.onclick = () => this.openAddCompModal(container);

    // Reviews
    container.querySelectorAll(".approve-rev-btn").forEach(btn => {
      btn.onclick = () => {
        db.updateReviewStatus(btn.dataset.id, "published");
        utils.showToast("Review approved and published", "success");
        this.render(container);
      };
    });
    container.querySelectorAll(".reject-rev-btn").forEach(btn => {
      btn.onclick = () => {
        db.updateReviewStatus(btn.dataset.id, "rejected");
        utils.showToast("Review rejected", "info");
        this.render(container);
      };
    });

    // Orders
    container.querySelectorAll(".order-status-select").forEach(sel => {
      sel.onchange = () => {
        db.updateOrderStatus(sel.dataset.id, sel.value);
        utils.showToast("Order status updated", "success");
      };
    });

    // CSV
    const exportBtn = container.querySelector("#exportCsvBtn");
    if (exportBtn) {
      exportBtn.onclick = () => {
        const csv = db.exportCompatibilityCSV();
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `HRz_Compatibility_Matrix_${Date.now()}.csv`;
        a.click();
        utils.showToast("CSV exported successfully", "success");
      };
    }

    const importInput = container.querySelector("#importCsvInput");
    if (importInput) {
      importInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const count = db.importCompatibilityCSV(evt.target.result);
            utils.showToast(`Successfully imported ${count} fitment rules`, "success");
            this.render(container);
          };
          reader.readAsText(file);
        }
      };
    }
  }

  static openAddProductModal(container) {
    let modal = document.getElementById("adminProductModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "adminProductModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const categories = window.HRz.DB.getCategories();
    const escapeHTML = window.HRz.Utils.escapeHTML;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 700px;">
        <div class="modal-header">
          <h3>Add New Product to Catalog</h3>
          <button type="button" class="close-btn" id="closeAdminProdModal">✕</button>
        </div>
        <div class="modal-body">
          <form id="adminAddProdForm" class="admin-form-grid">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" id="newProdName" required placeholder="e.g. HRz Carbon Slider" />
            </div>

            <div class="form-group">
              <label>Category *</label>
              <select id="newProdCat" required>
                ${categories.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("")}
                <option value="__CUSTOM__">+ Create Custom Category...</option>
              </select>
              <input type="text" id="customCatInput" placeholder="Enter Custom Category Name" style="display:none; margin-top:6px; background:#1c1e22; border:1px solid #333; color:#fff; padding:12px; border-radius:6px; width:100%;" />
            </div>

            <div class="form-group">
              <label>Price (INR) *</label>
              <input type="number" id="newProdPrice" required placeholder="3999" />
            </div>

            <div class="form-group">
              <label>Original Price (INR)</label>
              <input type="number" id="newProdOrigPrice" placeholder="4999" />
            </div>

            <div class="form-group">
              <label>SKU Code</label>
              <input type="text" id="newProdSku" placeholder="HRZ-SLD-01" />
            </div>
            
            <div class="form-group">
              <label>Sizes (Comma separated)</label>
              <input type="text" id="newProdSizes" placeholder="e.g. S, M, L, XL" />
            </div>

            <div class="form-group">
              <label>Visible on Store</label>
              <select id="newProdIsVisible">
                <option value="true" selected>Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div class="form-group admin-form-full">
              <label>Full Description</label>
              <textarea id="newProdDesc" rows="4" placeholder="Enter detailed product description..."></textarea>
            </div>

            <div class="form-group admin-form-full">
              <label>Product Image URL *</label>
              <input type="text" id="newProdImgUrl" value="images/crash_guard_product.png" required placeholder="Image Path or URL" />
              
              <div style="margin-top:12px;">
                <label for="prodImgFileUpload" class="small-action-btn" style="display:inline-block;">📤 Upload Image File</label>
                <input type="file" id="prodImgFileUpload" accept="image/*" style="display:none;" />
              </div>
            </div>

            <div class="admin-form-full" style="margin-top: 16px;">
              <button type="submit" class="accent-button">Save & Publish Product</button>
            </div>
          </form>
        </div>
      </div>
    `;

    modal.classList.add("show");
    window.HRz.Utils.setupModalAccessibility(modal, () => modal.classList.remove("show"));
    document.getElementById("closeAdminProdModal").onclick = () => modal.classList.remove("show");

    const catSel = document.getElementById("newProdCat");
    const customCatInput = document.getElementById("customCatInput");
    catSel.onchange = () => {
      if (catSel.value === "__CUSTOM__") {
        customCatInput.style.display = "block";
        customCatInput.required = true;
      } else {
        customCatInput.style.display = "none";
        customCatInput.required = false;
      }
    };

    const fileInput = document.getElementById("prodImgFileUpload");
    const imgUrlInput = document.getElementById("newProdImgUrl");
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => { imgUrlInput.value = evt.target.result; };
          reader.readAsDataURL(file);
        }
      };
    }

    document.getElementById("adminAddProdForm").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("newProdName").value;
      let category = catSel.value;
      if (category === "__CUSTOM__") category = customCatInput.value.trim() || "General";

      const price = parseFloat(document.getElementById("newProdPrice").value);
      const originalPrice = parseFloat(document.getElementById("newProdOrigPrice").value) || price + 500;
      const sku = document.getElementById("newProdSku").value || `HRZ-${Date.now().toString().slice(-4)}`;
      const description = document.getElementById("newProdDesc").value.trim();
      const sizes = document.getElementById("newProdSizes").value.trim();
      const image = imgUrlInput.value || "images/crash_guard_product.png";
      const isVisible = document.getElementById("newProdIsVisible").value === "true";

      window.HRz.DB.addProduct({
        name, category, price, originalPrice, sku, description, sizes, image, isVisible,
        badge: "NEW ARRIVAL", highlights: ["High tensile build", "Guaranteed fitment"]
      });

      modal.classList.remove("show");
      window.HRz.Utils.showToast(`Product "${name}" added to catalog`, "success");
      this.render(container);
    };
  }

  static openEditProductModal(container, productId) {
    const product = window.HRz.DB.getProductById(productId);
    if (!product) return;

    let modal = document.getElementById("adminProductModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "adminProductModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const categories = window.HRz.DB.getCategories();
    const escapeHTML = window.HRz.Utils.escapeHTML;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 700px;">
        <div class="modal-header">
          <h3>Edit Product</h3>
          <button type="button" class="close-btn" id="closeAdminProdModal">✕</button>
        </div>
        <div class="modal-body">
          <form id="adminEditProdForm" class="admin-form-grid">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" id="editProdName" required value="${escapeHTML(product.name)}" />
            </div>

            <div class="form-group">
              <label>Category *</label>
              <select id="editProdCat" required>
                ${categories.map(c => `<option value="${escapeHTML(c)}" ${product.category === c ? 'selected' : ''}>${escapeHTML(c)}</option>`).join("")}
                <option value="__CUSTOM__">+ Create Custom Category...</option>
              </select>
              <input type="text" id="editCustomCatInput" placeholder="Enter Custom Category Name" style="display:none; margin-top:6px; background:#1c1e22; border:1px solid #333; color:#fff; padding:12px; border-radius:6px; width:100%;" />
            </div>

            <div class="form-group">
              <label>Price (INR) *</label>
              <input type="number" id="editProdPrice" required value="${product.price}" />
            </div>

            <div class="form-group">
              <label>Original Price (INR)</label>
              <input type="number" id="editProdOrigPrice" value="${product.originalPrice || ''}" />
            </div>

            <div class="form-group">
              <label>SKU Code</label>
              <input type="text" id="editProdSku" value="${escapeHTML(product.sku || '')}" />
            </div>
            
            <div class="form-group">
              <label>Sizes (Comma separated)</label>
              <input type="text" id="editProdSizes" value="${escapeHTML(product.sizes || '')}" />
            </div>
            
            <div class="form-group">
              <label>In Stock</label>
              <select id="editProdInStock">
                <option value="true" ${product.inStock ? 'selected' : ''}>Yes</option>
                <option value="false" ${!product.inStock ? 'selected' : ''}>No</option>
              </select>
            </div>

            <div class="form-group">
              <label>Visible on Store</label>
              <select id="editProdIsVisible">
                <option value="true" ${product.isVisible !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${product.isVisible === false ? 'selected' : ''}>No</option>
              </select>
            </div>

            <div class="form-group admin-form-full">
              <label>Full Description</label>
              <textarea id="editProdDesc" rows="4">${escapeHTML(product.description || '')}</textarea>
            </div>

            <div class="form-group admin-form-full">
              <label>Product Image URL *</label>
              <input type="text" id="editProdImgUrl" required value="${escapeHTML(product.image || '')}" />
              
              <div style="margin-top:12px;">
                <label for="editProdImgFileUpload" class="small-action-btn" style="display:inline-block;">📤 Upload Image File</label>
                <input type="file" id="editProdImgFileUpload" accept="image/*" style="display:none;" />
              </div>
            </div>

            <div class="admin-form-full" style="margin-top: 16px;">
              <button type="submit" class="accent-button">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    modal.classList.add("show");
    window.HRz.Utils.setupModalAccessibility(modal, () => modal.classList.remove("show"));
    document.getElementById("closeAdminProdModal").onclick = () => modal.classList.remove("show");

    const catSel = document.getElementById("editProdCat");
    const customCatInput = document.getElementById("editCustomCatInput");
    catSel.onchange = () => {
      if (catSel.value === "__CUSTOM__") {
        customCatInput.style.display = "block";
        customCatInput.required = true;
      } else {
        customCatInput.style.display = "none";
        customCatInput.required = false;
      }
    };

    const fileInput = document.getElementById("editProdImgFileUpload");
    const imgUrlInput = document.getElementById("editProdImgUrl");
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => { imgUrlInput.value = evt.target.result; };
          reader.readAsDataURL(file);
        }
      };
    }

    document.getElementById("adminEditProdForm").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("editProdName").value;
      let category = catSel.value;
      if (category === "__CUSTOM__") category = customCatInput.value.trim() || "General";

      const price = parseFloat(document.getElementById("editProdPrice").value);
      const originalPrice = parseFloat(document.getElementById("editProdOrigPrice").value) || price + 500;
      const sku = document.getElementById("editProdSku").value || product.sku;
      const description = document.getElementById("editProdDesc").value.trim();
      const sizes = document.getElementById("editProdSizes").value.trim();
      const image = imgUrlInput.value || product.image;
      const inStock = document.getElementById("editProdInStock").value === "true";
      const isVisible = document.getElementById("editProdIsVisible").value === "true";

      window.HRz.DB.updateProduct(productId, {
        name, category, price, originalPrice, sku, description, sizes, image, inStock, isVisible
      });

      modal.classList.remove("show");
      window.HRz.Utils.showToast(`Product "${name}" updated successfully`, "success");
      this.render(container);
    };
  }

  static openAddCompModal(container) {
    let modal = document.getElementById("adminCompModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "adminCompModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const prods = window.HRz.DB.getProducts();
    const bikes = window.HRz.DB.getBikes();
    const escapeHTML = window.HRz.Utils.escapeHTML;

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Create Fitment Compatibility Link</h3>
          <button type="button" class="close-btn" id="closeAdminCompModal">✕</button>
        </div>
        <div class="modal-body">
          <form id="adminAddCompForm" class="admin-form-grid">
            <div class="form-group admin-form-full">
              <label>Select Product *</label>
              <select id="compSelectProduct" required>
                ${prods.map(p => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} (${escapeHTML(p.sku)})</option>`).join("")}
              </select>
            </div>
            <div class="form-group admin-form-full">
              <label>Select Motorcycle *</label>
              <select id="compSelectBike" required>
                ${bikes.map(b => `<option value="${escapeHTML(b.id)}">${escapeHTML(b.brand)} ${escapeHTML(b.model)} (${escapeHTML(b.variant)})</option>`).join("")}
              </select>
            </div>
            <div class="form-group admin-form-full">
              <label>Fit Type *</label>
              <select id="compFitType" required>
                <option value="OEM Fit">OEM Fit (Direct Mount)</option>
                <option value="Universal Fit">Universal Fit</option>
                <option value="Requires Adapter">Requires Adapter Bracket</option>
              </select>
            </div>
            <div class="form-group admin-form-full">
              <label>Fitment Notes</label>
              <input type="text" id="compNotes" placeholder="e.g. Mounts using stock chassis bolts" />
            </div>
            <div class="admin-form-full" style="margin-top:16px;">
              <button type="submit" class="accent-button full-width-btn">Link Compatibility</button>
            </div>
          </form>
        </div>
      </div>
    `;

    modal.classList.add("show");
    window.HRz.Utils.setupModalAccessibility(modal, () => modal.classList.remove("show"));
    document.getElementById("closeAdminCompModal").onclick = () => modal.classList.remove("show");

    document.getElementById("adminAddCompForm").onsubmit = (e) => {
      e.preventDefault();
      const pId = document.getElementById("compSelectProduct").value;
      const bId = document.getElementById("compSelectBike").value;
      const fitType = document.getElementById("compFitType").value;
      const notes = document.getElementById("compNotes").value;

      window.HRz.DB.addCompatibilityRule(pId, bId, fitType, notes);
      modal.classList.remove("show");
      window.HRz.Utils.showToast("Compatibility rule linked", "success");
      this.render(container);
    };
  }
}

window.HRz.Admin = AdminCMS;
