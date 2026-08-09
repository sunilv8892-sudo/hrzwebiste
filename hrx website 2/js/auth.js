/* =============================================
   HRz PITSTOP – Auth Module
   Demo Google Login + Login Popup Gate
   ============================================= */

window.HRz = window.HRz || {};

const AUTH_KEY = "hrz_auth_user_v1";

const DEMO_GOOGLE_ACCOUNTS = [
  { id: "g_001", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", avatar: "RS" },
  { id: "g_002", name: "Priya Mehra",  email: "priya.mehra@gmail.com",  avatar: "PM" },
  { id: "g_003", name: "Arun Verma",   email: "arun.verma@gmail.com",   avatar: "AV" },
];

class AuthService {

  static getUser() {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  static setUser(user) {
    try { sessionStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch {}
  }

  static isLoggedIn() { return !!this.getUser(); }

  static logout() {
    sessionStorage.removeItem(AUTH_KEY);
    this._refreshHeaderAvatar();
    window.HRz.Utils.showToast("Signed out successfully", "info");
  }

  /* ------ Login Popup ------ */
  static showLoginPopup(onSuccess, onCancel) {
    const existing = document.getElementById("hrzLoginPopup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "hrzLoginPopup";
    popup.innerHTML = `
      <div class="login-popup-backdrop" id="loginPopupBackdrop"></div>
      <div class="login-popup-card" role="dialog" aria-modal="true">
        <button class="login-popup-close" id="loginPopupClose" aria-label="Close">&#x2715;</button>

        <div class="login-popup-logo">
          <img src="images/HRZ_BIKE_LOGO_page-0001-removebg-preview (3)_20250705_182254_0000.png" alt="HRz Logo" style="height: 38px; width: auto; object-fit: contain;" />
          <span>HRz Pitstop</span>
        </div>

        <h2 class="login-popup-title">Sign in to proceed</h2>
        <p class="login-popup-sub">Access your cart, wishlist &amp; verified bike fitments.</p>

        <button class="login-google-btn" id="loginGoogleBtn">
          <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <button class="login-guest-btn" id="loginGuestBtn">
          Continue as Guest
        </button>

        <p class="login-popup-legal">By continuing you agree to our <a href="#help">Terms</a> &amp; <a href="#help">Privacy Policy</a>.</p>
      </div>
    `;
    document.body.appendChild(popup);

    requestAnimationFrame(() => popup.classList.add("active"));

    const close = (wasSuccess = false) => {
      popup.classList.remove("active");
      setTimeout(() => popup.remove(), 320);
      if (wasSuccess) {
        if (typeof onSuccess === "function") onSuccess();
      } else {
        if (typeof onCancel === "function") onCancel();
      }
    };

    popup.querySelector("#loginPopupClose").onclick = () => close(false);
    popup.querySelector("#loginPopupBackdrop").onclick = () => close(false);
    popup.querySelector("#loginGuestBtn").onclick = () => close(true);

    popup.querySelector("#loginGoogleBtn").onclick = () => {
      this._login(DEMO_GOOGLE_ACCOUNTS[0], popup, onSuccess);
    };

    const onKey = (e) => {
      if (e.key === "Escape") { close(false); document.removeEventListener("keydown", onKey); }
    };
    document.addEventListener("keydown", onKey);
  }

  static _login(account, popup, onSuccess) {
    popup.classList.remove("active");
    setTimeout(() => popup.remove(), 320);
    this.setUser(account);
    this._refreshHeaderAvatar();
    window.HRz.Utils.showToast("Welcome, " + account.name + "!", "success");
    if (typeof onSuccess === "function") onSuccess(account);
  }

  /* ------ Header Avatar ------ */
  static _refreshHeaderAvatar() {
    const user = this.getUser();
    let btn = document.getElementById("hrzHeaderAvatar");

    if (user) {
      if (!btn) {
        btn = document.createElement("button");
        btn.id = "hrzHeaderAvatar";
        btn.className = "hrz-user-avatar-btn";
        btn.onclick = () => this._showUserMenu();
        const navActions = document.querySelector(".nav-actions");
        if (navActions) navActions.prepend(btn);
      }
      btn.textContent = user.avatar;
      btn.title = user.name;
    } else {
      if (btn) btn.remove();
    }
  }

  static _showUserMenu() {
    const user = this.getUser();
    if (!user) return;

    const existing = document.getElementById("hrzUserMenu");
    if (existing) { existing.remove(); return; }

    const menu = document.createElement("div");
    menu.id = "hrzUserMenu";
    menu.className = "hrz-user-menu";
    menu.innerHTML = `
      <div class="user-menu-header">
        <span class="user-menu-avatar">${user.avatar}</span>
        <div>
          <strong>${user.name}</strong>
          <small>${user.email}</small>
        </div>
      </div>
      <hr class="user-menu-divider"/>
      <a href="#tracking" class="user-menu-item">My Orders</a>
      <a href="#wishlist" class="user-menu-item">Wishlist</a>
      <a href="#garage" class="user-menu-item">My Garage</a>
      <hr class="user-menu-divider"/>
      <button class="user-menu-item user-menu-signout" id="umSignout">Sign Out</button>
    `;
    document.body.appendChild(menu);

    menu.querySelector("#umSignout").onclick = () => { menu.remove(); this.logout(); };
    menu.querySelectorAll("a.user-menu-item").forEach(a => a.addEventListener("click", () => menu.remove()));

    const outside = (e) => {
      if (!menu.contains(e.target) && e.target.id !== "hrzHeaderAvatar") {
        menu.remove();
        document.removeEventListener("click", outside);
      }
    };
    setTimeout(() => document.addEventListener("click", outside), 50);
  }

  static init() { this._refreshHeaderAvatar(); }
}

window.HRz.Auth = AuthService;
