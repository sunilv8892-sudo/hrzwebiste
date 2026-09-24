/* =============================================
   HRz PITSTOP – Checkout & Order Placement Module
   ============================================= */

window.HRz = window.HRz || {};

class CheckoutView {
  static render(container) {
    const cart = window.HRz.Storage.getCart();
    const activeBike = window.HRz.Storage.getActiveBike();
    const utils = window.HRz.Utils;
    const escapeHTML = utils.escapeHTML;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon">🛒</div>
          <h3>Your Bag is Empty</h3>
          <p>Please add items to your cart before proceeding to checkout.</p>
          <button class="accent-button" onclick="window.location.hash='catalog'">Browse Accessories</button>
        </div>
      `;
      return;
    }

    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const shippingFee = subtotal >= 2999 ? 0 : 199;
    const grandTotal = subtotal + shippingFee;

    container.innerHTML = `
      <div class="breadcrumb-trail">
        <a href="#home">Home</a> / <a href="#catalog">Catalog</a> / <span class="current">Checkout</span>
      </div>

      <div class="checkout-layout">
        <!-- Form Column -->
        <div class="checkout-form-column">
          <div class="form-section-card">
            <h3>1. Verified Bike Fitment Guarantee</h3>
            <div class="checkout-bike-banner">
              <span>🏍️</span>
              <div>
                <strong>Active Motorcycle: ${activeBike ? escapeHTML(activeBike.brand) + " " + escapeHTML(activeBike.model) + " (" + escapeHTML(activeBike.variant) + ")" : "Universal"}</strong>
                <p>All ${cart.length} items in your order are covered by our 7-Day Fitment Guarantee.</p>
              </div>
            </div>
          </div>

          <form id="checkoutForm" class="checkout-form">
            <div class="form-section-card">
              <h3>2. Delivery & Shipping Address</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="checkFullName">Full Name *</label>
                  <input type="text" id="checkFullName" required placeholder="e.g. Vikramaditya Sharma" />
                </div>
                <div class="form-group">
                  <label for="checkPhone">Mobile Phone *</label>
                  <input type="tel" id="checkPhone" required placeholder="+91 98765 43210" pattern="[0-9+ ]{10,14}" />
                </div>
                <div class="form-group full-width">
                  <label for="checkAddress">Street Address & Landmark *</label>
                  <input type="text" id="checkAddress" required placeholder="House/Flat No, Street, Landmark" />
                </div>
                <div class="form-group">
                  <label for="checkCity">City *</label>
                  <input type="text" id="checkCity" required placeholder="Bengaluru" />
                </div>
                <div class="form-group">
                  <label for="checkPincode">PIN Code *</label>
                  <input type="text" id="checkPincode" required placeholder="560102" pattern="[0-9]{6}" />
                </div>
              </div>
            </div>

            <div class="form-section-card">
              <h3>3. Payment Method</h3>
              <p style="font-size: 0.9em; color: #666; margin-bottom: 12px;">Payment will be securely processed via WhatsApp after confirming your order details.</p>
              <div class="payment-options-grid">
                <label class="payment-option-card active">
                  <input type="radio" name="payMethod" value="UPI GPay" checked />
                  <div class="pay-option-content">
                    <strong>UPI / GPay / PhonePe</strong>
                    <small>Confirm details with us on WhatsApp</small>
                  </div>
                </label>
                <label class="payment-option-card">
                  <input type="radio" name="payMethod" value="Credit/Debit Card" />
                  <div class="pay-option-content">
                    <strong>Credit & Debit Cards</strong>
                    <small>Confirm details with us on WhatsApp</small>
                  </div>
                </label>
                <label class="payment-option-card">
                  <input type="radio" name="payMethod" value="Cash On Delivery" />
                  <div class="pay-option-content">
                    <strong>Cash On Delivery (COD)</strong>
                    <small>Confirm details with us on WhatsApp</small>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" class="accent-button full-width-btn place-order-btn">
              Place Order (${utils.formatCurrency(grandTotal)})
            </button>
          </form>
        </div>

        <!-- Summary Column -->
        <div class="checkout-summary-column">
          <div class="summary-card">
            <h3>Order Summary (${cart.length} items)</h3>
            <div class="summary-items-list">
              ${cart.map(item => `
                <div class="summary-item-row">
                  <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" />
                  <div class="info">
                    <strong>${escapeHTML(item.name)}</strong>
                    <small>Qty: ${item.quantity}</small>
                  </div>
                  <span class="price">${utils.formatCurrency(item.price * item.quantity)}</span>
                </div>
              `).join("")}
            </div>

            <div class="summary-calc-list">
              <div class="calc-row">
                <span>Subtotal</span>
                <span>${utils.formatCurrency(subtotal)}</span>
              </div>
              <div class="calc-row">
                <span>Express Shipping</span>
                <span>${shippingFee === 0 ? "<strong class='free-tag'>FREE</strong>" : utils.formatCurrency(shippingFee)}</span>
              </div>
              <div class="calc-row grand-total-row">
                <span>Grand Total</span>
                <span>${utils.formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = container.querySelector("#checkoutForm");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const payMethod = form.querySelector("input[name='payMethod']:checked").value;
        const name = container.querySelector("#checkFullName").value;
        const phone = container.querySelector("#checkPhone").value;
        const address = container.querySelector("#checkAddress").value;
        const city = container.querySelector("#checkCity").value;
        const pincode = container.querySelector("#checkPincode").value;

        const bikeStr = activeBike ? `${activeBike.brand} ${activeBike.model} (${activeBike.variant})` : "Universal";

        const newOrder = {
          id: "HRZ-ORD-" + Math.floor(10000 + Math.random() * 90000),
          date: new Date().toISOString().split("T")[0],
          bike: bikeStr,
          status: "Pending WhatsApp Confirmation",
          items: cart,
          total: grandTotal,
          paymentMethod: payMethod,
          shippingAddress: `${address}, ${city}`
        };

        let waText = `Hello HRz PITSTOP! I would like to place an order.\n\n`;
        waText += `*Customer:* ${name}\n`;
        waText += `*Phone:* ${phone}\n`;
        waText += `*Address:* ${address}, ${city} - ${pincode}\n`;
        waText += `*Payment:* ${payMethod}\n`;
        waText += `*Bike Fitment:* ${bikeStr}\n\n`;
        waText += `*Order Details:*\n`;
        cart.forEach((item, index) => {
          waText += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ${utils.formatCurrency(item.price * item.quantity)}\n`;
          if (item.sku) waText += `   SKU: ${item.sku}\n`;
        });
        waText += `\n*Grand Total:* ${utils.formatCurrency(grandTotal)}`;

        const waUrl = `https://wa.me/7019348327?text=${encodeURIComponent(waText)}`;

        // Attempt to open WhatsApp first
        const popup = window.open(waUrl, "_blank");

        // Regardless of popup success, save the order locally and clear cart
        window.HRz.Storage.setCart([]);
        if (window.HRz.Cart && typeof window.HRz.Cart.updateCartBadge === 'function') {
          window.HRz.Cart.updateCartBadge();
        }
        const db = window.HRz.DB;
        db.orders.unshift(newOrder);
        db._persist();

        if (popup) {
          utils.showToast("Redirecting to WhatsApp to finalize your order...", "success");
          this.renderSuccessView(container, newOrder);
        } else {
          utils.showToast("Popup blocked! Please click the button to continue to WhatsApp.", "error");
          container.innerHTML = `
            <div class="order-success-card">
              <h2>Complete Your Order via WhatsApp</h2>
              <p>Your browser blocked the automatic redirect. Please click the button below to send your order details to us on WhatsApp.</p>
              <a href="${waUrl}" target="_blank" class="accent-button" style="display:inline-block; margin-top:20px; text-decoration:none;">Open WhatsApp</a>
            </div>
          `;
        }
      };
    }
  }

  static renderSuccessView(container, order) {
    const escapeHTML = window.HRz.Utils.escapeHTML;
    container.innerHTML = `
      <div class="order-success-card">
        <div class="success-icon">💬</div>
        <h2>Order Request Recorded!</h2>
        <p class="order-number">Order ID: <strong>${escapeHTML(order.id)}</strong></p>
        <p>Your order details have been drafted. We will finalize stock, shipping, and payment directly on WhatsApp.</p>
        
        <div class="success-actions">
          <button class="accent-button" onclick="window.location.hash='tracking'">Track Order Status</button>
          <button class="secondary-button" onclick="window.location.hash='catalog'">Continue Shopping</button>
        </div>
      </div>
    `;
  }
}

window.HRz.Checkout = CheckoutView;
