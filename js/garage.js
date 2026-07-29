/* =============================================
   HRz PITSTOP – Garage & Bike Selector Module
   ============================================= */

window.HRz = window.HRz || {};

class GarageManager {
  static init(onBikeChangedCallback) {
    this.onBikeChanged = onBikeChangedCallback;
    this.updateActiveBikeUI();
    this.bindEvents();
  }

  static updateActiveBikeUI() {
    const activeBike = window.HRz.Storage.getActiveBike();
    const chipInfo = document.getElementById("activeBikeChip");
    
    if (chipInfo) {
      if (activeBike) {
        chipInfo.innerHTML = `
          <strong>${activeBike.brand} ${activeBike.model}</strong>
          <small>${activeBike.variant || ""} (${activeBike.year || ""})</small>
        `;
      } else {
        chipInfo.innerHTML = `
          <strong>Select Your Bike</strong>
          <small>Filter by model</small>
        `;
      }
    }
  }

  static bindEvents() {
    const openBtn = document.getElementById("openBikeModal");
    if (openBtn) {
      openBtn.onclick = () => this.openBikeModal();
    }
  }

  static openBikeModal() {
    let modal = document.getElementById("bikeSelectorModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "bikeSelectorModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const bikes = window.HRz.DB.getBikes();
    
    const brandsMap = {};
    bikes.forEach(b => {
      if (!brandsMap[b.brand]) brandsMap[b.brand] = {};
      if (!brandsMap[b.brand][b.model]) brandsMap[b.brand][b.model] = [];
      brandsMap[b.brand][b.model].push(b);
    });

    const brands = Object.keys(brandsMap);

    modal.innerHTML = `
      <div class="modal-card bike-selector-card">
        <div class="modal-header">
          <div>
            <p class="eyebrow">Motorcycle Compatibility</p>
            <h3>Select Your Motorcycle</h3>
          </div>
          <button type="button" class="close-btn" id="closeBikeModalBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">Choose your exact make and variant to see guaranteed fitment parts only.</p>
          
          <form id="bikeSelectForm" class="bike-select-form">
            <div class="form-group">
              <label for="selectBrand">1. Select Brand / Make</label>
              <select id="selectBrand" required>
                <option value="">-- Choose Brand --</option>
                ${brands.map(b => `<option value="${b}">${b}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label for="selectModel">2. Select Model</label>
              <select id="selectModel" disabled required>
                <option value="">-- Choose Model --</option>
              </select>
            </div>
            <div class="form-group">
              <label for="selectVariant">3. Select Variant & Year</label>
              <select id="selectVariant" disabled required>
                <option value="">-- Choose Variant --</option>
              </select>
            </div>
            
            <button type="submit" class="accent-button full-width-btn" id="confirmBikeBtn" disabled>
              Set Active Bike & Filter Catalog
            </button>
          </form>

          <div class="quick-presets-section">
            <p class="section-label">Or Pick Popular Presets:</p>
            <div class="presets-grid">
              <button class="preset-chip" data-brand="Royal Enfield" data-model="Himalayan" data-variant="450 Adventure" data-year="2024">
                <strong>Royal Enfield</strong> Himalayan 450
              </button>
              <button class="preset-chip" data-brand="KTM" data-model="Duke" data-variant="390 Gen-3" data-year="2024">
                <strong>KTM</strong> Duke 390
              </button>
              <button class="preset-chip" data-brand="Triumph" data-model="Speed" data-variant="400 Roadster" data-year="2024">
                <strong>Triumph</strong> Speed 400
              </button>
              <button class="preset-chip" data-brand="Yamaha" data-model="MT-15" data-variant="V2 Deluxe" data-year="2024">
                <strong>Yamaha</strong> MT-15
              </button>
              <button class="preset-chip" data-brand="BMW" data-model="G310" data-variant="GS Adventure" data-year="2024">
                <strong>BMW</strong> G310 GS
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("show");
    window.HRz.Utils.setupModalAccessibility(modal, () => this.closeBikeModal());

    const closeBtn = document.getElementById("closeBikeModalBtn");
    if (closeBtn) closeBtn.onclick = () => this.closeBikeModal();

    const brandSel = document.getElementById("selectBrand");
    const modelSel = document.getElementById("selectModel");
    const variantSel = document.getElementById("selectVariant");
    const submitBtn = document.getElementById("confirmBikeBtn");

    brandSel.onchange = () => {
      const selectedBrand = brandSel.value;
      modelSel.innerHTML = `<option value="">-- Choose Model --</option>`;
      variantSel.innerHTML = `<option value="">-- Choose Variant --</option>`;
      variantSel.disabled = true;
      submitBtn.disabled = true;

      if (selectedBrand && brandsMap[selectedBrand]) {
        const models = Object.keys(brandsMap[selectedBrand]);
        models.forEach(m => {
          modelSel.innerHTML += `<option value="${m}">${m}</option>`;
        });
        modelSel.disabled = false;
      } else {
        modelSel.disabled = true;
      }
    };

    modelSel.onchange = () => {
      const selectedBrand = brandSel.value;
      const selectedModel = modelSel.value;
      variantSel.innerHTML = `<option value="">-- Choose Variant --</option>`;
      submitBtn.disabled = true;

      if (selectedBrand && selectedModel && brandsMap[selectedBrand][selectedModel]) {
        const variantsList = brandsMap[selectedBrand][selectedModel];
        variantsList.forEach(v => {
          variantSel.innerHTML += `<option value="${v.id}">${v.variant} (${v.year})</option>`;
        });
        variantSel.disabled = false;
      } else {
        variantSel.disabled = true;
      }
    };

    variantSel.onchange = () => {
      submitBtn.disabled = !variantSel.value;
    };

    document.getElementById("bikeSelectForm").onsubmit = (e) => {
      e.preventDefault();
      const bikeId = variantSel.value;
      const bikeObj = bikes.find(b => b.id === bikeId);
      if (bikeObj) {
        this.selectBike(bikeObj);
      }
    };

    modal.querySelectorAll(".preset-chip").forEach(chip => {
      chip.onclick = () => {
        const { brand, model, variant, year } = chip.dataset;
        const found = bikes.find(b => b.brand === brand && b.model === model && b.variant === variant);
        const targetBike = found || { nickname: `${brand} ${model}`, brand, model, variant, year: parseInt(year), bikeId: `bike-${brand.toLowerCase()}` };
        this.selectBike(targetBike);
      };
    });
  }

  static selectBike(bikeObj) {
    const active = window.HRz.Storage.setActiveBike({
      nickname: `${bikeObj.brand} ${bikeObj.model}`,
      brand: bikeObj.brand,
      model: bikeObj.model,
      year: bikeObj.year || 2024,
      variant: bikeObj.variant,
      bikeId: bikeObj.id || `bike-${Date.now()}`
    });

    this.updateActiveBikeUI();
    this.closeBikeModal();
    window.HRz.Utils.showToast(`Active Bike updated to ${active.brand} ${active.model} (${active.variant})`, "success");

    if (this.onBikeChanged) {
      this.onBikeChanged(active);
    }
  }

  static closeBikeModal() {
    const modal = document.getElementById("bikeSelectorModal");
    if (modal) {
      modal.classList.remove("show");
    }
  }

  static renderGarageView(container) {
    const garage = window.HRz.Storage.getGarage();
    const activeBike = window.HRz.Storage.getActiveBike();

    container.innerHTML = `
      <div class="view-header">
        <div>
          <p class="eyebrow">My Fleet & Compatibility</p>
          <h2>My Garage</h2>
        </div>
        <button class="accent-button" id="addNewBikeGarageBtn">+ Add Another Bike</button>
      </div>

      ${garage.length === 0 ? `
        <div class="empty-state-card">
          <div class="empty-icon">🏍️</div>
          <h3>Your Garage is Empty</h3>
          <p>Add your motorcycle to filter crash guards, lights, luggage, and performance parts with guaranteed fitment.</p>
          <button class="accent-button" id="emptyAddBikeBtn">Add Motorcycle Now</button>
        </div>
      ` : `
        <div class="garage-grid">
          ${garage.map(bike => {
            const isActive = activeBike && activeBike.brand === bike.brand && activeBike.model === bike.model && activeBike.variant === bike.variant;
            return `
              <div class="garage-card ${isActive ? "active-garage-card" : ""}">
                <div class="garage-card-header">
                  <span class="bike-badge">${bike.brand}</span>
                  ${isActive ? `<span class="active-tag">Active Vehicle</span>` : ""}
                </div>
                <h3>${bike.brand} ${bike.model}</h3>
                <p class="variant-text">${bike.variant} · Year ${bike.year}</p>
                <div class="garage-card-actions">
                  ${!isActive ? `<button class="secondary-button activate-bike-btn" data-id="${bike.bikeId}">Set Active</button>` : `<span class="active-status-text">✓ Currently Filtering Catalog</span>`}
                  <button class="icon-button remove-bike-btn" data-id="${bike.bikeId}" title="Remove from garage">🗑️</button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `}
    `;

    const addBtn = container.querySelector("#addNewBikeGarageBtn") || container.querySelector("#emptyAddBikeBtn");
    if (addBtn) addBtn.onclick = () => this.openBikeModal();

    container.querySelectorAll(".activate-bike-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const target = garage.find(g => g.bikeId === id);
        if (target) this.selectBike(target);
      };
    });

    container.querySelectorAll(".remove-bike-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        window.HRz.Storage.removeBikeFromGarage(id);
        this.renderGarageView(container);
        this.updateActiveBikeUI();
        window.HRz.Utils.showToast("Bike removed from garage", "info");
      };
    });
  }
}

window.HRz.Garage = GarageManager;
