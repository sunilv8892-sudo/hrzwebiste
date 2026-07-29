/* =============================================
   HRz PITSTOP – LocalStorage & State Synchronization Module
   ============================================= */

window.HRz = window.HRz || {};

const STORAGE_KEY = "hrz_pitstop_app_state_v8";

const defaultState = {
  activeBike: {
    nickname: "Expedition Himalayan 450",
    brand: "Royal Enfield",
    model: "Himalayan",
    year: 2024,
    variant: "450 Adventure",
    bikeId: "bike-re-him-450-adv"
  },
  garage: [
    {
      nickname: "Expedition Himalayan 450",
      brand: "Royal Enfield",
      model: "Himalayan",
      year: 2024,
      variant: "450 Adventure",
      bikeId: "bike-re-him-450-adv"
    },
    {
      nickname: "Track Duke 390",
      brand: "KTM",
      model: "Duke",
      year: 2024,
      variant: "390 Gen-3",
      bikeId: "bike-ktm-duke-390-g3"
    }
  ],
  cart: [],
  wishlist: [],
  appliedCoupon: null,
  fitmentReports: [],
  adminRole: "Admin",
  heroBanner: {
    badge: "MONSOON RIDER OFFER · FLAT ₹500 OFF",
    title: "Guaranteed Fitment & Heavy Protection Parts",
    subtitle: "Select your bike model to automatically filter crash guards, LED lights, helmets, and touring gear engineered specifically for your ride.",
    bgImage: "images/hero_banner.jpg",
    buttonText: "Explore Offers & Parts",
    buttonTarget: "catalog"
  },
  auditLogs: [
    { id: "log-1", timestamp: new Date(Date.now() - 3600000).toISOString(), user: "Admin (Sunil)", action: "Updated Hero Banner Offer to Monsoon Sale" },
    { id: "log-2", timestamp: new Date(Date.now() - 7200000).toISOString(), user: "Moderator", action: "Approved review for HRz Expedition Heavy Crash Guard" }
  ]
};

class StorageService {
  static loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveState(defaultState);
        return { ...defaultState };
      }
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed, heroBanner: { ...defaultState.heroBanner, ...(parsed.heroBanner || {}) } };
    } catch (e) {
      console.error("Failed to load local storage state:", e);
      return { ...defaultState };
    }
  }

  static saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }

  static getActiveBike() {
    return this.loadState().activeBike;
  }

  static setActiveBike(bikeObj) {
    const state = this.loadState();
    state.activeBike = bikeObj;
    
    const exists = state.garage.some(
      b => b.brand === bikeObj.brand && b.model === bikeObj.model && b.variant === bikeObj.variant && b.year === bikeObj.year
    );
    if (!exists) {
      state.garage.push(bikeObj);
    }
    this.saveState(state);
    return state.activeBike;
  }

  static getGarage() {
    return this.loadState().garage || [];
  }

  static removeBikeFromGarage(bikeId) {
    const state = this.loadState();
    state.garage = state.garage.filter(b => b.bikeId !== bikeId);
    if (state.activeBike && state.activeBike.bikeId === bikeId) {
      state.activeBike = state.garage[0] || null;
    }
    this.saveState(state);
  }

  static getCart() {
    return this.loadState().cart || [];
  }

  static setCart(cartArray) {
    const state = this.loadState();
    state.cart = cartArray;
    this.saveState(state);
  }

  static getWishlist() {
    return this.loadState().wishlist || [];
  }

  static toggleWishlist(productId) {
    const state = this.loadState();
    const idx = state.wishlist.indexOf(productId);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
    } else {
      state.wishlist.push(productId);
    }
    this.saveState(state);
    return idx === -1;
  }

  static getHeroBanner() {
    return this.loadState().heroBanner;
  }

  static setHeroBanner(bannerData) {
    const state = this.loadState();
    state.heroBanner = { ...state.heroBanner, ...bannerData };
    this.saveState(state);
    this.addAuditLog("Updated Hero Promo Banner via CMS");
    return state.heroBanner;
  }

  static addAuditLog(actionText, userName = "Admin") {
    const state = this.loadState();
    state.auditLogs.unshift({
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      user: userName,
      action: actionText
    });
    this.saveState(state);
  }

  static getAuditLogs() {
    return this.loadState().auditLogs || [];
  }
}

window.HRz.Storage = StorageService;
