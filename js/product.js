/* =============================================
   HRz PITSTOP – Product Detail Page & Trust Signals Module
   ============================================= */

window.HRz = window.HRz || {};

class ProductDetailView {
  static render(container, productId) {
    const product = window.HRz.DB.getProductById(productId);
    const activeBike = window.HRz.Storage.getActiveBike();

    if (!product) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon">⚠️</div>
          <h3>Product Not Found or Unavailable</h3>
          <p>The motorcycle accessory or part you are looking for has been discontinued or moved.</p>
          <button class="accent-button" onclick="window.location.hash='catalog'">Return to Catalog</button>
        </div>
      `;
      return;
    }

    window.HRz.SEO.updateSEOForView("product", { product });

    const fitment = window.HRz.DB.checkFitment(product.id, activeBike);
    const reviews = window.HRz.DB.getReviews().filter(r => r.productId === product.id && r.status === "published");
    const utils = window.HRz.Utils;

    container.innerHTML = `
      <div class="breadcrumb-trail">
        <a href="#home">Home</a> / <a href="#catalog">Catalog</a> / <span class="current">${product.name}</span>
      </div>

      <div class="product-detail-layout">
        <!-- Media Gallery -->
        <div class="product-detail-gallery">
          <div class="main-image-frame">
            <img id="mainProductImage" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='images/helmet_product.png'" />
          </div>
          <div class="thumbnail-strip">
            ${(product.gallery || [product.image]).map((img, i) => `
              <button class="thumb-btn ${i === 0 ? "active" : ""}" data-src="${img}">
                <img src="${img}" alt="Thumbnail ${i+1}" loading="lazy" />
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Product Specs & Fitment -->
        <div class="product-detail-specs">
          <div class="sku-category-badge">${product.category} · SKU: <strong>${product.sku}</strong></div>
          <h1 class="product-detail-title">${product.name}</h1>

          <div class="product-detail-social">
            ${utils.renderStarRating(product.rating)}
            <span class="social-proof-text">(${reviews.length} Verified Rider Reviews · ${product.ridersInstalled}+ Installed)</span>
          </div>

          <div class="fitment-guarantee-banner ${fitment ? "verified-fit" : "universal-fit"}">
            <div class="banner-icon">${fitment ? "🛡️" : "🔧"}</div>
            <div class="banner-content">
              <strong>${fitment ? `100% Guaranteed OEM Fit for ${activeBike ? activeBike.brand + " " + activeBike.model : "Your Motorcycle"}` : "Universal Motorcycle Compatibility"}</strong>
              <p>${fitment ? fitment.notes : "Compatible with standard motorcycle mounts & clamps."}</p>
            </div>
          </div>

          <div class="detail-price-box">
            <div class="price-row">
              <span class="detail-price">${utils.formatCurrency(product.price)}</span>
              ${product.originalPrice ? `<span class="detail-original-price">${utils.formatCurrency(product.originalPrice)}</span>` : ""}
              <span class="tax-inclusive-tag">Inclusive of all taxes & free shipping</span>
            </div>
          </div>

          <div class="purchase-actions-row">
            <button class="accent-button add-to-bag-hero-btn" id="addToBagHeroBtn">
              Add to Shopping Bag
            </button>
            <button class="secondary-button report-fitment-issue-btn" id="reportFitmentIssueBtn">
              Didn't Fit My Bike?
            </button>
          </div>

          <!-- Trust Badges Strip -->
          <div class="detail-trust-grid">
            <div class="trust-pill"><span class="icon">✅</span> 7-Day Free Fitment Return Guarantee</div>
            <div class="trust-pill"><span class="icon">📜</span> ${product.authenticity || "100% OEM Certified"}</div>
            <div class="trust-pill"><span class="icon">🔒</span> ${product.warranty || "12 Months Warranty"}</div>
          </div>

          <div class="product-highlights-box">
            <h3>Key Features & Rider Specifications</h3>
            <ul>
              ${(product.highlights || []).map(h => `<li><span class="bullet">▶</span> ${h}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- Real Installation Photos & Bike-Specific Reviews Section -->
      <section class="rider-proof-section">
        <div class="section-title-row">
          <div>
            <p class="eyebrow">Real Rider Community</p>
            <h2>Verified Installation Photos & Reviews</h2>
          </div>
        </div>

        <div class="installation-photos-carousel">
          <h4>Customer Installation Gallery</h4>
          <div class="install-grid">
            <div class="install-card">
              <img src="${product.image}" alt="Installation" loading="lazy" />
              <div class="install-caption">
                <strong>Himalayan 450 Summit</strong>
                <small>Installed by Rahul M. · Bengaluru</small>
              </div>
            </div>
            <div class="install-card">
              <img src="images/crash_guard_product.png" alt="Installation" loading="lazy" />
              <div class="install-caption">
                <strong>Duke 390 Gen-3</strong>
                <small>Installed by Ankit S. · Pune</small>
              </div>
            </div>
          </div>
        </div>

        <div class="reviews-list">
          ${reviews.length === 0 ? `
            <p class="no-reviews-text">No reviews published yet for this bike model. Be the first rider to submit an installation review!</p>
          ` : `
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
          `}
        </div>
      </section>
    `;

    container.querySelectorAll(".thumb-btn").forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll(".thumb-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const mainImg = container.querySelector("#mainProductImage");
        if (mainImg) mainImg.src = btn.dataset.src;
      };
    });

    const addBtn = container.querySelector("#addToBagHeroBtn");
    if (addBtn) {
      addBtn.onclick = () => {
        window.dispatchEvent(new CustomEvent("hrz:add-to-cart", { detail: { product } }));
      };
    }

    const reportBtn = container.querySelector("#reportFitmentIssueBtn");
    if (reportBtn) {
      reportBtn.onclick = () => this.openFitmentReportModal(product, activeBike);
    }
  }

  static openFitmentReportModal(product, activeBike) {
    let modal = document.getElementById("fitmentReportModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "fitmentReportModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <p class="eyebrow">Fitment Guarantee</p>
            <h3>Report Fitment Discrepancy</h3>
          </div>
          <button type="button" class="close-btn" id="closeReportModal">✕</button>
        </div>
        <div class="modal-body">
          <p>We take fitment accuracy very seriously. If <strong>${product.name}</strong> did not fit your <strong>${activeBike ? activeBike.brand + " " + activeBike.model : "motorcycle"}</strong>, let us know for an instant return label.</p>

          <form id="fitmentReportForm">
            <div class="form-group">
              <label>Your Bike Variant</label>
              <input type="text" value="${activeBike ? activeBike.brand + ' ' + activeBike.model + ' ' + activeBike.variant : 'Motorcycle'}" readonly />
            </div>
            <div class="form-group">
              <label for="fitmentIssueType">Issue Encountered</label>
              <select id="fitmentIssueType" required>
                <option value="bolt-alignment">Bolt Holes Do Not Align</option>
                <option value="clearance">Clearance Issue with Tank/Fairing</option>
                <option value="missing-bracket">Missing Adapter Bracket</option>
                <option value="wrong-sku">Received Wrong SKU Variant</option>
              </select>
            </div>
            <div class="form-group">
              <label for="fitmentDetails">Detailed Explanation</label>
              <textarea id="fitmentDetails" rows="3" placeholder="Describe where it failed to mount..." required></textarea>
            </div>
            <button type="submit" class="accent-button full-width-btn">Submit Fitment Claim</button>
          </form>
        </div>
      </div>
    `;

    modal.classList.add("show");
    window.HRz.Utils.setupModalAccessibility(modal, () => modal.classList.remove("show"));

    document.getElementById("closeReportModal").onclick = () => modal.classList.remove("show");

    document.getElementById("fitmentReportForm").onsubmit = (e) => {
      e.preventDefault();
      modal.classList.remove("show");
      window.HRz.Utils.showToast("Fitment report submitted. Our technical team will reach out within 2 hours with a return waybill.", "success");
    };
  }
}

window.HRz.Product = ProductDetailView;
