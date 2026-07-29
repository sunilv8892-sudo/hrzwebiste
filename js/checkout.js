/* =============================================
   HRz PITSTOP – Checkout & Order Placement Module
   ============================================= */

window.HRz = window.HRz || {};

class CheckoutView {
  static render(container) {
    const cart = window.HRz.Storage.getCart();
    const activeBike = window.HRz.Storage.getActiveBike();
    const utils = window.HRz.Utils;

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
                <strong>Active Motorcycle: ${activeBike ? activeBike.brand + " " + activeBike.model + " (" + activeBike.variant + ")" : "Universal"}</strong>
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
              <div class="payment-options-grid">
                <label class="payment-option-card active">
                  <input type="radio" name="payMethod" value="UPI GPay" checked />
                  <div class="pay-option-content">
                    <strong>Instant UPI / GPay / PhonePe</strong>
                    <small>0% Payment Fee · Fastest Dispatch</small>
                  </div>
                </label>
                <label class="payment-option-card">
                  <input type="radio" name="payMethod" value="Credit/Debit Card" />
                  <div class="pay-option-content">
                    <strong>Credit & Debit Cards</strong>
                    <small>Visa, Mastercard, RuPay, Amex</small>
                  </div>
                </label>
                <label class="payment-option-card">
                  <input type="radio" name="payMethod" value="Cash On Delivery" />
                  <div class="pay-option-content">
                    <strong>Cash On Delivery (COD)</strong>
                    <small>Pay cash upon delivery to courier</small>
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
                  <img src="${item.image}" alt="${item.name}" loading="lazy" />
                  <div class="info">
                    <strong>${item.name}</strong>
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
        const address = container.querySelector("#checkAddress").value;
        const city = container.querySelector("#checkCity").value;

        const newOrder = {
          id: "HRZ-ORD-" + Math.floor(10000 + Math.random() * 90000),
          date: new Date().toISOString().split("T")[0],
          bike: activeBike ? `${activeBike.brand} ${activeBike.model} (${activeBike.variant})` : "Universal",
          status: "Processing & Fitment Checked",
          trackingId: "DTDC-IN-" + Math.floor(100000 + Math.random() * 900000),
          items: cart,
          total: grandTotal,
          paymentMethod: payMethod,
          shippingAddress: `${address}, ${city}`
        };

        window.HRz.Storage.setCart([]);
        const db = window.HRz.DB;
        db.orders.unshift(newOrder);
        db._persist();

        utils.showToast("Order Placed Successfully!", "success");
        this.renderSuccessView(container, newOrder);
      };
    }
  }

  static renderSuccessView(container, order) {
    container.innerHTML = `
      <div class="order-success-card">
        <div class="success-icon">🎉</div>
        <h2>Order Confirmed & Fitment Verified!</h2>
        <p class="order-number">Order ID: <strong>${order.id}</strong> · Tracking ID: <strong>${order.trackingId}</strong></p>
        <p>Thank you for shopping at HRz Pitstop. Our technicians have verified that all ordered parts fit your <strong>${order.bike}</strong>.</p>
        
        <div class="success-actions">
          <button class="accent-button" onclick="window.location.hash='tracking'">Track Order Status</button>
          <button class="secondary-button" onclick="window.location.hash='catalog'">Continue Shopping</button>
        </div>
      </div>
    `;
  }
}

window.HRz.Checkout = CheckoutView;
