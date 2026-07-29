/* =============================================
   HRz PITSTOP – Complete Production Web Application
   Expanded Motorcycle Catalog & Multi-Bike Garage
   ============================================= */

const STORAGE_KEY = "hrz-pitstop-state-v6";

/* ---- Expanded Motorcycle Database (50+ Models Across 12 Brands) ---- */
const bikeCatalog = {
  "Royal Enfield": {
    "Himalayan": { years: [2022, 2023, 2024, 2025], variants: ["450 Adventure", "450 Summit", "411 Scram", "411 Trail"] },
    "Hunter": { years: [2022, 2023, 2024, 2025], variants: ["350 Metro", "350 Retro", "350 Dapper"] },
    "Classic": { years: [2021, 2022, 2023, 2024, 2025], variants: ["350 Reborn", "350 Signals", "350 Dark Series"] },
    "Bullet": { years: [2022, 2023, 2024, 2025], variants: ["350 Next-Gen", "350 Standard", "350 ES"] },
    "Meteor": { years: [2021, 2022, 2023, 2024, 2025], variants: ["350 Fireball", "350 Stellar", "350 Supernova"] },
    "Interceptor": { years: [2020, 2021, 2022, 2023, 2024, 2025], variants: ["650 Twin", "650 Custom", "650 Sunset Strip"] },
    "Continental GT": { years: [2020, 2021, 2022, 2023, 2024, 2025], variants: ["650 Apex Grey", "650 Mr Clean", "650 Standard"] },
    "Super Meteor": { years: [2023, 2024, 2025], variants: ["650 Astral", "650 Celestial", "650 Interstellar"] },
    "Guerrilla": { years: [2024, 2025], variants: ["450 Analogue", "450 Dash", "450 Flash"] },
    "Shotgun": { years: [2024, 2025], variants: ["650 Custom", "650 Icon Edition"] },
  },
  KTM: {
    Duke: { years: [2020, 2021, 2022, 2023, 2024, 2025], variants: ["390 Gen-3", "390 Gen-2", "250 Duke", "200 Duke"] },
    Adventure: { years: [2021, 2022, 2023, 2024, 2025], variants: ["390 Rally", "390 SW", "390 Standard", "250 ADV", "390 X"] },
    RC: { years: [2021, 2022, 2023, 2024, 2025], variants: ["390 GP Edition", "390 Standard", "200 BS6"] },
  },
  Yamaha: {
    "MT-15": { years: [2021, 2022, 2023, 2024, 2025], variants: ["V2 Deluxe", "V2 Standard", "Monster Energy Edition"] },
    "R15": { years: [2021, 2022, 2023, 2024, 2025], variants: ["V4 Metallic", "M Performance", "V3 Darknight"] },
    "FZ-S": { years: [2022, 2023, 2024, 2025], variants: ["V4 Deluxe", "V3 Fi"] },
    "FZ-X": { years: [2022, 2023, 2024, 2025], variants: ["Matte Copper", "Dark Matte Blue"] },
    "Aerox": { years: [2022, 2023, 2024, 2025], variants: ["155 S-Version", "155 Standard"] },
  },
  TVS: {
    "Apache": { years: [2020, 2021, 2022, 2023, 2024, 2025], variants: ["RR310 BTO", "RTR 310", "RTR 200 4V", "RTR 160 4V"] },
    "Ronin": { years: [2022, 2023, 2024, 2025], variants: ["225 Triple Tone", "225 Dual Tone", "225 Single Tone"] },
    "Raider": { years: [2022, 2023, 2024, 2025], variants: ["125 iGO", "125 SSE", "125 Disc"] },
  },
  Honda: {
    CB350: { years: [2021, 2022, 2023, 2024, 2025], variants: ["DLX Pro", "H'ness Anniversary", "Legacy Edition"] },
    CB350RS: { years: [2021, 2022, 2023, 2024, 2025], variants: ["Hue Edition", "Dual Tone"] },
    CB200X: { years: [2022, 2023, 2024, 2025], variants: ["Urban Explorer"] },
    NX500: { years: [2024, 2025], variants: ["Adventure Touring"] },
    Hornet: { years: [2022, 2023, 2024, 2025], variants: ["2.0 Repsol Edition", "2.0 Standard"] },
  },
  Bajaj: {
    Dominar: { years: [2020, 2021, 2022, 2023, 2024, 2025], variants: ["400 Touring Factory", "250 Urban Touring"] },
    Pulsar: { years: [2021, 2022, 2023, 2024, 2025], variants: ["N250 Dual ABS", "NS200 USD Edition", "N160 Fi", "F250"] },
    Avenger: { years: [2021, 2022, 2023, 2024, 2025], variants: ["220 Cruise", "220 Street", "160 Street"] },
  },
  BMW: {
    "G310": { years: [2020, 2021, 2022, 2023, 2024, 2025], variants: ["GS Adventure", "R Roadster", "GS Rallye"] },
    "F850": { years: [2021, 2022, 2023, 2024, 2025], variants: ["GS Adventure Pro"] },
    "S1000": { years: [2021, 2022, 2023, 2024, 2025], variants: ["RR M Package", "RR Standard"] },
    "R1250": { years: [2021, 2022, 2023, 2024, 2025], variants: ["GS Trophy", "GS Option 719"] },
  },
  Triumph: {
    Speed: { years: [2023, 2024, 2025], variants: ["400 Roadster", "Scrambler 400X"] },
    "Street Triple": { years: [2021, 2022, 2023, 2024, 2025], variants: ["765 RS", "765 R"] },
    Tiger: { years: [2021, 2022, 2023, 2024, 2025], variants: ["900 Rally Pro", "900 GT Pro", "1200 Rally Explorer"] },
  },
  Kawasaki: {
    Ninja: { years: [2020, 2021, 2022, 2023, 2024, 2025], variants: ["300 KRT", "400 Standard", "500 SE", "ZX-6R", "ZX-10R"] },
    Z900: { years: [2021, 2022, 2023, 2024, 2025], variants: ["Metallic Spark Black", "50th Anniversary"] },
    Versys: { years: [2021, 2022, 2023, 2024, 2025], variants: ["650 Grand Tourer", "1000 SE"] },
  },
  Suzuki: {
    "V-Strom": { years: [2022, 2023, 2024, 2025], variants: ["SX 250 Yellow", "SX 250 Black"] },
    Gixxer: { years: [2021, 2022, 2023, 2024, 2025], variants: ["SF 250 MotoGP", "250 Naked", "SF 150"] },
    Hayabusa: { years: [2021, 2022, 2023, 2024, 2025], variants: ["1300 Metallic Matte", "1300 Celebration"] },
  },
  Hero: {
    Mavrick: { years: [2024, 2025], variants: ["440 Top Variant", "440 Mid", "440 Base"] },
    Xpulse: { years: [2021, 2022, 2023, 2024, 2025], variants: ["200 4V Pro Rally", "200 4V Standard"] },
    Karizma: { years: [2023, 2024, 2025], variants: ["XMR 210 Iconic Yellow", "XMR 210 Matte Black"] },
  },
  "Jawa / Yezdi": {
    Jawa: { years: [2021, 2022, 2023, 2024, 2025], variants: ["350 Maroon", "350 Chrome", "42 Bobber"] },
    Yezdi: { years: [2022, 2023, 2024, 2025], variants: ["Adventure Ranger Red", "Scrambler Mambo", "Roadster Chrome"] },
  },
};

/* Quick Popular Presets for Instant Selection */
const popularBikePresets = [
  { nickname: "Expedition Himalayan", brand: "Royal Enfield", model: "Himalayan", year: 2024, variant: "450 Adventure", region: "Global" },
  { nickname: "Track Duke 390", brand: "KTM", model: "Duke", year: 2024, variant: "390 Gen-3", region: "India" },
  { nickname: "Hyper MT-15", brand: "Yamaha", model: "MT-15", year: 2024, variant: "V2 Deluxe", region: "India" },
  { nickname: "Triumph Roadster", brand: "Triumph", model: "Speed", year: 2024, variant: "400 Roadster", region: "India" },
  { nickname: "Touring ADV GS", brand: "BMW", model: "G310", year: 2024, variant: "GS Adventure", region: "Global" },
  { nickname: "Apache RR Racing", brand: "TVS", model: "Apache", year: 2024, variant: "RR310 BTO", region: "India" },
  { nickname: "Dominar Factory", brand: "Bajaj", model: "Dominar", year: 2024, variant: "400 Touring Factory", region: "India" },
];

