/* =============================================
   HRz PITSTOP – Shopping Cart Drawer & Shipping Progress Module
   Adapted for editorial design drawer
   ============================================= */

window.HRz = window.HRz || {};

const FREE_SHIPPING_THRESHOLD = 2999;

class CartDrawer {
  static init() {
    this.bindEvents();
    this.updateCartBadge();
  }

  static bindEvents() {
    const openBtn = document.getElementById("openCartBtn");
    const closeBtn = document.getElementById("closeCartBtn");
    const overlay = document.getElementById("overlay");

    if (openBtn) openBtn.onclick = () => this.openCart();
    if (closeBtn) closeBtn.onclick = () => this.closeCart();

    window.addEventListener("hrz:add-to-cart", (e) => {
      const product = e.detail.product;
      const isPrompted = sessionStorage.getItem('hrz_add_to_bag_login_prompted') === 'true';
      const isLoggedIn = window.HRz.Auth && window.HRz.Auth.isLoggedIn();

      if (!isLoggedIn && !isPrompted) {
        sessionStorage.setItem('hrz_add_to_bag_login_prompted', 'true');
        window.HRz.Auth.showLoginPopup(
          () => {
            this.addItem(product);
          },
          () => {
            window.HRz.Utils.showToast("Sign in or guest mode required to add items", "info");
          }
        );
      } else {
        this.addItem(product);
      }
    });
  }

  static openCart() {
    this._openCartDrawer();
  }

  static _openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("overlay");
    if (drawer) {
      drawer.classList.add("open");
      if (overlay) overlay.classList.add("open");
      this.renderCartItems();
      
      if (!window.history.state || !window.history.state.panelOpen) {
        window.history.pushState({ panelOpen: true }, "");
      }
    }
  }

  static closeCart(isPopState = false, skipHistory = false) {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("overlay");
    const wasOpen = drawer && drawer.classList.contains("open");
    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    
    if (wasOpen && !isPopState && window.history.state && window.history.state.panelOpen) {
      if (!skipHistory) {
        window.history.back();
      } else {
        window.history.replaceState({}, "");
      }
    }
  }

  static addItem(product) {
    const cart = window.HRz.Storage.getCart();
    const isFirstItem = cart.length === 0;
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        sku: product.sku,
        quantity: 1
      });
    }

    window.HRz.Storage.setCart(cart);
    this.updateCartBadge();
    
    if (isFirstItem) {
      this.openCart();
    }
    
    window.HRz.Utils.showToast(`Added ${product.name} to bag`, "success");
  }

  static updateQuantity(productId, delta) {
    let cart = window.HRz.Storage.getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
      }
    }

    window.HRz.Storage.setCart(cart);
    this.updateCartBadge();
    this.renderCartItems();
  }

  static updateCartBadge() {
    const cart = window.HRz.Storage.getCart();
    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    // Update all badge locations
    const badge = document.getElementById("cartCountBadge");
    if (badge) badge.textContent = totalCount;

    const drawerCount = document.getElementById("drawerCount");
    if (drawerCount) drawerCount.textContent = totalCount;

    const mobileCount = document.getElementById("mobileCartCount");
    if (mobileCount) mobileCount.textContent = totalCount;
  }

  static renderCartItems() {
    const cart = window.HRz.Storage.getCart();
    const container = document.getElementById("cartDrawerItems");
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const utils = window.HRz.Utils;
    const escapeHTML = utils.escapeHTML;

    const progressText = document.getElementById("shippingProgressText");
    const progressBar = document.getElementById("shippingProgressBar");

    if (progressText && progressBar) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        progressText.innerHTML = `🎉 You've unlocked <strong>FREE PAN-India Express Shipping!</strong>`;
        progressBar.style.width = "100%";
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        progressText.innerHTML = `Add <strong>${utils.formatCurrency(remaining)}</strong> more for FREE Shipping!`;
        progressBar.style.width = `${pct}%`;
      }
    }

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `<p class="empty-state">Your bag is ready when you are.</p>`;
    } else {
      container.innerHTML = cart.map(item => `
        <div class="cart-item-row">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.src='images/helmet_product.png'" />
          <div class="cart-item-info">
            <small class="cart-item-sku">${escapeHTML(item.sku || "Accessory")}</small>
            <h4 class="cart-item-title">${escapeHTML(item.name)}</h4>
            <b class="cart-item-price">${utils.formatCurrency(item.price)}</b>
            <div class="cart-qty-controls">
              <button class="qty-btn minus-qty" data-id="${item.id}">−</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn plus-qty" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="remove-cart-item-btn" data-id="${item.id}" aria-label="Remove">×</button>
        </div>
      `).join("");
    }

    const subtotalEl = document.getElementById("cartSubtotalText");
    if (subtotalEl) subtotalEl.textContent = utils.formatCurrency(subtotal);

    container.querySelectorAll(".minus-qty").forEach(btn => {
      btn.onclick = () => this.updateQuantity(btn.dataset.id, -1);
    });

    container.querySelectorAll(".plus-qty").forEach(btn => {
      btn.onclick = () => this.updateQuantity(btn.dataset.id, 1);
    });

    container.querySelectorAll(".remove-cart-item-btn").forEach(btn => {
      btn.onclick = () => this.updateQuantity(btn.dataset.id, -999);
    });

    const checkoutBtn = document.getElementById("cartCheckoutBtn");
    if (checkoutBtn) {
      checkoutBtn.disabled = cart.length === 0;
      checkoutBtn.onclick = () => {
        if (window.HRz.Auth && !window.HRz.Auth.isLoggedIn()) {
          window.HRz.Auth.showLoginPopup(() => {
            this.closeCart(false, true);
            window.location.hash = "checkout";
          });
        } else {
          this.closeCart(false, true);
          window.location.hash = "checkout";
        }
      };
    }
  }
}

window.HRz.Cart = CartDrawer;
