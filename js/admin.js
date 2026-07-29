/* =============================================
   HRz PITSTOP – Admin CMS & Control Center Module
   ============================================= */

window.HRz = window.HRz || {};

class AdminCMS {
  static activeTab = "hero";

  static render(container) {
    const db = window.HRz.DB;
    const storage = window.HRz.Storage;
    const utils = window.HRz.Utils;

    const products = db.getProducts();
    const compatibility = db.getCompatibility();
    const bikes = db.getBikes();
    const reviews = db.getReviews();
    const orders = db.getOrders();
    const auditLogs = storage.getAuditLogs();
    const heroBanner = storage.getHeroBanner();
    const currentRole = storage.loadState().adminRole || "Admin";

    container.innerHTML = `
      <div class="admin-cms-header">
        <div>
          <p class="eyebrow">HRz Content Management System</p>
          <h2>Admin CMS & Offer Control Center</h2>
        </div>
        <div class="admin-role-switch">
          <label for="adminRoleSelect">Active Role:</label>
          <select id="adminRoleSelect">
            <option value="Admin" ${currentRole === "Admin" ? "selected" : ""}>Admin (Full Access)</option>
            <option value="Catalog Manager" ${currentRole === "Catalog Manager" ? "selected" : ""}>Catalog Manager</option>
            <option value="Moderator" ${currentRole === "Moderator" ? "selected" : ""}>Review Moderator</option>
          </select>
        </div>
      </div>

      <!-- Admin Tabs Navigation -->
      <div class="admin-tabs-bar">
        <button class="admin-tab-btn ${this.activeTab === "hero" ? "active" : ""}" data-tab="hero">
          🎯 Hero Offer Banner
        </button>
        <button class="admin-tab-btn ${this.activeTab === "catalog" ? "active" : ""}" data-tab="catalog">
          📦 Product Catalog (${products.length})
        </button>
        <button class="admin-tab-btn ${this.activeTab === "compatibility" ? "active" : ""}" data-tab="compatibility">
          🏍️ Compatibility Matrix (${compatibility.length})
        </button>
        <button class="admin-tab-btn ${this.activeTab === "reviews" ? "active" : ""}" data-tab="reviews">
          ⭐ Moderation Queue (${reviews.filter(r=>r.status==='pending').length} Pending)
        </button>
        <button class="admin-tab-btn ${this.activeTab === "orders" ? "active" : ""}" data-tab="orders">
          📜 Orders (${orders.length})
        </button>
        <button class="admin-tab-btn ${this.activeTab === "csv" ? "active" : ""}" data-tab="csv">
          📊 CSV Import/Export
        </button>
        <button class="admin-tab-btn ${this.activeTab === "logs" ? "active" : ""}" data-tab="logs">
          ⏱️ Audit Logs
        </button>
      </div>

      <div class="admin-tab-content">
        ${this.renderTabContent(this.activeTab, { products, compatibility, bikes, reviews, orders, auditLogs, heroBanner })}
      </div>
    `;

    const roleSel = container.querySelector("#adminRoleSelect");
    if (roleSel) {
      roleSel.onchange = (e) => {
        const state = storage.loadState();
        state.adminRole = e.target.value;
        storage.saveState(state);
        utils.showToast(`Role changed to ${e.target.value}`, "info");
        this.render(container);
      };
    }

    container.querySelectorAll(".admin-tab-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        this.render(container);
      };
    });

    this.bindTabEvents(container);
  }

  static renderTabContent(tab, data) {
    const utils = window.HRz.Utils;
    const db = window.HRz.DB;

    if (tab === "hero") {
      const hero = data.heroBanner;
      return `
        <div class="hero-cms-card">
          <div class="cms-toolbar">
            <div>
              <h3>Customize Hero Promo Banner & Offer Ads</h3>
              <p style="color:var(--color-ink-muted); font-size:13px;">Change the hero headline, promotional offer badge, call-to-action, and background banner image displayed on the homepage.</p>
            </div>
          </div>

          <form id="heroCmsForm" class="hero-cms-form">
            <div class="form-group">
              <label for="heroBadgeInput">Promotional Offer Badge Tag *</label>
              <input type="text" id="heroBadgeInput" value="${hero.badge || ''}" required placeholder="e.g. MONSOON MEGA SALE · FLAT 20% OFF" />
            </div>

            <div class="form-group">
              <label for="heroTitleInput">Main Hero Headline *</label>
              <input type="text" id="heroTitleInput" value="${hero.title || ''}" required placeholder="e.g. Guaranteed Fitment for Your Motorcycle" />
            </div>

            <div class="form-group">
              <label for="heroSubheadInput">Subhead Explanation text</label>
              <textarea id="heroSubheadInput" rows="3" required>${hero.subtitle || ''}</textarea>
            </div>

            <div class="form-group">
              <label for="heroBgImageInput">Hero Background Image URL or Path *</label>
              <input type="text" id="heroBgImageInput" value="${hero.bgImage || 'images/hero_banner.jpg'}" required />
              
              <div class="image-preset-picker">
                <span class="label">Quick Presets:</span>
                <button type="button" class="preset-img-btn" data-url="images/hero_banner.jpg">Hero Banner JPG</button>
                <button type="button" class="preset-img-btn" data-url="images/hero_banner.png">Hero Banner PNG</button>
                <button type="button" class="preset-img-btn" data-url="images/category_protection.png">Protection Banner</button>
                <button type="button" class="preset-img-btn" data-url="images/category_lights.png">Lights Banner</button>
              </div>

              <div class="file-upload-row">
                <label for="heroBgFileUpload" class="secondary-button" style="margin-top:8px; display:inline-block;">📤 Upload Custom Banner File</label>
                <input type="file" id="heroBgFileUpload" accept="image/*" style="display:none;" />
              </div>
            </div>

            <div class="hero-preview-box">
              <h4>Live Banner Preview:</h4>
              <div class="rider-hero" style="background: linear-gradient(135deg, rgba(24, 27, 38, 0.85), rgba(10, 11, 14, 0.92)), url('${hero.bgImage}') center/cover no-repeat; margin-bottom:0;">
                <div class="hero-content-box">
                  <span class="hero-badge" id="previewBadge">${hero.badge}</span>
                  <h1 class="hero-headline" id="previewTitle">${hero.title}</h1>
                  <p class="hero-subhead" id="previewSubhead">${hero.subtitle}</p>
                </div>
              </div>
            </div>

            <button type="submit" class="accent-button full-width-btn" style="margin-top:20px;">Save & Publish Hero Banner</button>
          </form>
        </div>
      `;
    }

    if (tab === "catalog") {
      return `
        <div class="cms-toolbar">
          <h3>Manage Product Catalog</h3>
          <button class="accent-button" id="addNewProductBtn">+ Add New Product</button>
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
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.products.map(p => `
                <tr>
                  <td><img src="${p.image}" alt="${p.name}" width="40" height="40" style="object-fit:cover; border-radius:4px;" onerror="this.src='images/helmet_product.png'" /></td>
                  <td><strong>${p.name}</strong><br/><small>SKU: ${p.sku}</small></td>
                  <td><span class="cat-tag">${p.category}</span></td>
                  <td>${utils.formatCurrency(p.price)}</td>
                  <td>${p.inStock ? "<span class='stock-tag in'>In Stock</span>" : "<span class='stock-tag out'>Out of Stock</span>"}</td>
                  <td>${p.rating}★ (${p.reviewCount})</td>
                  <td>
                    <button class="small-action-btn delete-prod-btn danger" data-id="${p.id}">Delete</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    if (tab === "compatibility") {
      return `
        <div class="cms-toolbar">
          <h3>Compatibility Matrix (Product <-> Bike Fit Rules)</h3>
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
                    <td><code>${c.id}</code></td>
                    <td>${prod ? prod.name : c.productId}</td>
                    <td>${bike ? `${bike.brand} ${bike.model} (${bike.variant})` : "Universal / " + c.bikeId}</td>
                    <td><span class="fit-type-tag">${c.fitType}</span></td>
                    <td><small>${c.notes || "N/A"}</small></td>
                    <td>
                      <button class="small-action-btn delete-comp-btn danger" data-id="${c.id}">Delete</button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    if (tab === "reviews") {
      return `
        <div class="cms-toolbar">
          <h3>Customer Reviews & Photo Moderation Queue</h3>
        </div>
        <div class="reviews-moderation-grid">
          ${data.reviews.map(r => `
            <div class="moderation-card ${r.status}">
              <div class="mod-header">
                <strong>${r.reviewerName}</strong>
                <span class="status-badge ${r.status}">${r.status.toUpperCase()}</span>
              </div>
              <p class="bike-info">Bike: ${r.bikeName}</p>
              <h4 class="title">${r.title}</h4>
              <p class="comment">"${r.comment}"</p>
              <div class="mod-actions">
                ${r.status !== "published" ? `<button class="small-action-btn approve-rev-btn" data-id="${r.id}">Approve</button>` : ""}
                ${r.status !== "rejected" ? `<button class="small-action-btn danger reject-rev-btn" data-id="${r.id}">Reject</button>` : ""}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (tab === "orders") {
      return `
        <div class="cms-toolbar">
          <h3>Customer Orders & Fitment Verification</h3>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.orders.map(o => `
                <tr>
                  <td><strong>${o.id}</strong></td>
                  <td>${o.date}</td>
                  <td>${o.bike}</td>
                  <td>${utils.formatCurrency(o.total)}</td>
                  <td><span class="order-status-badge">${o.status}</span></td>
                  <td>
                    <select class="order-status-select" data-id="${o.id}">
                      <option value="Processing & Fitment Checked" ${o.status === "Processing & Fitment Checked" ? "selected" : ""}>Processing</option>
                      <option value="Shipped - In Transit" ${o.status.includes("Transit") ? "selected" : ""}>Shipped</option>
                      <option value="Delivered" ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
                    </select>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    if (tab === "csv") {
      return `
        <div class="csv-tools-card">
          <h3>CSV Import & Export for Compatibility Matrix</h3>
          <p>Export the full relational compatibility table or bulk upload new fitment rules.</p>
          
          <div class="csv-actions-row">
            <button class="accent-button" id="exportCsvBtn">📥 Download Compatibility CSV</button>
            
            <div class="upload-csv-box">
              <label for="importCsvInput" class="secondary-button">📤 Upload Compatibility CSV</label>
              <input type="file" id="importCsvInput" accept=".csv" style="display:none;" />
            </div>
          </div>
        </div>
      `;
    }

    if (tab === "logs") {
      return `
        <div class="audit-logs-card">
          <h3>System Audit Logs</h3>
          <ul class="audit-log-list">
            ${data.auditLogs.map(l => `
              <li class="log-item">
                <span class="log-time">${new Date(l.timestamp).toLocaleTimeString()}</span>
                <strong class="log-user">${l.user}:</strong>
                <span class="log-text">${l.action}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    }
  }

  static bindTabEvents(container) {
    const db = window.HRz.DB;
    const storage = window.HRz.Storage;
    const utils = window.HRz.Utils;

    // Hero CMS Events
    const heroForm = container.querySelector("#heroCmsForm");
    if (heroForm) {
      const bgInput = container.querySelector("#heroBgImageInput");
      const fileInput = container.querySelector("#heroBgFileUpload");

      container.querySelectorAll(".preset-img-btn").forEach(btn => {
        btn.onclick = () => {
          bgInput.value = btn.dataset.url;
        };
      });

      if (fileInput) {
        fileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              bgInput.value = evt.target.result;
            };
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
        utils.showToast("Hero Promo Banner updated!", "success");
        this.render(container);
      };
    }

    // Catalog Events
    const addProdBtn = container.querySelector("#addNewProductBtn");
    if (addProdBtn) {
      addProdBtn.onclick = () => this.openAddProductModal(container);
    }

    container.querySelectorAll(".delete-prod-btn").forEach(btn => {
      btn.onclick = () => {
        if (confirm("Are you sure you want to delete this product?")) {
          db.deleteProduct(btn.dataset.id);
          utils.showToast("Product deleted", "info");
          this.render(container);
        }
      };
    });

    container.querySelectorAll(".delete-comp-btn").forEach(btn => {
      btn.onclick = () => {
        db.deleteCompatibilityRule(btn.dataset.id);
        utils.showToast("Compatibility rule deleted", "info");
        this.render(container);
      };
    });

    const addCompBtn = container.querySelector("#addCompRuleBtn");
    if (addCompBtn) {
      addCompBtn.onclick = () => this.openAddCompModal(container);
    }

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

    container.querySelectorAll(".order-status-select").forEach(sel => {
      sel.onchange = () => {
        db.updateOrderStatus(sel.dataset.id, sel.value);
        utils.showToast("Order status updated", "success");
      };
    });

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

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Add New Product to Catalog</h3>
          <button type="button" class="close-btn" id="closeAdminProdModal">✕</button>
        </div>
        <div class="modal-body">
          <form id="adminAddProdForm">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" id="newProdName" required placeholder="e.g. HRz Carbon Slider" />
            </div>

            <div class="form-group">
              <label>Category *</label>
              <select id="newProdCat" required>
                ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
                <option value="__CUSTOM__">+ Create Custom Category...</option>
              </select>
              <input type="text" id="customCatInput" placeholder="Enter Custom Category Name" style="display:none; margin-top:6px;" />
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
              <label>Product Image *</label>
              <input type="text" id="newProdImgUrl" value="images/crash_guard_product.png" required placeholder="Image Path or URL" />
              
              <div class="image-preset-picker" style="margin-top:8px;">
                <span class="label">Choose Image Preset:</span>
                <div class="preset-thumbs-row">
                  <img src="images/crash_guard_product.png" class="thumb-pick-btn" data-url="images/crash_guard_product.png" alt="Crash Guard" />
                  <img src="images/fog_lights_product.png" class="thumb-pick-btn" data-url="images/fog_lights_product.png" alt="Fog Lights" />
                  <img src="images/helmet_product.png" class="thumb-pick-btn" data-url="images/helmet_product.png" alt="Helmet" />
                  <img src="images/saddlebags_product.png" class="thumb-pick-btn" data-url="images/saddlebags_product.png" alt="Saddlebags" />
                  <img src="images/bash_plate_product.png" class="thumb-pick-btn" data-url="images/bash_plate_product.png" alt="Bash Plate" />
                  <img src="images/intercom_product.png" class="thumb-pick-btn" data-url="images/intercom_product.png" alt="Intercom" />
                </div>
              </div>

              <div class="file-upload-row" style="margin-top:8px;">
                <label for="prodImgFileUpload" class="secondary-button">Upload Image File</label>
                <input type="file" id="prodImgFileUpload" accept="image/*" style="display:none;" />
              </div>
            </div>

            <button type="submit" class="accent-button full-width-btn">Save & Publish Product</button>
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

    const imgUrlInput = document.getElementById("newProdImgUrl");
    modal.querySelectorAll(".thumb-pick-btn").forEach(img => {
      img.onclick = () => {
        imgUrlInput.value = img.dataset.url;
      };
    });

    const fileInput = document.getElementById("prodImgFileUpload");
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            imgUrlInput.value = evt.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
    }

    document.getElementById("adminAddProdForm").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("newProdName").value;
      let category = catSel.value;
      if (category === "__CUSTOM__") {
        category = customCatInput.value.trim() || "General";
      }

      const price = parseFloat(document.getElementById("newProdPrice").value);
      const originalPrice = parseFloat(document.getElementById("newProdOrigPrice").value) || price + 500;
      const sku = document.getElementById("newProdSku").value || `HRZ-${Date.now().toString().slice(-4)}`;
      const image = imgUrlInput.value || "images/crash_guard_product.png";

      window.HRz.DB.addProduct({
        name,
        category,
        price,
        originalPrice,
        sku,
        image,
        badge: "NEW ARRIVAL",
        highlights: ["High tensile build", "Guaranteed fitment"]
      });

      modal.classList.remove("show");
      window.HRz.Utils.showToast(`Product "${name}" added under category "${category}"`, "success");
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

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3>Create Fitment Compatibility Link</h3>
          <button type="button" class="close-btn" id="closeAdminCompModal">✕</button>
        </div>
        <div class="modal-body">
          <form id="adminAddCompForm">
            <div class="form-group">
              <label>Select Product *</label>
              <select id="compSelectProduct" required>
                ${prods.map(p => `<option value="${p.id}">${p.name} (${p.sku})</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Select Motorcycle *</label>
              <select id="compSelectBike" required>
                ${bikes.map(b => `<option value="${b.id}">${b.brand} ${b.model} (${b.variant})</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Fit Type *</label>
              <select id="compFitType" required>
                <option value="OEM Fit">OEM Fit (Direct Mount)</option>
                <option value="Universal Fit">Universal Fit</option>
                <option value="Requires Adapter">Requires Adapter Bracket</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fitment Notes</label>
              <input type="text" id="compNotes" placeholder="e.g. Mounts using stock chassis bolts" />
            </div>
            <button type="submit" class="accent-button full-width-btn">Link Compatibility</button>
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