/* ---- Product Database ---- */
const products = [
  {
    id: "axor-helmet",
    name: "Axor Apex Carbon Full Face Helmet",
    category: "Helmets",
    price: 4999,
    originalPrice: 5999,
    image: "images/helmet_product.png",
    gallery: ["images/helmet_product.png", "images/category_helmets.png"],
    rating: 4.9,
    authenticity: "ECE & DOT Certified",
    warranty: "24 months",
    reviewCount: 184,
    ridersInstalled: 92,
    badge: "BESTSELLER",
    inStock: true,
    sku: "HRZ-HLM-01",
    compatibility: [
      { brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-HLM-01" },
      { brand: "KTM", model: "Duke", yearFrom: 2020, yearTo: 2025, variant: "390 Gen-3", region: "India", fitType: "Universal", modified: false, sku: "HRZ-HLM-UNI" },
      { brand: "Triumph", model: "Speed", yearFrom: 2023, yearTo: 2025, variant: "400 Roadster", region: "India", fitType: "Universal", modified: false, sku: "HRZ-HLM-UNI" },
    ],
    highlights: ["Carbon fiber finish with aerodynamic spoiler", "Dual visor system with Pinlock 30 anti-fog lens", "Intercom slot ready for Bluetooth modules", "Weight: 1,350g — Ultralight build"],
  },
  {
    id: "crash-guard-steelmoto",
    name: "HRz Expedition Heavy Engine Crash Guard",
    category: "Protection",
    price: 3899,
    originalPrice: 4499,
    image: "images/crash_guard_product.png",
    gallery: ["images/crash_guard_product.png", "images/category_protection.png"],
    rating: 4.8,
    authenticity: "OEM Custom Engineered",
    warranty: "36 months",
    reviewCount: 142,
    ridersInstalled: 78,
    badge: "HEAVY DUTY",
    inStock: true,
    sku: "HRZ-CG-HIM450",
    compatibility: [
      { brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-CG-HIM450" },
      { brand: "Bajaj", model: "Dominar", yearFrom: 2020, yearTo: 2025, variant: "400 Touring Factory", region: "India", fitType: "OEM", modified: false, sku: "HRZ-CG-DOM400" },
      { brand: "KTM", model: "Adventure", yearFrom: 2021, yearTo: 2025, variant: "390 Rally", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-CG-KTM390" },
    ],
    highlights: ["Seamless cold-drawn steel tube construction", "Replaceable CNC slider bobbins included", "Direct chassis mounting with zero vibration", "Powder coated for corrosion resistance"],
  },
  {
    id: "fog-lights-led",
    name: "HyperBeam 60W Dual LED Fog Light Kit",
    category: "Lights",
    price: 3299,
    originalPrice: 4299,
    image: "images/fog_lights_product.png",
    gallery: ["images/fog_lights_product.png", "images/category_lights.png"],
    rating: 4.9,
    authenticity: "HRz Pro Lighting",
    warranty: "18 months",
    reviewCount: 215,
    ridersInstalled: 110,
    badge: "HIGH INTENSITY",
    inStock: true,
    sku: "HRZ-FOG-60W",
    compatibility: [
      { brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-FOG-60W" },
      { brand: "KTM", model: "Adventure", yearFrom: 2021, yearTo: 2025, variant: "390 Rally", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-FOG-KTM" },
      { brand: "BMW", model: "G310", yearFrom: 2020, yearTo: 2025, variant: "GS Adventure", region: "Global", fitType: "Universal", modified: false, sku: "HRZ-FOG-UNI" },
    ],
    highlights: ["Dual-color mode: Amber Fog Beam + Crisp White Spot", "IP68 100% Waterproof CNC Aluminum Housing", "Includes handlebar switch harness and waterproof relays", "5000K + 3000K color temperatures"],
  },
  {
    id: "saddlebags-waterproof",
    name: "TourMaster 50L Waterproof Saddlebags",
    category: "Luggage",
    price: 4299,
    originalPrice: 4999,
    image: "images/saddlebags_product.png",
    gallery: ["images/saddlebags_product.png", "images/category_luggage.png"],
    rating: 4.7,
    authenticity: "Touring Certified",
    warranty: "24 months",
    reviewCount: 96,
    ridersInstalled: 45,
    badge: "WATERPROOF",
    inStock: true,
    sku: "HRZ-BAG-50L",
    compatibility: [
      { brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-BAG-50L" },
      { brand: "Royal Enfield", model: "Hunter", yearFrom: 2022, yearTo: 2025, variant: "350 Metro", region: "India", fitType: "Universal", modified: false, sku: "HRZ-BAG-UNI" },
      { brand: "Triumph", model: "Speed", yearFrom: 2023, yearTo: 2025, variant: "Scrambler 400X", region: "India", fitType: "Universal", modified: false, sku: "HRZ-BAG-UNI" },
    ],
    highlights: ["Heavy duty Cordura 1000D fabric with roll-top seal", "3M Scotchlite 360-degree reflective safety bands", "Quick-release heavy duty buckles and heat guard bottom", "Expandable: 40L to 50L capacity"],
  },
  {
    id: "parani-intercom",
    name: "Parani M10 Bluetooth Helmet Intercom",
    category: "Helmets",
    price: 3499,
    originalPrice: 3999,
    image: "images/intercom_product.png",
    gallery: ["images/intercom_product.png", "images/helmet_product.png"],
    rating: 4.8,
    authenticity: "Powered by Sena Technology",
    warranty: "12 months",
    reviewCount: 167,
    ridersInstalled: 84,
    badge: "MESH AUDIO",
    inStock: true,
    sku: "HRZ-COMM-M10",
    compatibility: [
      { brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", fitType: "Universal", modified: false, sku: "HRZ-COMM-M10" },
      { brand: "Yamaha", model: "MT-15", yearFrom: 2021, yearTo: 2025, variant: "V2 Deluxe", region: "India", fitType: "Universal", modified: false, sku: "HRZ-COMM-UNI" },
    ],
    highlights: ["4-Way Intercom communication up to 1km distance", "HD speakers with active noise cancellation", "16 hours continuous talk time", "IP67 water resistant rating"],
  },
  {
    id: "bash-plate-alum",
    name: "Heavy Duty Sump Guard & Bash Plate",
    category: "Protection",
    price: 2799,
    originalPrice: 3299,
    image: "images/bash_plate_product.png",
    gallery: ["images/bash_plate_product.png", "images/crash_guard_product.png"],
    rating: 4.9,
    authenticity: "CNC Laser Cut Aluminum",
    warranty: "24 months",
    reviewCount: 88,
    ridersInstalled: 42,
    badge: "OFF-ROAD",
    inStock: true,
    sku: "HRZ-BP-450",
    compatibility: [
      { brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-BP-450" },
      { brand: "KTM", model: "Adventure", yearFrom: 2021, yearTo: 2025, variant: "390 Rally", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-BP-390" },
    ],
    highlights: ["4mm thick aircraft-grade T6 aluminum plate", "Protects engine crankcase and oil filter from rock hits", "Drain plug cutout for easy oil changes", "CNC laser precision cutting"],
  },
  {
    id: "phone-mount-vibe",
    name: "VibeLock Anti-Vibration Phone Mount",
    category: "Touring",
    price: 1599,
    originalPrice: 1999,
    image: "images/phone_mount_product.png",
    gallery: ["images/phone_mount_product.png", "images/hero_banner.png"],
    rating: 4.9,
    authenticity: "Camera Protection System",
    warranty: "18 months",
    reviewCount: 310,
    ridersInstalled: 160,
    badge: "CAMERA SAFE",
    inStock: true,
    sku: "HRZ-MNT-VIBE",
    compatibility: [
      { brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", fitType: "OEM", modified: false, sku: "HRZ-MNT-VIBE" },
      { brand: "TVS", model: "Apache", yearFrom: 2020, yearTo: 2025, variant: "RTR 200 4V", region: "India", fitType: "Universal", modified: false, sku: "HRZ-MNT-UNI" },
    ],
    highlights: ["Triple silicone dampening system isolates phone OIS", "One-hand quick clamp mechanism", "Fits handlebars from 22mm to 32mm", "360° rotation with secure lock"],
  },
  {
    id: "chain-care-pro",
    name: "HRz Pro Chain Clean & Lube Combo",
    category: "Maintenance",
    price: 799,
    originalPrice: 999,
    image: "images/chain_care_product.png",
    gallery: ["images/chain_care_product.png", "images/category_protection.png"],
    rating: 4.8,
    authenticity: "High Performance Formula",
    warranty: "6 months",
    reviewCount: 420,
    ridersInstalled: 230,
    badge: "ESSENTIAL",
    inStock: true,
    sku: "HRZ-CARE-01",
    compatibility: [
      { brand: "Royal Enfield", model: "Hunter", yearFrom: 2022, yearTo: 2025, variant: "350 Metro", region: "India", fitType: "Universal", modified: false, sku: "HRZ-CARE-01" },
      { brand: "Yamaha", model: "R15", yearFrom: 2021, yearTo: 2025, variant: "V4 Metallic", region: "India", fitType: "Universal", modified: false, sku: "HRZ-CARE-UNI" },
    ],
    highlights: ["500ml Heavy Duty Degreaser + 500ml PTFE Synthetic Lube", "Free 3-sided 360° chain cleaning brush included", "O-Ring, X-Ring, and Z-Ring compatible", "Lasts 2000+ km per application"],
  },
];

/* ---- Initial State Data ---- */
const initialReviews = [
  { id: 1, productId: "axor-helmet", bike: "Royal Enfield Himalayan 450", author: "Rahul Sharma", rating: 5, text: "Top notch helmet! Wind noise is negligible and the visor clarity is optical class 1. Best purchase I've made for my Himalayan.", date: "Jul 2026", verified: true },
  { id: 2, productId: "crash-guard-steelmoto", bike: "Royal Enfield Himalayan 450", author: "Vikramaditya", rating: 5, text: "Saved my bike during a slow drop on a gravel trail. Not a single scratch on engine! The build quality is phenomenal.", date: "Jul 2026", verified: true },
  { id: 3, productId: "fog-lights-led", bike: "KTM Adventure 390", author: "Karan Patel", rating: 5, text: "Extremely bright yellow beam cuts through highway fog like butter. Best purchase for night touring.", date: "Jun 2026", verified: true },
];

const initialBikes = [
  { id: "bike-1", nickname: "Expedition Himalayan", brand: "Royal Enfield", model: "Himalayan", year: 2024, variant: "450 Adventure", region: "Global", modified: false, primary: true },
  { id: "bike-2", nickname: "City Duke", brand: "KTM", model: "Duke", year: 2024, variant: "390 Gen-3", region: "India", modified: false, primary: false },
  { id: "bike-3", nickname: "Track R15", brand: "Yamaha", model: "R15", year: 2024, variant: "V4 Metallic", region: "India", modified: false, primary: false },
];

const initialFitmentRows = [
  { id: 1, brand: "Royal Enfield", model: "Himalayan", yearFrom: 2020, yearTo: 2025, variant: "450 Adventure", region: "Global", sku: "HRZ-CG-HIM450", fitType: "OEM", status: "Verified", updatedBy: "Admin", updatedAt: "2026-07-29" },
  { id: 2, brand: "KTM", model: "Duke", yearFrom: 2020, yearTo: 2025, variant: "390 Gen-3", region: "India", sku: "HRZ-HLM-UNI", fitType: "Universal", status: "Verified", updatedBy: "Catalog", updatedAt: "2026-07-28" },
];

const initialOrders = [
  { id: "HRZ-99201", productId: "axor-helmet", bikeId: "bike-1", status: "Shipped", eta: "30 Jul", fit: "Fits your bike", total: 4999, date: "2026-07-28" },
];

/* ---- State Management ---- */
const state = loadState();
state.activeView = state.activeView || "home";
state.activeProductId = state.activeProductId || products[0].id;
state.activeReviewBike = state.activeReviewBike || "All bikes";
state.activeRole = state.activeRole || "Admin";
state.catalogFilter = state.catalogFilter || "All";
state.catalogSort = state.catalogSort || "featured";
state.catalogSearch = state.catalogSearch || "";
state.cart = state.cart || [{ productId: "axor-helmet", qty: 1 }];
state.bikes = state.bikes?.length ? state.bikes : initialBikes;
state.fitmentRows = state.fitmentRows?.length ? state.fitmentRows : initialFitmentRows;
state.reviews = state.reviews?.length ? state.reviews : initialReviews;
state.orders = state.orders?.length ? state.orders : initialOrders;
state.wishlist = state.wishlist || [];
state.couponCode = state.couponCode || "";
state.couponDiscount = state.couponDiscount || 0;
state.lastPlacedOrder = state.lastPlacedOrder || null;

setPrimaryBike();

/* ---- DOM Nodes ---- */
const nodes = {
  app: document.getElementById("app"),
  navButtons: [...document.querySelectorAll(".nav-pill, .mobile-nav-btn[data-view]")],
  activeBikeChip: document.getElementById("activeBikeChip"),
  openBikeModal: document.getElementById("openBikeModal"),
  bikeDialog: document.getElementById("bikeDialog"),
  bikeForm: document.getElementById("bikeForm"),
  bikeNicknameInput: document.getElementById("bikeNicknameInput"),
  bikeBrand: document.getElementById("bikeBrand"),
  bikeModel: document.getElementById("bikeModel"),
  bikeYear: document.getElementById("bikeYear"),
  bikeVariant: document.getElementById("bikeVariant"),
  policyDialog: document.getElementById("policyDialog"),
  reviewDialog: document.getElementById("reviewDialog"),
  reviewForm: document.getElementById("reviewForm"),
  backToTop: document.getElementById("backToTop"),
  toast: document.getElementById("toastNotification"),
  toastMsg: document.getElementById("toastMessage"),
  searchPop: document.getElementById("searchAutocomplete"),
  mobileCartBadge: document.getElementById("mobileCartBadge"),
  quickPresetsContainer: document.getElementById("quickPresetsContainer"),
};

/* ---- Utility Functions ---- */
function loadState() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {}; }
  catch { return {}; }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    bikes: state.bikes, fitmentRows: state.fitmentRows, reviews: state.reviews, orders: state.orders,
    activeView: state.activeView, activeProductId: state.activeProductId,
    activeReviewBike: state.activeReviewBike, activeRole: state.activeRole,
    catalogFilter: state.catalogFilter, catalogSort: state.catalogSort, catalogSearch: state.catalogSearch,
    cart: state.cart, wishlist: state.wishlist, couponCode: state.couponCode,
    couponDiscount: state.couponDiscount, lastPlacedOrder: state.lastPlacedOrder,
  }));
}

function setPrimaryBike() {
  if (!state.bikes.some(b => b.primary) && state.bikes.length) state.bikes[0].primary = true;
  if (!state.activeBikeId && state.bikes.length) {
    state.activeBikeId = (state.bikes.find(b => b.primary) || state.bikes[0]).id;
  }
}

function currentBike() { return state.bikes.find(b => b.id === state.activeBikeId) || state.bikes[0]; }
function bikeLabel(bike) { return bike ? `${bike.brand} ${bike.model} ${bike.year} ${bike.variant}` : "No bike selected"; }
function activeProduct() { return products.find(p => p.id === state.activeProductId) || products[0]; }
function productById(id) { return products.find(p => p.id === id) || products[0]; }
function money(v) { return `₹${v.toLocaleString("en-IN")}`; }
function makeAvatar(n) { return n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase(); }
function stars(r) { return "★".repeat(Math.floor(r)) + "☆".repeat(5 - Math.floor(r)); }

function matchingFit(product, bike) {
  if (!bike) return { label: "Select bike for fit", tone: "muted", detail: "Add a bike to see fit confidence." };
  const exact = product.compatibility.find(r => r.brand === bike.brand && r.model === bike.model && bike.year >= r.yearFrom && bike.year <= r.yearTo && (r.variant === bike.variant || r.variant.includes(bike.variant)) && (r.region === bike.region || r.region === "Global" || bike.region === "Global"));
  if (exact) {
    if (bike.modified && exact.fitType !== "Universal") return { label: "Fit not guaranteed (modified)", tone: "warn", detail: `${exact.fitType} fit, confirm before ordering.` };
    return { label: `Fits · ${exact.fitType}`, tone: "ok", detail: `${exact.sku} verified for your bike.` };
  }
  const uni = product.compatibility.find(r => r.fitType === "Universal");
  if (uni) return { label: "Universal fit", tone: "warn", detail: "Fits most bikes, not bike-specific." };
  return { label: "Check compatibility", tone: "warn", detail: "Not in fitment table for this bike." };
}

function showToast(msg) {
  nodes.toastMsg.textContent = msg;
  nodes.toast.classList.add("active");
  setTimeout(() => nodes.toast.classList.remove("active"), 2800);
}

function triggerBadgeBump() {
  const badges = document.querySelectorAll(".cart-count-badge, #mobileCartBadge");
  badges.forEach(b => {
    b.classList.remove("badge-bump");
    void b.offsetWidth;
    b.classList.add("badge-bump");
  });
}

function trackIndex(status) {
  return { Confirmed: 0, Packed: 1, Shipped: 2, Delivered: 3 }[status] ?? 0;
}

/* ---- Countdown ---- */
let countdownTarget = new Date();
countdownTarget.setDate(countdownTarget.getDate() + 2);
countdownTarget.setHours(countdownTarget.getHours() + 14);

function getCountdown() {
  const diff = Math.max(0, countdownTarget - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d: String(d).padStart(2, "0"), h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") };
}

/* ---- Render Engine ---- */
function render() {
  nodes.navButtons.forEach(b => b.classList.toggle("active", b.dataset.view === state.activeView));
  const cb = currentBike();
  nodes.activeBikeChip.innerHTML = cb
    ? `<strong>${cb.nickname}</strong><small>${bikeLabel(cb)}</small>`
    : `<strong>Add Your Bike</strong><small>Filter by model</small>`;
  [...document.querySelectorAll(".view")].forEach(v => v.classList.toggle("active", v.dataset.view === state.activeView));
  document.getElementById("wishlistCount").textContent = state.wishlist.length;
  
  renderHome(); renderCatalog(); renderProduct(); renderGarage();
  renderCheckout(); renderOrderSuccess(); renderTracking(); renderReviews();
  renderHelp(); renderBlog(); renderWishlist(); renderAccount(); renderAdmin();
  renderCartDrawer(); renderQuickPresets(); updateBikeFormOptions();
  syncHash(); saveState();
}

function renderProductCard(product, bike) {
  const fit = matchingFit(product, bike);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isWished = state.wishlist.includes(product.id);
  return `
    <article class="product-card" data-open-product="${product.id}">
      <div class="product-image-frame">
        <img src="${product.image}" class="product-img" alt="${product.name}" loading="lazy" onerror="this.src='images/hero_banner.png'" />
        <div class="product-badge-overlay">
          <span class="discount-badge">-${discount}%</span>
          <span class="product-badge">${product.badge}</span>
        </div>
        <button class="wishlist-btn ${isWished ? "active" : ""}" data-toggle-wish="${product.id}" aria-label="Wishlist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="product-body">
        <div class="meta-row">
          <span class="small-tag">${product.category}</span>
          <span class="rating-stars">${stars(product.rating)}</span>
        </div>
        <h3>${product.name}</h3>
        <span class="badge ${fit.tone}" style="width:fit-content;margin-top:2px">${fit.label}</span>
        <div class="price-row">
          <div>
            <span class="original-price">${money(product.originalPrice)}</span>
            <strong class="price">${money(product.price)}</strong>
          </div>
          <button class="accent-button" data-add-cart="${product.id}" style="padding:4px 10px;font-size:0.72rem">+ Bag</button>
        </div>
      </div>
    </article>`;
}

function renderHome() {
  const bike = currentBike();
  const featured = products.map(p => renderProductCard(p, bike)).join("");
  const cd = getCountdown();

  const bikeBrands = Object.keys(bikeCatalog).map(b => `<button class="brand-chip" data-brand-filter="${b}"><strong>${b}</strong></button>`).join("");

  const categoryImages = {
    "Helmets & Visors": "images/category_helmets.png",
    "Crash Guards": "images/category_protection.png",
    "Aux LED Lights": "images/category_lights.png",
    "Luggage & Bags": "images/category_luggage.png",
  };

  const categories = [
    { title: "Helmets & Visors", body: "Full face, modular & intercoms", filter: "Helmets" },
    { title: "Crash Guards", body: "Heavy duty steel frame guards & sliders", filter: "Protection" },
    { title: "Aux LED Lights", body: "Dual-color yellow & white fog lamps", filter: "Lights" },
    { title: "Luggage & Bags", body: "Waterproof saddlebags & tail bags", filter: "Luggage" },
  ].map(c => `
    <article class="category-card" data-view-target="catalog" data-filter="${c.filter}" style="background-image:url('${categoryImages[c.title]}');background-size:cover;background-position:center">
      <div>
        <span class="small-tag" style="background:rgba(0,0,0,0.6);border-color:transparent;color:#fff">${c.title}</span>
        <h3 style="margin-top:6px">${c.title}</h3>
        <p>${c.body}</p>
      </div>
    </article>`).join("");

  const testimonials = state.reviews.slice(0, 4).map(r => `
    <article class="review-card">
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
        <div class="review-avatar">${makeAvatar(r.author)}</div>
        <div>
          <strong style="font-size:0.85rem">${r.author}</strong>
          <div class="helper">${r.bike}</div>
        </div>
        <span class="badge ok" style="margin-left:auto">Verified</span>
      </div>
      <p style="font-size:0.82rem;line-height:1.4">"${r.text}"</p>
      <div class="meta-row" style="margin-top:8px">
        <span class="rating-stars">${stars(r.rating)}</span>
        <span class="small-tag">${r.date}</span>
      </div>
    </article>`).join("");

  nodes.app.querySelector("#home").innerHTML = `
    <section class="shop-hero" style="background:linear-gradient(135deg,rgba(0,0,0,0.7) 0%,rgba(10,11,13,0.95) 100%),url('images/hero_banner.png') center/cover no-repeat">
      <div class="shop-hero-grid">
        <div class="shop-hero-copy">
          <span class="kicker">INDIA'S #1 MOTORCYCLE ACCESSORIES STORE</span>
          <h2>RIDER'S PARADISE<br/>ENGINEERED FOR<br/>PRECISION FIT</h2>
          <p style="font-size:0.9rem;color:rgba(255,255,255,0.75);max-width:48ch">Upgrade your ride with 100% genuine motorcycle accessories — heavy duty crash guards, LED fog lamps, helmets, and custom touring gear.</p>
          <div class="search-panel">
            <input id="homeSearch" type="search" placeholder="Search product or bike model..." value="${state.catalogSearch}" />
            <button class="accent-button" id="homeSearchGo">Search</button>
            <button class="ghost-button" data-open-bike-modal style="border-color:rgba(255,255,255,0.15);color:#fff;background:rgba(255,255,255,0.06)">Select Bike</button>
          </div>
          <div class="hero-meta-row">
            <div class="meta-chip"><strong>${bike ? bike.nickname : "No Bike Selected"}</strong><span>${bike ? bikeLabel(bike) : "Add bike for fit assurance"}</span></div>
            <div class="meta-chip"><strong>Free Pan-India Delivery</strong><span>On orders over ₹2,999</span></div>
            <div class="meta-chip"><strong>7-Day Fit Guarantee</strong><span>Easy returns if it doesn't fit</span></div>
          </div>
        </div>
        <div class="shop-hero-panel">
          <div class="promo-card">
            <span class="badge ok">${bike ? matchingFit(products[0], bike).label : "Set Active Garage"}</span>
            <h3 style="margin-top:8px;font-size:1rem">${bike ? bikeLabel(bike) : "Select Your Motorcycle"}</h3>
            <p class="muted" style="font-size:0.78rem">Fitment badges auto-verify SKUs against your saved motorcycle.</p>
            <div class="hero-actions" style="margin-top:10px;display:flex;gap:8px">
              <button class="accent-button" data-view-target="catalog">Browse Parts</button>
              <button class="ghost-button" data-open-product="${products[0].id}" style="border-color:rgba(255,255,255,0.15);color:#fff;background:rgba(255,255,255,0.06)">Featured</button>
            </div>
          </div>
          <div class="countdown-card">
            <span class="eyebrow" style="color:var(--color-accent-light)">MONSOON SALE ENDS IN</span>
            <div class="countdown-grid" style="margin-top:8px" id="countdownGrid">
              <article class="countdown-box"><strong>${cd.d}</strong><span>Days</span></article>
              <article class="countdown-box"><strong>${cd.h}</strong><span>Hours</span></article>
              <article class="countdown-box"><strong>${cd.m}</strong><span>Mins</span></article>
              <article class="countdown-box"><strong>${cd.s}</strong><span>Secs</span></article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div><p class="eyebrow">Motorcycle Brands (${Object.keys(bikeCatalog).length})</p><h3 class="view-title">Shop By Brand</h3></div>
        <button class="ghost-button" data-view-target="garage">Manage Garage</button>
      </div>
      <div class="brand-grid">${bikeBrands}</div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div><p class="eyebrow">Categories</p><h3 class="view-title">Shop Accessories</h3></div>
        <button class="ghost-button" data-view-target="catalog">View All</button>
      </div>
      <div class="category-grid">${categories}</div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div><p class="eyebrow">Trending Accessories</p><h3 class="view-title">Popular Genuine Parts</h3></div>
        <button class="ghost-button" data-view-target="catalog">Shop All</button>
      </div>
      <div class="card-grid">${featured}</div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div><p class="eyebrow">Verified Reviews</p><h3 class="view-title">What Riders Say</h3></div>
        <button class="ghost-button" data-view-target="reviews">All Reviews</button>
      </div>
      <div class="review-grid">${testimonials}</div>
    </section>
  `;
}

function renderCatalog() {
  const search = state.catalogSearch.toLowerCase().trim();
  const bike = currentBike();
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filterButtons = categories.map(c => `<button class="filter-chip ${state.catalogFilter === c ? "active" : ""}" data-filter="${c}">${c}</button>`).join("");
  
  let list = products.filter(p => {
    const mf = state.catalogFilter === "All" || p.category === state.catalogFilter;
    const ms = !search || `${p.name} ${p.category} ${p.highlights.join(" ")}`.toLowerCase().includes(search);
    return mf && ms;
  });

  if (state.catalogSort === "price-low") list.sort((a, b) => a.price - b.price);
  else if (state.catalogSort === "price-high") list.sort((a, b) => b.price - a.price);
  else if (state.catalogSort === "rating") list.sort((a, b) => b.rating - a.rating);

  const cards = list.map(p => renderProductCard(p, bike)).join("");

  nodes.app.querySelector("#catalog").innerHTML = `
    <section class="catalog-shell">
      <div class="catalog-hero">
        <div>
          <p class="eyebrow">Full Catalog</p>
          <h2 class="view-title">Browse All Accessories</h2>
          <p class="muted">${list.length} products available · Active Fit: ${bike ? bikeLabel(bike) : "None"}</p>
        </div>
        <div><input class="search" type="search" placeholder="Search products..." value="${state.catalogSearch}" data-search-catalog /></div>
      </div>
      <div class="shop-filters">
        <div class="filter-row">${filterButtons}</div>
        <div style="display:flex;align-items:center;gap:6px">
          <label style="font-size:0.78rem;color:var(--color-ink-muted)">Sort:</label>
          <select id="sortSelect" style="padding:4px 8px;font-size:0.78rem;border-radius:8px">
            <option value="featured" ${state.catalogSort === "featured" ? "selected" : ""}>Featured</option>
            <option value="price-low" ${state.catalogSort === "price-low" ? "selected" : ""}>Price: Low to High</option>
            <option value="price-high" ${state.catalogSort === "price-high" ? "selected" : ""}>Price: High to Low</option>
            <option value="rating" ${state.catalogSort === "rating" ? "selected" : ""}>Top Rated</option>
          </select>
        </div>
      </div>
      <div class="card-grid" style="padding:16px">${cards || '<p class="muted" style="padding:40px;text-align:center;grid-column:1/-1">No products match your search.</p>'}</div>
    </section>`;

  document.getElementById("sortSelect")?.addEventListener("change", e => {
    state.catalogSort = e.target.value;
    renderCatalog();
    saveState();
  });
}

function renderProduct() {
  const product = activeProduct();
  const bike = currentBike();
  const fit = matchingFit(product, bike);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const exactReviews = state.reviews.filter(r => r.productId === product.id);
  const reviewFeed = exactReviews.map(r => `
    <article class="review-card">
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:6px">
        <div class="review-avatar">${makeAvatar(r.author)}</div>
        <div><strong>${r.author}</strong><div class="helper">${r.bike} · ${r.date}</div></div>
      </div>
      <p style="font-size:0.82rem">${r.text}</p>
      <div class="meta-row" style="margin-top:6px"><span class="rating-stars">${stars(r.rating)}</span><span class="small-tag">Verified purchase</span></div>
    </article>`).join("");

  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];
  const galleryThumbs = gallery.map((img, i) => `<img src="${img}" class="product-thumb ${i === 0 ? "active" : ""}" data-swap-main="${img}" alt="Thumbnail" />`).join("");

  const rows = product.compatibility.map(r => `
    <div class="spec-row">
      <div><strong>${r.brand} ${r.model}</strong><div class="helper">${r.yearFrom}–${r.yearTo} · ${r.variant} · ${r.region}</div></div>
      <div class="meta-row"><span class="badge ${r.fitType === "OEM" ? "ok" : "warn"}">${r.fitType}</span><span class="small-tag">${r.sku}</span></div>
    </div>`).join("");

  nodes.app.querySelector("#product").innerHTML = `
    <section class="product-shell active">
      <div style="padding:16px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div><p class="eyebrow">${product.category}</p><h2 class="view-title">${product.name}</h2></div>
        <button class="ghost-button" data-view-target="catalog">← Back to Catalog</button>
      </div>
      <div class="product-hero">
        <div class="product-showcase">
          <div class="product-main-img-frame"><img id="productMainImg" src="${gallery[0]}" alt="${product.name}" onerror="this.src='images/hero_banner.png'" /></div>
          <div class="product-thumb-row">${galleryThumbs}</div>
        </div>
        <div class="product-details">
          <div class="badge-row">
            <span class="badge ${fit.tone}">${fit.label}</span>
            <span class="badge ok">${product.authenticity}</span>
            <span class="badge muted">${product.warranty} warranty</span>
          </div>
          <div class="price-row" style="margin-top:4px">
            <div><span class="original-price">${money(product.originalPrice)}</span> <strong class="price" style="font-size:1.4rem">${money(product.price)}</strong> <span class="discount-badge">-${discount}%</span></div>
          </div>
          <p class="muted">${fit.detail}</p>
          <div class="note">Free returns within 7 days if fit fails. <a href="#" data-open-policy style="color:var(--color-accent-light);text-decoration:underline">Policy details</a></div>
          <div style="margin-top:4px"><strong style="font-size:0.82rem">Key Features:</strong>
            <ul style="margin-top:4px;display:grid;gap:2px">${product.highlights.map(h => `<li style="font-size:0.8rem;color:var(--color-ink-muted)">• ${h}</li>`).join("")}</ul>
          </div>
          <div class="meta-row" style="margin-top:6px"><span class="small-tag">SKU: ${product.sku}</span><span class="small-tag">${product.ridersInstalled} installed</span><span class="small-tag">${product.inStock ? "In Stock" : "Out of Stock"}</span></div>
          <div class="hero-actions" style="margin-top:10px;display:flex;gap:8px">
            <button class="accent-button" data-add-cart="${product.id}" style="flex:1">Add to Bag</button>
            <button class="ghost-button" data-toggle-wish="${product.id}">${state.wishlist.includes(product.id) ? "Saved" : "Save Wishlist"}</button>
          </div>
          <div style="margin-top:10px"><strong style="font-size:0.82rem">Compatibility Table:</strong></div>
          <div class="spec-list">${rows}</div>
        </div>
      </div>
      <div style="padding:16px">
        <div class="section-card" style="margin-top:0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <h3>${exactReviews.length} Rider Reviews</h3>
            <button class="ghost-button" id="openReviewModal" style="padding:4px 10px;font-size:0.75rem">+ Write Review</button>
          </div>
          <div style="display:grid;gap:10px">${reviewFeed || '<p class="muted">No reviews yet for this product. Be the first to review!</p>'}</div>
        </div>
      </div>
    </section>`;

  document.querySelectorAll("[data-swap-main]").forEach(thumb => {
    thumb.addEventListener("click", () => {
      document.getElementById("productMainImg").src = thumb.dataset.swapMain;
      document.querySelectorAll("[data-swap-main]").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  document.getElementById("openReviewModal")?.addEventListener("click", () => {
    nodes.reviewDialog.showModal();
  });
}

function renderGarage() {
  const activeB = currentBike();
  const bikesHtml = state.bikes.map(bike => {
    const isPrimary = bike.id === activeB?.id;
    const compatibleCount = products.filter(p => matchingFit(p, bike).tone === "ok").length;
    return `
      <article class="bike-card ${isPrimary ? "primary" : ""}">
        <div class="bike-media">
          <div>
            <span class="badge ${bike.modified ? "warn" : "ok"}">${bike.modified ? "Modified" : "Stock Unmodified"}</span>
            <h3 style="margin-top:6px;color:#ffffff !important;font-size:1.1rem">${bike.nickname}</h3>
            <p style="font-size:0.85rem;color:#ff5260 !important;font-weight:700">${bikeLabel(bike)}</p>
          </div>
          <div class="bike-avatar">${makeAvatar(bike.nickname)}</div>
        </div>
        <div class="bike-body">
          <div class="meta-row">
            <span class="small-tag" style="color:#ffffff !important">${bike.region} Region</span>
            <span class="small-tag" style="border-color:rgba(16,185,129,0.5);color:#34d399 !important;background:rgba(16,185,129,0.15)">${compatibleCount} Compatible Parts</span>
            ${isPrimary ? '<span class="small-tag" style="background:#e63946;color:#ffffff !important;border-color:transparent">Active Bike</span>' : ''}
          </div>
          <div class="card-actions" style="margin-top:6px">
            ${!isPrimary ? `<button class="accent-button" data-set-bike="${bike.id}" style="padding:4px 12px;font-size:0.75rem">Set Active</button>` : ''}
            <button class="ghost-button" data-shop-bike="${bike.brand}">Shop Parts</button>
            <button class="ghost-button" data-bike-orders="${bike.id}">Orders</button>
            <button class="ghost-button" data-remove-bike="${bike.id}" style="color:#ff5260 !important">Remove</button>
          </div>
        </div>
      </article>`;
  }).join("");

  nodes.app.querySelector("#garage").innerHTML = `
    <section class="garage-shell">
      <div style="padding:18px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>
          <p class="eyebrow" style="color:#ff5260 !important">MY GARAGE MANAGEMENT</p>
          <h2 class="view-title" style="color:#ffffff !important">Your Saved Motorcycles (${state.bikes.length})</h2>
          <p class="muted" style="color:#cbd5e1 !important">Set active motorcycle to filter compatibility badges across the entire store.</p>
        </div>
        <button class="accent-button" data-open-bike-modal>+ Add New Bike</button>
      </div>

      <div style="padding:16px">
        ${activeB ? `
          <div class="garage-hero-card">
            <div>
              <span class="badge ok" style="background:rgba(16,185,129,0.2);color:#34d399 !important;border-color:rgba(16,185,129,0.4)">CURRENT ACTIVE MOTORCYCLE</span>
              <h3 style="margin-top:8px;font-size:1.3rem;color:#ffffff !important">${activeB.nickname}</h3>
              <p style="font-size:0.9rem;color:#ff5260 !important;font-weight:800">${bikeLabel(activeB)}</p>
              <div class="meta-row" style="margin-top:10px">
                <span class="small-tag" style="color:#ffffff !important">${activeB.region} Region</span>
                <span class="small-tag" style="color:#ffffff !important">${activeB.modified ? "Has Modifications" : "Stock Unmodified"}</span>
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="accent-button" data-shop-bike="${activeB.brand}">Shop Accessories For This Bike</button>
            </div>
          </div>
        ` : ''}

        <div class="bike-strip">
          ${bikesHtml}
          <div class="empty-bike-card" data-open-bike-modal>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff5260" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <strong style="font-size:0.95rem;color:#ffffff !important">Add Another Motorcycle</strong>
            <p class="muted" style="font-size:0.78rem;color:#cbd5e1 !important">Save multiple bikes for 1-tap fitment switching</p>
          </div>
        </div>
      </div>
    </section>`;
}

function renderCheckout() {
  const bike = currentBike();
  let subtotal = 0;
  state.cart.forEach(i => { const p = productById(i.productId); if (p) subtotal += p.price * i.qty; });
  const shipping = subtotal >= 2999 ? 0 : 149;
  const discount = state.couponDiscount;
  const total = subtotal - discount + shipping;

  const cartItems = state.cart.map(item => {
    const p = productById(item.productId);
    if (!p) return "";
    return `<div class="summary-row"><span>${p.name} × ${item.qty}</span><strong>${money(p.price * item.qty)}</strong></div>`;
  }).join("");

  nodes.app.querySelector("#checkout").innerHTML = `
    <section class="checkout-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center">
        <div><p class="eyebrow">Secure Checkout</p><h2 class="view-title">Complete Order</h2></div>
        <span class="badge ok">SSL Encrypted</span>
      </div>
      <div class="checkout-grid">
        <div>
          <form id="checkoutForm">
            <div class="section-card" style="margin-top:0">
              <h3 style="margin-bottom:10px">Shipping Details</h3>
              <div class="checkout-form">
                <div class="checkout-form-grid">
                  <label><span>First Name</span><input name="fname" type="text" placeholder="Rahul" required /></label>
                  <label><span>Last Name</span><input name="lname" type="text" placeholder="Sharma" required /></label>
                </div>
                <label><span>Email</span><input name="email" type="email" placeholder="rahul@example.com" required /></label>
                <label><span>Phone</span><input name="phone" type="tel" placeholder="+91 98765 43210" required /></label>
                <label><span>Address</span><input name="address" type="text" placeholder="123, MG Road, Koramangala" required /></label>
                <div class="checkout-form-grid">
                  <label><span>City</span><input name="city" type="text" placeholder="Bangalore" required /></label>
                  <label><span>PIN Code</span><input name="pincode" type="text" placeholder="560034" required /></label>
                </div>
                <label><span>State</span><select name="state"><option>Karnataka</option><option>Maharashtra</option><option>Delhi</option><option>Tamil Nadu</option><option>Kerala</option><option>Other</option></select></label>
              </div>
            </div>
            <div class="section-card">
              <h3 style="margin-bottom:10px">Payment Method</h3>
              <div style="display:grid;gap:8px">
                <label class="inline-check" style="padding:10px;border:1px solid var(--color-border);border-radius:10px;cursor:pointer">
                  <input type="radio" name="payment" value="UPI / GPay" checked style="width:auto" /><span>UPI / Google Pay / PhonePe</span>
                </label>
                <label class="inline-check" style="padding:10px;border:1px solid var(--color-border);border-radius:10px;cursor:pointer">
                  <input type="radio" name="payment" value="Card" style="width:auto" /><span>Credit / Debit Card</span>
                </label>
                <label class="inline-check" style="padding:10px;border:1px solid var(--color-border);border-radius:10px;cursor:pointer">
                  <input type="radio" name="payment" value="COD" style="width:auto" /><span>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
            <button type="submit" class="accent-button full-width" style="margin-top:14px">PLACE ORDER — ${money(total)}</button>
          </form>
        </div>
        <div>
          <div class="section-card" style="margin-top:0">
            <h3 style="margin-bottom:10px">Order Summary</h3>
            <div class="summary-box" style="border:0;padding:0;background:transparent">
              ${cartItems}
              <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
              ${discount > 0 ? `<div class="summary-row"><span>Discount</span><span class="discount-amount">-${money(discount)}</span></div>` : ""}
              <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--color-green)">FREE</span>' : money(shipping)}</span></div>
              <div class="summary-row total-row" style="border-top:1px solid var(--color-border);margin-top:6px;padding-top:10px"><strong>Total</strong><strong style="color:var(--color-accent-light);font-size:1.1rem">${money(total)}</strong></div>
            </div>
            ${bike ? `<div class="note" style="margin-top:10px">Active bike: <strong>${bike.nickname}</strong> — ${bikeLabel(bike)}</div>` : ""}
          </div>
        </div>
      </div>
    </section>`;

  document.getElementById("checkoutForm")?.addEventListener("submit", e => {
    e.preventDefault();
    if (!state.cart.length) { showToast("Your bag is empty!"); return; }
    const fd = new FormData(e.target);
    const orderId = `HRZ-INV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      items: state.cart.map(i => ({ ...i, product: productById(i.productId) })),
      subtotal,
      discount,
      shipping,
      total,
      customer: {
        name: `${fd.get("fname")} ${fd.get("lname")}`,
        email: fd.get("email"),
        phone: fd.get("phone"),
        address: `${fd.get("address")}, ${fd.get("city")}, ${fd.get("state")} - ${fd.get("pincode")}`,
      },
      payment: fd.get("payment"),
      status: "Confirmed",
      eta: "3-5 Business Days",
    };

    state.orders.unshift({
      id: orderId,
      productId: state.cart[0].productId,
      bikeId: state.activeBikeId,
      status: "Confirmed",
      eta: "3-5 Days",
      fit: "Fits your bike",
      total,
      date: newOrder.date,
    });

    state.lastPlacedOrder = newOrder;
    state.cart = [];
    state.couponDiscount = 0;
    saveState();
    showToast("Order placed successfully!");
    openView("order-success");
  });
}

function renderOrderSuccess() {
  const o = state.lastPlacedOrder;
  const container = nodes.app.querySelector("#order-success");
  if (!o) {
    container.innerHTML = `<div style="text-align:center;padding:60px 16px"><p class="muted">No recent order found.</p><button class="accent-button" data-view-target="catalog" style="margin-top:14px">Shop Catalog</button></div>`;
    return;
  }

  const rows = o.items.map(i => `
    <tr>
      <td>${i.product.name}</td>
      <td style="text-align:center">${i.qty}</td>
      <td style="text-align:right">${money(i.product.price * i.qty)}</td>
    </tr>`).join("");

  container.innerHTML = `
    <section class="invoice-card">
      <div class="invoice-header">
        <div>
          <span class="badge ok" style="margin-bottom:6px">Order Confirmed</span>
          <h2 style="font-size:1.4rem">${o.id}</h2>
          <p class="muted">Date: ${o.date} · Payment: ${o.payment}</p>
        </div>
        <div style="text-align:right">
          <strong class="brand-title">HRz <span class="accent-text">PITSTOP</span></strong>
          <p class="helper">Original Tax Invoice</p>
        </div>
      </div>

      <div style="margin-bottom:14px;font-size:0.82rem">
        <strong>Shipping Address:</strong>
        <p class="muted">${o.customer.name} (${o.customer.phone})</p>
        <p class="muted">${o.customer.address}</p>
      </div>

      <table class="invoice-table">
        <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="border-top:1px solid var(--color-border);padding-top:10px;margin-top:10px">
        <div class="summary-row"><span>Subtotal</span><strong>${money(o.subtotal)}</strong></div>
        ${o.discount > 0 ? `<div class="summary-row"><span>Discount</span><span class="discount-amount">-${money(o.discount)}</span></div>` : ""}
        <div class="summary-row"><span>Shipping</span><span>${o.shipping === 0 ? "FREE" : money(o.shipping)}</span></div>
        <div class="summary-row total-row"><strong>Total Paid</strong><strong class="accent-price">${money(o.total)}</strong></div>
      </div>

      <div style="display:flex;gap:8px;margin-top:18px;justify-content:flex-end">
        <button class="ghost-button" onclick="window.print()">Print Receipt</button>
        <button class="accent-button" data-view-target="tracking">Track Package ➔</button>
      </div>
    </section>`;
}

function renderTracking() {
  const bike = currentBike();
  const bikeOrders = state.orders.filter(o => o.bikeId === bike?.id);
  const allOrders = bikeOrders.length ? bikeOrders : state.orders;
  const cardHtml = allOrders.map(order => {
    const product = productById(order.productId);
    const trackStages = ["Confirmed", "Packed", "Shipped", "Delivered"];
    return `
      <article class="order-card">
        <div class="order-head">
          <div>
            <p class="eyebrow">${order.id} · ${order.date || ''}</p>
            <h3 style="font-size:0.95rem">${product.name}</h3>
          </div>
          <span class="badge ${order.fit === "Fits your bike" ? "ok" : "warn"}">${order.fit}</span>
        </div>
        <div class="track-steps">
          ${trackStages.map((stage, i) => `<div class="track-step ${i <= trackIndex(order.status) ? "active" : ""}"><strong style="font-size:0.78rem">${stage}</strong></div>`).join("")}
        </div>
        <div class="meta-row"><span class="small-tag">ETA: ${order.eta}</span><span class="small-tag">${money(order.total)}</span></div>
      </article>`;
  }).join("");

  nodes.app.querySelector("#tracking").innerHTML = `
    <section class="tracking-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border)">
        <p class="eyebrow">Order Tracking</p><h2 class="view-title">Your Orders</h2>
      </div>
      <div class="order-grid">${cardHtml || '<p class="muted" style="text-align:center;padding:30px">No orders found.</p>'}</div>
    </section>`;
}

function renderReviews() {
  const bikeOptions = ["All bikes", ...state.bikes.map(b => bikeLabel(b))];
  const filters = bikeOptions.map(b => `<button class="filter-chip ${state.activeReviewBike === b ? "active" : ""}" data-review-filter="${b}">${b}</button>`).join("");
  const filtered = state.reviews.filter(r => state.activeReviewBike === "All bikes" || r.bike === state.activeReviewBike);

  nodes.app.querySelector("#reviews").innerHTML = `
    <section class="tracking-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div><p class="eyebrow">Verified Reviews</p><h2 class="view-title">Rider Feedback</h2></div>
        <div class="filter-row">${filters}</div>
      </div>
      <div class="review-grid">
        ${filtered.map(r => `
          <article class="review-card">
            <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
              <div class="review-avatar">${makeAvatar(r.author)}</div>
              <div><strong>${r.author}</strong><div class="helper">${r.bike} · ${r.date}</div></div>
            </div>
            <p style="font-size:0.82rem;line-height:1.4">"${r.text}"</p>
            <div class="meta-row" style="margin-top:8px"><span class="rating-stars">${stars(r.rating)}</span><span class="small-tag">${productById(r.productId).name}</span></div>
          </article>`).join("")}
      </div>
    </section>`;
}

function renderHelp() {
  nodes.app.querySelector("#help").innerHTML = `
    <section class="tracking-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border)">
        <p class="eyebrow">Help & Support</p><h2 class="view-title">Customer Service</h2>
      </div>
      <div style="padding:16px;display:grid;gap:12px">
        <article class="section-card" style="margin:0">
          <h3 style="margin-bottom:6px">7-Day Fitment Returns</h3>
          <p class="muted">If a product marked "Fits Your Bike" fails to fit your unmodified motorcycle, return it within 7 days for a 100% full refund or free replacement.</p>
          <button class="ghost-button" data-open-policy style="margin-top:10px">Read Policy</button>
        </article>
        <article class="section-card" style="margin:0">
          <h3 style="margin-bottom:6px">Shipping Information</h3>
          <p class="muted">Free shipping on orders above ₹2,999. Standard delivery: 3–7 business days pan-India.</p>
        </article>
        <article class="section-card" style="margin:0">
          <h3 style="margin-bottom:6px">Contact Support</h3>
          <p class="muted">Call: +91 98765 43210 (Mon–Sat, 10AM–7PM)<br/>WhatsApp: +91 98765 43210<br/>Email: support@hrzpitstop.com</p>
        </article>
      </div>
    </section>`;
}

function renderBlog() {
  const guides = [
    { title: "Ultimate Himalayan 450 Touring Setup", type: "Guide", time: "8 min read", summary: "Essential crash guards, visors, and luggage mounting points for long expeditions.", image: "images/hero_banner.png" },
    { title: "LED Fog Light Installation & Relay Wiring", type: "Tutorial", time: "6 min read", summary: "Step by step wiring guide to avoid battery drain and keep factory warranty intact.", image: "images/category_lights.png" },
    { title: "Monsoon Bike Care & Chain Lubrication", type: "Maintenance", time: "5 min read", summary: "Prevent rust, chain stiff links, and electrical shorting during heavy rain.", image: "images/category_protection.png" },
  ];

  nodes.app.querySelector("#blog").innerHTML = `
    <section class="tracking-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border)">
        <p class="eyebrow">Rider Journal</p><h2 class="view-title">Guides & Tutorials</h2>
      </div>
      <div class="blog-grid">
        ${guides.map(g => `
          <article class="blog-card">
            <div class="blog-card-image"><img src="${g.image}" alt="${g.title}" loading="lazy" onerror="this.src='images/hero_banner.png'" /></div>
            <div class="blog-card-body">
              <div class="meta-row"><span class="small-tag">${g.type}</span><span class="small-tag">${g.time}</span></div>
              <h3 style="margin-top:6px">${g.title}</h3>
              <p style="margin-top:4px">${g.summary}</p>
            </div>
          </article>`).join("")}
      </div>
    </section>`;
}

function renderWishlist() {
  const bike = currentBike();
  const items = products.filter(p => state.wishlist.includes(p.id));
  nodes.app.querySelector("#wishlist").innerHTML = `
    <section class="tracking-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border)">
        <p class="eyebrow">My Wishlist</p>
        <h2 class="view-title">Saved Items (${items.length})</h2>
      </div>
      <div class="card-grid" style="padding:16px">
        ${items.length ? items.map(p => renderProductCard(p, bike)).join("") : '<p class="muted" style="text-align:center;padding:30px;grid-column:1/-1">Your wishlist is empty. Tap heart icon on any product to save.</p>'}
      </div>
    </section>`;
}

function renderAccount() {
  nodes.app.querySelector("#account").innerHTML = `
    <section class="tracking-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border)">
        <p class="eyebrow">My Account</p>
        <h2 class="view-title">Sign In or Register</h2>
      </div>
      <div style="max-width:400px;margin:24px auto;padding:0 16px">
        <div style="display:flex;gap:4px;background:rgba(255,255,255,0.04);border-radius:10px;padding:4px;margin-bottom:16px">
          <button class="filter-chip active" id="loginTab" style="flex:1;text-align:center">Sign In</button>
          <button class="filter-chip" id="registerTab" style="flex:1;text-align:center">Register</button>
        </div>
        <div class="form-grid" id="authForm">
          <label><span>Email Address</span><input type="email" placeholder="rider@example.com" /></label>
          <label><span>Password</span><input type="password" placeholder="Enter password" /></label>
          <button class="accent-button full-width" id="authSubmitBtn" style="margin-top:6px">Sign In</button>
        </div>
      </div>
    </section>`;
}

function renderAdmin() {
  const rolePills = ["Admin", "Catalog Manager", "Support"].map(r => `<button class="role-pill ${state.activeRole === r ? "active" : ""}" data-role="${r}">${r}</button>`).join("");
  const fitmentRows = state.fitmentRows.map(row => `
    <tr>
      <td><input data-fit-field="brand" data-id="${row.id}" value="${row.brand}" style="padding:4px 6px"></td>
      <td><input data-fit-field="model" data-id="${row.id}" value="${row.model}" style="padding:4px 6px"></td>
      <td><input data-fit-field="yearFrom" data-id="${row.id}" value="${row.yearFrom}" style="padding:4px 6px;width:50px"></td>
      <td><input data-fit-field="yearTo" data-id="${row.id}" value="${row.yearTo}" style="padding:4px 6px;width:50px"></td>
      <td><input data-fit-field="variant" data-id="${row.id}" value="${row.variant}" style="padding:4px 6px"></td>
      <td><input data-fit-field="region" data-id="${row.id}" value="${row.region}" style="padding:4px 6px;width:50px"></td>
      <td><input data-fit-field="sku" data-id="${row.id}" value="${row.sku}" style="padding:4px 6px"></td>
      <td><select data-fit-field="fitType" data-id="${row.id}" style="padding:4px 6px"><option ${row.fitType === "OEM" ? "selected" : ""}>OEM</option><option ${row.fitType === "Universal" ? "selected" : ""}>Universal</option></select></td>
      <td><span class="badge ${row.status === "Verified" ? "ok" : "warn"}">${row.status}</span></td>
    </tr>`).join("");

  nodes.app.querySelector("#admin").innerHTML = `
    <section class="tracking-shell">
      <div style="padding:16px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center">
        <div><p class="eyebrow">Admin Panel</p><h2 class="view-title">Store Management</h2></div>
        <div class="filter-row">${rolePills}</div>
      </div>
      <div class="admin-grid">
        <div class="table-shell"><table><thead><tr><th>Brand</th><th>Model</th><th>From</th><th>To</th><th>Variant</th><th>Region</th><th>SKU</th><th>Fit</th><th>Status</th></tr></thead><tbody>${fitmentRows}</tbody></table></div>
      </div>
    </section>`;
}

/* ---- Cart Drawer ---- */
function renderCartDrawer() {
  const body = document.getElementById("cartDrawerItems");
  const badge = document.getElementById("cartCountBadge");
  const mobileBadge = document.getElementById("mobileCartBadge");
  const sub = document.getElementById("cartSubtotal");
  const grand = document.getElementById("cartGrandTotal");
  const shipText = document.getElementById("shippingProgressText");
  const shipBar = document.getElementById("shippingProgressBar");
  const discountEl = document.getElementById("cartDiscount");
  const shipFee = document.getElementById("cartShippingFee");

  let subtotal = 0;
  state.cart.forEach(i => { const p = productById(i.productId); if (p) subtotal += p.price * i.qty; });
  const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
  const shipping = subtotal >= 2999 ? 0 : 149;
  const total = subtotal - state.couponDiscount + shipping;

  if (badge) badge.textContent = totalQty;
  if (mobileBadge) mobileBadge.textContent = totalQty;
  if (body) {
    if (!state.cart.length) {
      body.innerHTML = `<div style="text-align:center;padding:30px 10px"><p style="font-weight:700;font-size:0.95rem;margin-bottom:4px">Your Bag is Empty</p><p style="font-size:0.78rem;color:var(--color-ink-muted)">Browse our collection of genuine accessories</p><button class="accent-button" data-view-target="catalog" style="margin-top:14px">Shop Now</button></div>`;
    } else {
      body.innerHTML = state.cart.map(item => {
        const p = productById(item.productId);
        if (!p) return "";
        return `
          <div class="cart-item-card">
            <img src="${p.image}" class="cart-item-img" alt="${p.name}" onerror="this.src='images/hero_banner.png'" />
            <div class="cart-item-info">
              <h4>${p.name}</h4>
              <div style="font-size:0.78rem;color:var(--color-accent-light);font-weight:700">${money(p.price)}</div>
              <div class="cart-qty-controls">
                <button class="qty-btn" data-cart-qty="${p.id}" data-delta="-1">−</button>
                <span style="font-size:0.8rem;font-weight:700;min-width:18px;text-align:center">${item.qty}</span>
                <button class="qty-btn" data-cart-qty="${p.id}" data-delta="1">+</button>
              </div>
            </div>
            <strong style="font-size:0.85rem;white-space:nowrap">${money(p.price * item.qty)}</strong>
          </div>`;
      }).join("");
    }
  }
  if (sub) sub.textContent = money(subtotal);
  if (grand) grand.textContent = money(total);
  if (discountEl) discountEl.textContent = state.couponDiscount > 0 ? `-${money(state.couponDiscount)}` : "-₹0";
  if (shipFee) shipFee.textContent = shipping === 0 ? "FREE" : money(shipping);
  if (shipText && shipBar) {
    if (subtotal >= 2999) {
      shipText.textContent = "FREE Shipping Unlocked!";
      shipBar.style.width = "100%";
    } else {
      shipText.textContent = `Add ${money(2999 - subtotal)} more for FREE shipping`;
      shipBar.style.width = `${Math.min(100, Math.round((subtotal / 2999) * 100))}%`;
    }
  }
}

/* ---- Quick Presets in Bike Selector Modal ---- */
let currentPresetIndex = 0;

function renderQuickPresets() {
  if (!nodes.quickPresetsContainer) return;
  nodes.quickPresetsContainer.innerHTML = popularBikePresets.map((preset, idx) => `
    <button type="button" class="quick-preset-chip ${idx === currentPresetIndex ? "active" : ""}" data-apply-preset="${idx}">
      ${preset.brand} ${preset.model}
    </button>`).join("");
}

function applyPreset(idx) {
  const p = popularBikePresets[idx];
  if (!p) return;
  currentPresetIndex = idx;

  if (nodes.bikeNicknameInput) nodes.bikeNicknameInput.value = p.nickname;
  if (nodes.bikeBrand) {
    nodes.bikeBrand.value = p.brand;
    updateBikeFormOptions();
  }
  if (nodes.bikeModel) {
    nodes.bikeModel.value = p.model;
    updateBikeFormOptions();
  }
  if (nodes.bikeYear) nodes.bikeYear.value = p.year;
  if (nodes.bikeVariant) nodes.bikeVariant.value = p.variant;

  // Highlight active preset chip & scroll to view
  if (nodes.quickPresetsContainer) {
    const chips = nodes.quickPresetsContainer.querySelectorAll(".quick-preset-chip");
    chips.forEach((chip, i) => {
      const isTarget = i === idx;
      chip.classList.toggle("active", isTarget);
      if (isTarget) chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  }

  showToast(`Selected Preset: ${p.brand} ${p.model} ${p.variant}`);
}

/* ---- Dynamic Cascading Dropdowns ---- */
function updateBikeFormOptions() {
  const brands = Object.keys(bikeCatalog);
  if (!nodes.bikeBrand) return;
  
  if (!nodes.bikeBrand.innerHTML) {
    nodes.bikeBrand.innerHTML = brands.map(b => `<option value="${b}">${b}</option>`).join("");
  }
  const selectedBrand = nodes.bikeBrand.value || brands[0];
  const models = Object.keys(bikeCatalog[selectedBrand] || {});
  nodes.bikeModel.innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join("");
  
  const selectedModel = nodes.bikeModel.value || models[0];
  const modelObj = bikeCatalog[selectedBrand]?.[selectedModel];
  
  nodes.bikeYear.innerHTML = (modelObj?.years || [2024]).map(y => `<option value="${y}">${y}</option>`).join("");
  const variants = modelObj?.variants || ["Standard"];
  nodes.bikeVariant.innerHTML = variants.map(v => `<option value="${v}">${v}</option>`).join("");
}

function syncHash() {
  const target = state.activeView === "product" ? `product/${state.activeProductId}` : state.activeView;
  if (location.hash.replace("#", "") !== target) history.replaceState(null, "", `#${target}`);
}

function parseHash() {
  const hash = location.hash.replace("#", "");
  if (!hash) { state.activeView = "home"; return; }
  if (hash.startsWith("product/")) { state.activeView = "product"; state.activeProductId = hash.split("/")[1] || products[0].id; return; }
  state.activeView = hash;
}

function openView(view) {
  state.activeView = view;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- Bike & Cart Operations ---- */
function addToCart(productId) {
  const existing = state.cart.find(i => i.productId === productId);
  if (existing) existing.qty += 1; else state.cart.push({ productId, qty: 1 });
  saveState(); renderCartDrawer(); openCartDrawer(); triggerBadgeBump();
  showToast("Added to bag");
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(i => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(i => i.productId !== productId);
  saveState(); renderCartDrawer(); triggerBadgeBump();
}

function openCartDrawer() { document.getElementById("cartDrawer")?.classList.add("active"); }
function closeCartDrawer() { document.getElementById("cartDrawer")?.classList.remove("active"); }

function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  if (idx > -1) { state.wishlist.splice(idx, 1); showToast("Removed from wishlist"); }
  else { state.wishlist.push(productId); showToast("Added to wishlist"); }
  saveState(); render();
}

function addBike(formData) {
  const nickname = formData.get("nickname").toString().trim() || `${formData.get("brand")} ${formData.get("model")}`;
  const bike = {
    id: `bike-${Date.now()}`, nickname,
    brand: formData.get("brand").toString(), model: formData.get("model").toString(),
    year: Number(formData.get("year")), variant: formData.get("variant").toString(),
    region: formData.get("region").toString(), modified: formData.get("modified") === "on",
    primary: true,
  };
  state.bikes = [bike, ...state.bikes.map(b => ({ ...b, primary: false }))];
  state.activeBikeId = bike.id;
  render();
  showToast(`Active Bike Set: ${bike.nickname}`);
}

function removeBike(id) {
  const bike = state.bikes.find(b => b.id === id);
  state.bikes = state.bikes.filter(b => b.id !== id);
  if (!state.bikes.some(b => b.primary) && state.bikes[0]) state.bikes[0].primary = true;
  if (!state.bikes.find(b => b.id === state.activeBikeId)) state.activeBikeId = state.bikes[0]?.id || null;
  render();
  showToast(`${bike?.nickname || "Bike"} removed from garage`);
}

function updateFitmentField(target) {
  const id = Number(target.dataset.id);
  const field = target.dataset.fitField;
  state.fitmentRows = state.fitmentRows.map(r => r.id === id ? { ...r, [field]: (field === "yearFrom" || field === "yearTo") ? Number(target.value) : target.value } : r);
  saveState();
}

function handleLiveSearch(query) {
  const q = query.toLowerCase().trim();
  if (!q) { nodes.searchPop.classList.remove("active"); return; }
  const matches = products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q)).slice(0, 5);
  if (!matches.length) {
    nodes.searchPop.innerHTML = `<div style="padding:10px 12px;font-size:0.8rem;color:var(--color-ink-muted)">No matching accessories found</div>`;
  } else {
    nodes.searchPop.innerHTML = matches.map(p => `
      <div class="search-autocomplete-item" data-open-product="${p.id}">
        <img src="${p.image}" class="search-autocomplete-img" alt="${p.name}" onerror="this.src='images/hero_banner.png'" />
        <div class="search-autocomplete-info">
          <h5>${p.name}</h5>
          <span>${money(p.price)} · ${p.category}</span>
        </div>
      </div>`).join("");
  }
  nodes.searchPop.classList.add("active");
}

/* ---- Event Binding ---- */
function bindGlobalEvents() {
  document.addEventListener("click", e => {
    if (e.target.id === "cartDrawer") { closeCartDrawer(); return; }
    if (!e.target.closest(".header-search-container")) { nodes.searchPop.classList.remove("active"); }

    const presetBtn = e.target.closest("[data-apply-preset]");
    if (presetBtn) {
      applyPreset(Number(presetBtn.dataset.applyPreset));
      return;
    }

    const addCartBtn = e.target.closest("[data-add-cart]");
    if (addCartBtn) {
      e.stopPropagation();
      addToCart(addCartBtn.dataset.addCart);
      return;
    }

    const wishBtn = e.target.closest("[data-toggle-wish]");
    if (wishBtn) {
      e.stopPropagation();
      toggleWishlist(wishBtn.dataset.toggleWish);
      return;
    }

    const prodCard = e.target.closest("[data-open-product]");
    if (prodCard) {
      state.activeProductId = prodCard.dataset.openProduct;
      nodes.searchPop.classList.remove("active");
      openView("product");
      return;
    }

    const t = e.target.closest("[data-view-target],[data-cart-qty],[data-brand-filter],[data-shop-bike],[data-set-bike],[data-open-policy],[data-review-filter],[data-role],[data-filter],[data-bike-orders],[data-remove-bike],[data-close-dialog],[data-close-policy],[data-close-review],[data-open-bike-modal],#openCartBtn,#closeCartBtn,#mobileCartTrigger,#newsletterSubmit,#applyCouponBtn,#loginTab,#registerTab,#authSubmitBtn");
    if (!t) return;

    if (t.id === "openCartBtn" || t.id === "mobileCartTrigger") { renderCartDrawer(); openCartDrawer(); return; }
    if (t.id === "closeCartBtn") { closeCartDrawer(); return; }
    if (t.matches("[data-cart-qty]")) { updateCartQty(t.dataset.cartQty, Number(t.dataset.delta)); return; }
    if (t.matches("[data-brand-filter]")) { state.catalogSearch = t.dataset.brandFilter; openView("catalog"); return; }
    if (t.matches("[data-shop-bike]")) { state.catalogSearch = t.dataset.shopBike; openView("catalog"); return; }
    if (t.matches("[data-view-target]")) { closeCartDrawer(); openView(t.dataset.viewTarget); if (t.dataset.filter) { state.catalogFilter = t.dataset.filter; render(); } return; }
    if (t.matches("[data-set-bike]")) {
      state.bikes = state.bikes.map(b => ({ ...b, primary: b.id === t.dataset.setBike }));
      state.activeBikeId = t.dataset.setBike;
      render();
      showToast("Active motorcycle updated");
      return;
    }
    if (t.matches("[data-open-policy]")) { e.preventDefault(); nodes.policyDialog.showModal(); return; }
    if (t.matches("[data-open-bike-modal]")) { updateBikeFormOptions(); nodes.bikeDialog.showModal(); return; }
    if (t.matches("[data-review-filter]")) { state.activeReviewBike = t.dataset.reviewFilter; renderReviews(); saveState(); return; }
    if (t.matches("[data-role]")) { state.activeRole = t.dataset.role; renderAdmin(); saveState(); return; }
    if (t.matches("[data-filter]")) { state.catalogFilter = t.dataset.filter; renderCatalog(); saveState(); return; }
    if (t.matches("[data-bike-orders]")) { state.activeBikeId = t.dataset.bikeOrders; openView("tracking"); return; }
    if (t.matches("[data-remove-bike]")) { removeBike(t.dataset.removeBike); return; }
    if (t.matches("[data-close-dialog]")) { if (nodes.bikeDialog.open) nodes.bikeDialog.close(); return; }
    if (t.matches("[data-close-policy]")) { if (nodes.policyDialog.open) nodes.policyDialog.close(); return; }
    if (t.matches("[data-close-review]")) { if (nodes.reviewDialog.open) nodes.reviewDialog.close(); return; }
    if (t.id === "newsletterSubmit") {
      const email = document.getElementById("newsletterEmail");
      if (email?.value) { showToast("Subscribed to newsletter!"); email.value = ""; }
      return;
    }
    if (t.id === "applyCouponBtn") {
      const input = document.getElementById("couponInput");
      if (input?.value.toUpperCase() === "HRZ100") { state.couponDiscount = 100; showToast("Coupon applied! ₹100 off"); }
      else if (input?.value) { showToast("Invalid coupon code"); state.couponDiscount = 0; }
      saveState(); renderCartDrawer(); return;
    }
    if (t.id === "loginTab" || t.id === "registerTab") {
      document.getElementById("loginTab")?.classList.toggle("active", t.id === "loginTab");
      document.getElementById("registerTab")?.classList.toggle("active", t.id === "registerTab");
      return;
    }
    if (t.id === "authSubmitBtn") { showToast("Welcome back!"); return; }
  });

  document.getElementById("globalSearch")?.addEventListener("input", e => handleLiveSearch(e.target.value));

  nodes.bikeForm.addEventListener("submit", e => {
    e.preventDefault();
    addBike(new FormData(nodes.bikeForm));
    nodes.bikeForm.reset();
    if (nodes.bikeDialog.open) nodes.bikeDialog.close();
  });

  nodes.bikeBrand?.addEventListener("change", () => {
    updateBikeFormOptions();
  });
  nodes.bikeModel?.addEventListener("change", () => {
    updateBikeFormOptions();
  });

  nodes.reviewForm?.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(nodes.reviewForm);
    const newRev = {
      id: Date.now(),
      productId: state.activeProductId,
      bike: fd.get("bike").toString(),
      author: fd.get("author").toString(),
      rating: Number(fd.get("rating")),
      text: fd.get("text").toString(),
      date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      verified: true,
    };
    state.reviews.unshift(newRev);
    saveState();
    if (nodes.reviewDialog.open) nodes.reviewDialog.close();
    nodes.reviewForm.reset();
    showToast("Review submitted! Thank you.");
    renderProduct();
  });

  window.addEventListener("hashchange", () => { parseHash(); render(); });

  document.getElementById("globalSearchGo")?.addEventListener("click", () => openView("catalog"));
  document.getElementById("homeSearchGo")?.addEventListener("click", () => openView("catalog"));

  document.getElementById("prevPresetBtn")?.addEventListener("click", () => {
    const nextIdx = (currentPresetIndex - 1 + popularBikePresets.length) % popularBikePresets.length;
    applyPreset(nextIdx);
  });
  document.getElementById("nextPresetBtn")?.addEventListener("click", () => {
    const nextIdx = (currentPresetIndex + 1) % popularBikePresets.length;
    applyPreset(nextIdx);
  });

  window.addEventListener("scroll", () => {
    nodes.backToTop?.classList.toggle("visible", window.scrollY > 400);
  });
  nodes.backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---- Countdown ---- */
function startCountdown() {
  setInterval(() => {
    const grid = document.getElementById("countdownGrid");
    if (!grid) return;
    const cd = getCountdown();
    const boxes = grid.querySelectorAll(".countdown-box strong");
    if (boxes.length === 4) {
      boxes[0].textContent = cd.d;
      boxes[1].textContent = cd.h;
      boxes[2].textContent = cd.m;
      boxes[3].textContent = cd.s;
    }
  }, 1000);
}

/* ---- Nav Init ---- */
function initNav() {
  nodes.navButtons.forEach(button => {
    button.addEventListener("click", () => {
      state.activeView = button.dataset.view;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* ---- Bootstrap ---- */
function bootstrap() {
  parseHash();
  initNav();
  bindGlobalEvents();
  render();
  startCountdown();
}

bootstrap();
