/* =============================================
   HRz PITSTOP – Navigation & Menu Module
   Ultra-optimized for Mobile & Desktop
   - ZERO Emojis: Crisp typography & SVG icons only
   - Glitch-Free Mobile Side Drawer: 44px+ touch targets, no scroll-chaining, no iOS auto-zoom
   - Clean 2-Row Top Navigation Bar with 75vh Full-Width Dropdowns
   ============================================= */

window.HRz = window.HRz || {};

class Menu {
  static menuData = {
    shopByBike: {
      "ROYAL ENFIELD": [
        "Classic 650", "Bear 650", "Guerrilla 450", "Himalayan 450", 
        "Super Meteor 650", "Hunter 350", "Himalayan", "Classic 350 Reborn", 
        "Meteor 350", "Bullet Standard", "Interceptor", "Continental GT"
      ],
      "HERO": ["Xpulse 210", "Mavrick 440", "Xpulse 200"],
      "OLA": ["Ola"],
      "YAMAHA": ["Aerox 155", "RX100", "MT 15", "R3", "R15 V1", "R15 V2", "R15 V3", "R15 V4"],
      "BMW": ["G 310GS", "G 310 R", "S 1000R", "R 1200GS", "R 1300GS"],
      "HARLEY DAVIDSON": ["Harley 440X"],
      "KTM": [
        "KTM 390 Enduro R", "Adventure 890", "Adventure 390 2025 Model", 
        "Adventure 390", "Duke 125", "Duke 200", "Duke 250 BS6", "Duke 250", "Duke 390", "RC 390"
      ],
      "KAWASAKI": ["Versys 650", "Ninja 300", "Z900", "Ninja 400", "Ninja ZX-10R", "Ninja ZX6R"],
      "BENELLI": ["Benelli 600", "TRK 502"],
      "BAJAJ": [
        "Pulsar NS 400Z", "Pulsar 220", "Pulsar NS 200", "Pulsar RS 200", 
        "Dominar 400", "Pulsar 150", "Pulsar 180"
      ],
      "TRIUMPH": ["Tiger 660", "Speed 400", "Tiger", "Trident 660"],
      "DUCATI": ["Panigale V4"],
      "HONDA": [
        "NX500", "CB 200X", "Hness CB 350", "CB 350RS", "NX400", "CB 500X", 
        "CBR 250R", "CB 300", "CB 650R", "CBR 650R", "CBR 1000RR", "Hornet 160R"
      ],
      "TVS": ["Apache RTX 300", "TVS Ronin", "Apache RTR 310", "Apache 200", "Apache RTR 160"],
      "APRILA": ["RS660"]
    },
    accessories: {
      "BIKE PROTECTION": [
        "Lock system", "Crash Guard", "Frame Slider", "Fluid Guards and Caps", 
        "Master Cylinder Guard", "Engine Guards and Skid Plate", "Headlight Grill", 
        "Radiator Guard", "Tank Protectors", "Body Cover", "Screen Protectors", 
        "Stand and Extenders", "Chain Cover And Sprocket", "Boot Guards"
      ],
      "BIKE ESSENTIALS": ["Windshield", "Winglet", "Seat"],
      "HANDLEBAR & ACCESSORIES": [
        "Grips and Throttle", "Hand Guard", "Handlebars", "Handle Risers", 
        "Lever Guard", "Mirror", "Mounts and Chargers", "Handlebar And Accessories"
      ],
      "FOOT CONTROLS": ["Foot Pegs and Mounts"],
      "LIGHTING": [
        "Tail Light", "Auxiliary Light", "Light Accessories", "Indicator", 
        "Headlight", "Hazard Module", "Fancy led light"
      ],
      "WHEEL ACCESSORIES": ["Wheel Cover"],
      "PERFORMANCE ACCESSORIES": [
        "Air Filter", "Exhaust", "Performance Parts", "Exhaust Accessories", "Racing Spare Parts accessories"
      ],
      "CLEANING ACCESSORIES": ["Cleaning Accessories"],
      "BODY FAIRING AND FENDERS": ["Body Fairing", "Fenders and Extenders", "Tail"]
    },
    ridingGears: {
      sidebar: ["Rider Protection", "Casuals", "Rainwear & Visibility"],
      cards: [
        { name: "Helmet", image: "images/helmet.png", category: "Helmets" },
        { name: "Jacket", image: "images/jacket.png", category: "Protection" },
        { name: "Glove", image: "images/gloves.png", category: "Protection" },
        { name: "Pants", image: "images/hero-rider.png", category: "Protection" },
        { name: "Boot", image: "images/boot.png", category: "Protection" },
        { name: "Shoe Protector", image: "images/category_protection.png", category: "Protection" },
        { name: "Kneeguard", image: "images/crash_guard_product.png", category: "Protection" },
        { name: "Elbow Guards", image: "images/bash_plate_product.png", category: "Protection" }
      ]
    },
    luggageTouring: {
      sidebar: ["Bags And Backpacks", "Luggage Accessories", "Carriers and Backrest", "Touring Accessories"],
      cards: [
        { name: "Saddle Bag", image: "images/saddlebags_product.png", search: "Saddle Bag" },
        { name: "Backpack", image: "images/category_luggage.png", search: "Backpack" },
        { name: "Tank Bag", image: "images/saddlebags.jpg", search: "Tank Bag" },
        { name: "Tail Bag", image: "images/category_luggage.png", search: "Tail Bag" },
        { name: "Luggage Accessories", image: "images/phone_mount_product.png", search: "Luggage Accessories" },
        { name: "Carriers and Backrest", image: "images/bash_plate_product.png", search: "Carriers and Backrest" },
        { name: "Touring Accessories", image: "images/fog_lights_product.png", search: "Touring Accessories" }
      ]
    },
    helmetsAccessories: {
      sidebar: ["Helmets", "Accessories", "Rider Tech"],
      cards: [
        { name: "Half face Helmet", image: "images/category_helmets.png", search: "Half face Helmet" },
        { name: "Full Face Helmet", image: "images/helmet_product.png", search: "Full Face Helmet" },
        { name: "Offroad Helmet", image: "images/helmet.jpg", search: "Offroad Helmet" },
        { name: "Helmet Accessories", image: "images/intercom_product.png", search: "Accessories" },
        { name: "Rider Tech & Intercom", image: "images/phone_mount_product.png", search: "Rider Tech" }
      ]
    },
    brands: [
      "AGV", "GIVI", "GOLD FREN", "ALPINESTARS", "POWERTRONIC", "DID", "AIROH", "KYT", 
      "EBC", "SENA", "KOMINIE", "CARDO", "DENALI", "SHOEI", "BELL", "SHARK", "SHIMA", 
      "COKIMA", "ATLAS", "HANLEH", "MOTOURENN", "TRIPMACHINE", "ROLON", "NORIFUMI", 
      "RAM MOUNTS", "JB RACING", "RCB", "NGAGE", "VIATERRA", "MOTO GARUDA", "ACERBIS", 
      "AXOR", "MOTO TORQUE", "3M", "TROY LEE", "LEATT", "RAIDA", "BOBO", "FUELX", 
      "STUDDS", "SMK", "SCOYCO", "REISE", "RYNOX", "RED ROOSTER PERFORMANCE", "PROTAPER", 
      "MT Helmet", "LS2", "NGK", "BIZEN", "VEGA", "CASTROL", "WURTH", "THH", "GLOSIL", 
      "STEELBIRD", "100%", "AXXIS", "BMC", "PRO SPEC", "CRAMSTER", "FUTURE EYES", 
      "CARBONADO", "TVS", "GADSYLL", "GOPRO", "ADDINOL", "ONEAL", "SC PROJECT", 
      "PUTOLINE", "ENGINE ICE", "QUBO", "SYS", "RACE DYNAMIC", "MOTOAGGRANDIZE", 
      "KEWIG", "AKRAPOVIC", "KENNY", "TCX", "LEOVINCE", "FLY", "CRANK1", "SHAD", 
      "PUIG", "EAZI GRIPS", "OINKER", "PROBIKER", "UMA", "TRYKA", "MOTOWING PERFORMANCE", 
      "K3G", "GUARDIAN GEARS", "BREMBO", "NHK", "RENTHAL", "DEVIL EVOLUTION", "TIVRA", 
      "FLEETTRACK", "RAHGEAR", "SS MOTOCORP", "MAISTO"
    ]
  };

  static init() {
    console.log("Initializing HRz Pitstop Optimized Navigation & Menu Module...");
    this.renderDesktopMegaNav();
    this.renderSideMenuDrawer();
    this.bindMenuEvents();
  }

  static renderDesktopMegaNav() {
    const siteHeader = document.getElementById("siteHeader");
    if (!siteHeader) return;

    let navContainer = document.getElementById("megaNavContainer");
    if (!navContainer) {
      navContainer = document.createElement("div");
      navContainer.id = "megaNavContainer";
      navContainer.className = "mega-nav-wrapper";
      siteHeader.insertAdjacentElement("afterend", navContainer);
    }

    const escapeHTML = window.HRz.Utils ? window.HRz.Utils.escapeHTML : (s) => s;
    const { shopByBike, accessories, ridingGears, luggageTouring, helmetsAccessories, brands } = this.menuData;

    navContainer.innerHTML = `
      <!-- ROW 1 -->
      <div class="mega-nav-bar-row row-1">
        <div class="mega-nav-item" data-mega="bike">
          <span class="mega-title">SHOP BY BIKE <i>▼</i></span>
          <div class="mega-dropdown full-width-dropdown">
            <div class="mega-dropdown-header-close">
              <strong>Select Motorcycle Brand & Model</strong>
              <button class="close-mega" onclick="window.HRz.Menu.closeAll()" aria-label="Close menu">×</button>
            </div>
            <div class="mega-dropdown-inner vertical-dividers-grid cols-5">
              <!-- Col 1 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('ROYAL ENFIELD')">ROYAL ENFIELD</h4>
                <ul class="mega-col-list">
                  ${shopByBike["ROYAL ENFIELD"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 2 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('KTM')">KTM</h4>
                <ul class="mega-col-list">
                  ${shopByBike["KTM"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('OLA')">OLA</h4>
                <ul class="mega-col-list">
                  ${shopByBike["OLA"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 3 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('HONDA')">HONDA</h4>
                <ul class="mega-col-list">
                  ${shopByBike["HONDA"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('DUCATI')">DUCATI</h4>
                <ul class="mega-col-list">
                  ${shopByBike["DUCATI"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 4 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('YAMAHA')">YAMAHA</h4>
                <ul class="mega-col-list">
                  ${shopByBike["YAMAHA"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('BMW')">BMW</h4>
                <ul class="mega-col-list">
                  ${shopByBike["BMW"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('HARLEY DAVIDSON')">HARLEY DAVIDSON</h4>
                <ul class="mega-col-list">
                  ${shopByBike["HARLEY DAVIDSON"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 5 -->
              <div class="mega-v-col no-border">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('KAWASAKI')">KAWASAKI</h4>
                <ul class="mega-col-list">
                  ${shopByBike["KAWASAKI"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('BAJAJ')">BAJAJ</h4>
                <ul class="mega-col-list">
                  ${shopByBike["BAJAJ"].map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('TRIUMPH')">TRIUMPH & OTHERS</h4>
                <ul class="mega-col-list">
                  ${shopByBike["TRIUMPH"].concat(shopByBike["TVS"]).concat(shopByBike["BENELLI"]).concat(shopByBike["HERO"]).concat(shopByBike["APRILA"]).slice(0, 6).map(m => `<li><a href="#catalog?search=${encodeURIComponent(m)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(m)}</a></li>`).join("")}
                  <li><a href="#catalog" class="view-all-link" onclick="window.HRz.Menu.closeAll()">View All Models →</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="mega-nav-item" data-mega="accessories">
          <span class="mega-title">MOTORCYCLE ACCESSORIES <i>▼</i></span>
          <div class="mega-dropdown full-width-dropdown">
            <div class="mega-dropdown-header-close">
              <strong>Motorcycle Accessories & Parts</strong>
              <button class="close-mega" onclick="window.HRz.Menu.closeAll()" aria-label="Close menu">×</button>
            </div>
            <div class="mega-dropdown-inner vertical-dividers-grid cols-5">
              <!-- Col 1 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('BIKE PROTECTION')">BIKE PROTECTION</h4>
                <ul class="mega-col-list">
                  ${accessories["BIKE PROTECTION"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 2 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('HANDLEBAR & ACCESSORIES')">HANDLEBAR & ACCESSORIES</h4>
                <ul class="mega-col-list">
                  ${accessories["HANDLEBAR & ACCESSORIES"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('FOOT CONTROLS')">FOOT CONTROLS</h4>
                <ul class="mega-col-list">
                  ${accessories["FOOT CONTROLS"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 3 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('LIGHTING')">LIGHTING</h4>
                <ul class="mega-col-list">
                  ${accessories["LIGHTING"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('WHEEL ACCESSORIES')">WHEEL ACCESSORIES</h4>
                <ul class="mega-col-list">
                  ${accessories["WHEEL ACCESSORIES"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 4 -->
              <div class="mega-v-col">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('PERFORMANCE ACCESSORIES')">PERFORMANCE ACCESSORIES</h4>
                <ul class="mega-col-list">
                  ${accessories["PERFORMANCE ACCESSORIES"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('CLEANING ACCESSORIES')">CLEANING ACCESSORIES</h4>
                <ul class="mega-col-list">
                  ${accessories["CLEANING ACCESSORIES"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
              </div>
              <!-- Col 5 -->
              <div class="mega-v-col no-border">
                <h4 class="mega-col-title" onclick="window.HRz.Menu.navigateToSearch('BODY FAIRING AND FENDERS')">BODY FAIRING AND FENDERS</h4>
                <ul class="mega-col-list">
                  ${accessories["BODY FAIRING AND FENDERS"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
                <h4 class="mega-col-title second-cat" onclick="window.HRz.Menu.navigateToSearch('BIKE ESSENTIALS')">BIKE ESSENTIALS</h4>
                <ul class="mega-col-list">
                  ${accessories["BIKE ESSENTIALS"].map(a => `<li><a href="#catalog?search=${encodeURIComponent(a)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(a)}</a></li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="mega-nav-item" data-mega="gears">
          <span class="mega-title">RIDING GEARS <i>▼</i></span>
          <div class="mega-dropdown full-width-dropdown">
            <div class="mega-dropdown-header-close">
              <strong>Riding Armor, Jackets & Protection</strong>
              <button class="close-mega" onclick="window.HRz.Menu.closeAll()" aria-label="Close menu">×</button>
            </div>
            <div class="sidebar-card-grid-layout">
              <div class="mega-sidebar-nav">
                ${ridingGears.sidebar.map((item, idx) => `
                  <button class="sidebar-btn ${idx === 0 ? 'active' : ''}">
                    <span>${escapeHTML(item)}</span>
                    <i>›</i>
                  </button>
                `).join("")}
              </div>
              <div class="mega-card-grid cols-4">
                ${ridingGears.cards.map(c => `
                  <a class="product-menu-card" href="#catalog?search=${encodeURIComponent(c.name)}" onclick="window.HRz.Menu.closeAll()">
                    <div class="card-img-box">
                      <img src="${c.image}" alt="${escapeHTML(c.name)}" />
                      <span class="plus-badge">+</span>
                    </div>
                    <strong>${escapeHTML(c.name)}</strong>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <div class="mega-nav-item" data-mega="luggage">
          <span class="mega-title">LUGGAGE & TOURING <i>▼</i></span>
          <div class="mega-dropdown full-width-dropdown">
            <div class="mega-dropdown-header-close">
              <strong>Saddlebags, Top Cases & Touring Mounts</strong>
              <button class="close-mega" onclick="window.HRz.Menu.closeAll()" aria-label="Close menu">×</button>
            </div>
            <div class="sidebar-card-grid-layout">
              <div class="mega-sidebar-nav">
                ${luggageTouring.sidebar.map((item, idx) => `
                  <button class="sidebar-btn ${idx === 0 ? 'active' : ''}">
                    <span>${escapeHTML(item)}</span>
                    <i>›</i>
                  </button>
                `).join("")}
              </div>
              <div class="mega-card-grid cols-4">
                ${luggageTouring.cards.map(c => `
                  <a class="product-menu-card" href="#catalog?search=${encodeURIComponent(c.search)}" onclick="window.HRz.Menu.closeAll()">
                    <div class="card-img-box">
                      <img src="${c.image}" alt="${escapeHTML(c.name)}" />
                      <span class="plus-badge">+</span>
                    </div>
                    <strong>${escapeHTML(c.name)}</strong>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <div class="mega-nav-item" data-mega="helmets">
          <span class="mega-title">HELMETS & ACCESSORIES <i>▼</i></span>
          <div class="mega-dropdown full-width-dropdown">
            <div class="mega-dropdown-header-close">
              <strong>Certified DOT / ECE Helmets & Intercoms</strong>
              <button class="close-mega" onclick="window.HRz.Menu.closeAll()" aria-label="Close menu">×</button>
            </div>
            <div class="sidebar-card-grid-layout">
              <div class="mega-sidebar-nav">
                ${helmetsAccessories.sidebar.map((item, idx) => `
                  <button class="sidebar-btn ${idx === 0 ? 'active' : ''}">
                    <span>${escapeHTML(item)}</span>
                    <i>›</i>
                  </button>
                `).join("")}
              </div>
              <div class="mega-card-grid cols-3">
                ${helmetsAccessories.cards.map(c => `
                  <a class="product-menu-card large-card" href="#catalog?search=${encodeURIComponent(c.search)}" onclick="window.HRz.Menu.closeAll()">
                    <div class="card-img-box">
                      <img src="${c.image}" alt="${escapeHTML(c.name)}" />
                      <span class="plus-badge">+</span>
                    </div>
                    <strong>${escapeHTML(c.name)}</strong>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <div class="mega-nav-item" data-mega="brands">
          <span class="mega-title">BRANDS <i>▼</i></span>
          <div class="mega-dropdown full-width-dropdown">
            <div class="mega-dropdown-header-close">
              <strong>Verified Global & Indian Riding Brands (${brands.length}+ in stock)</strong>
              <button class="close-mega" onclick="window.HRz.Menu.closeAll()" aria-label="Close menu">×</button>
            </div>
            <div class="mega-brand-box-grid">
              ${brands.map(b => `
                <a class="brand-box" href="#catalog?search=${encodeURIComponent(b)}" onclick="window.HRz.Menu.closeAll()">
                  <div class="brand-logo-text">${escapeHTML(b)}</div>
                </a>
              `).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 2 -->
      <div class="mega-nav-bar-row row-2">
        <div class="mega-nav-item direct-link">
          <a class="mega-title" href="#about" onclick="window.HRz.Menu.closeAll()">ABOUT US</a>
        </div>

        <div class="mega-nav-item" data-mega="events">
          <span class="mega-title">EVENTS <i>▼</i></span>
          <div class="mega-dropdown full-width-dropdown">
            <div class="mega-dropdown-header-close">
              <strong>HRz Pitstop Community Events, Workshops & Rallies</strong>
              <button class="close-mega" onclick="window.HRz.Menu.closeAll()" aria-label="Close menu">×</button>
            </div>
            <div class="mega-events-cards-flex">
              <a class="mega-event-card upcoming" href="#events?tab=upcoming" onclick="window.HRz.Menu.closeAll()">
                <div class="event-icon-svg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <div class="event-txt">
                  <h3>UPCOMING EVENTS (3 Rallies & Clinics)</h3>
                  <p>Himalayan Expedition 2026, Midnight Auxiliary Light Showcase, & Dirt Bootcamp</p>
                  <span>Explore Upcoming Schedule →</span>
                </div>
              </a>
              <a class="mega-event-card past" href="#events?tab=past" onclick="window.HRz.Menu.closeAll()">
                <div class="event-icon-svg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                </div>
                <div class="event-txt">
                  <h3>PAST EVENTS (Rider Archives)</h3>
                  <p>Ladakh Pitstop Rally 2025 Logbook & Mumbai Cafe Racer Showdown</p>
                  <span>View Photo Galleries & Reports →</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    navContainer.querySelectorAll(".mega-nav-item:not(.direct-link)").forEach(item => {
      const title = item.querySelector(".mega-title");
      if (!title) return;
      title.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains("open");
        navContainer.querySelectorAll(".mega-nav-item").forEach(i => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      };
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".mega-nav-wrapper")) {
        navContainer.querySelectorAll(".mega-nav-item").forEach(i => i.classList.remove("open"));
      }
    });

    navContainer.querySelectorAll(".mega-sidebar-nav .sidebar-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const parentNav = btn.parentElement;
        parentNav.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      };
    });
  }

  /* =============================================
     MOBILE SIDE DRAWER (GLITCH-FREE & OPTIMIZED)
     ============================================= */
  static renderSideMenuDrawer() {
    let drawer = document.getElementById("mainMenuDrawer");
    if (!drawer) {
      drawer = document.createElement("aside");
      drawer.id = "mainMenuDrawer";
      drawer.className = "menu-side-drawer";
      drawer.setAttribute("aria-label", "Main Category Menu");
      document.body.appendChild(drawer);
    }

    const escapeHTML = window.HRz.Utils ? window.HRz.Utils.escapeHTML : (s) => s;
    const { shopByBike, accessories, ridingGears, luggageTouring, helmetsAccessories, brands } = this.menuData;

    drawer.innerHTML = `
      <div class="menu-drawer-header">
        <div class="menu-drawer-brand"><span>HRz</span> <i>MENU</i></div>
        <button class="close-menu-drawer" id="closeMenuDrawerBtn" aria-label="Close menu">×</button>
      </div>
      
      <div class="menu-drawer-search">
        <input type="text" placeholder="Search brands, bikes or gear..." id="drawerSearchInput" autocapitalize="off" autocomplete="off" />
        <button id="drawerSearchGo">GO</button>
      </div>

      <div class="menu-drawer-content">
        <div class="accordion-group">

          <!-- SHOP BY BIKE -->
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>SHOP BY BIKE</span>
              <i class="chevron">+</i>
            </button>
            <div class="accordion-body">
              <div class="mobile-grid-2col">
                ${Object.keys(shopByBike).map(brand => `
                  <a class="mobile-grid-btn" href="#catalog?search=${encodeURIComponent(brand)}" onclick="window.HRz.Menu.closeAll()">${escapeHTML(brand)}</a>
                `).join("")}
              </div>
              <div class="mobile-view-all-wrap">
                <a class="mobile-view-all-btn" href="#catalog" onclick="window.HRz.Menu.closeAll()">VIEW ALL MOTORCYCLES →</a>
              </div>
            </div>
          </div>

          <!-- MOTORCYCLE ACCESSORIES -->
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>MOTORCYCLE ACCESSORIES</span>
              <i class="chevron">+</i>
            </button>
            <div class="accordion-body">
              <div class="mobile-list-vertical">
                ${Object.keys(accessories).map(cat => `
                  <a class="mobile-list-btn" href="#catalog?search=${encodeURIComponent(cat)}" onclick="window.HRz.Menu.closeAll()">
                    <span>${escapeHTML(cat)}</span>
                    <i>→</i>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- RIDING GEARS -->
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>RIDING GEARS</span>
              <i class="chevron">+</i>
            </button>
            <div class="accordion-body">
              <div class="mobile-list-vertical">
                ${ridingGears.cards.map(c => `
                  <a class="mobile-list-btn" href="#catalog?search=${encodeURIComponent(c.name)}" onclick="window.HRz.Menu.closeAll()">
                    <span>${escapeHTML(c.name)}</span>
                    <i>→</i>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- LUGGAGE & TOURING -->
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>LUGGAGE & TOURING</span>
              <i class="chevron">+</i>
            </button>
            <div class="accordion-body">
              <div class="mobile-list-vertical">
                ${luggageTouring.cards.map(l => `
                  <a class="mobile-list-btn" href="#catalog?search=${encodeURIComponent(l.search)}" onclick="window.HRz.Menu.closeAll(false, true)">
                    <span>${escapeHTML(l.name)}</span>
                    <i>→</i>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- HELMETS & ACCESSORIES -->
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>HELMETS & ACCESSORIES</span>
              <i class="chevron">+</i>
            </button>
            <div class="accordion-body">
              <div class="mobile-list-vertical">
                ${helmetsAccessories.cards.map(h => `
                  <a class="mobile-list-btn" href="#catalog?search=${encodeURIComponent(h.search)}" onclick="window.HRz.Menu.closeAll(false, true)">
                    <span>${escapeHTML(h.name)}</span>
                    <i>→</i>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- BRANDS -->
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>BRANDS (${brands.length})</span>
              <i class="chevron">+</i>
            </button>
            <div class="accordion-body">
              <div class="mobile-brands-grid">
                ${brands.map(b => `
                  <a class="mobile-brand-chip" href="#catalog?search=${encodeURIComponent(b)}" onclick="window.HRz.Menu.closeAll(false, true)">${escapeHTML(b)}</a>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- EVENTS & RIDES -->
          <div class="accordion-item direct">
            <a class="accordion-direct-link" href="#events" onclick="window.HRz.Menu.closeAll(false, true)">
              <span>EVENTS & RIDES</span>
              <i>→</i>
            </a>
          </div>

          <!-- HELP & SUPPORT -->
          <div class="accordion-item direct">
            <a class="accordion-direct-link" href="#help" onclick="window.HRz.Menu.closeAll(false, true)">
              <span>HELP & SUPPORT</span>
              <i>→</i>
            </a>
          </div>

          <!-- ABOUT US -->
          <div class="accordion-item direct">
            <a class="accordion-direct-link" href="#about" onclick="window.HRz.Menu.closeAll(false, true)">
              <span>ABOUT US</span>
              <i>→</i>
          <!-- EVENTS -->
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>EVENTS</span>
              <i class="chevron">+</i>
            </button>
            <div class="accordion-body">
              <div class="mobile-list-vertical">
                <a class="mobile-list-btn" href="#events?tab=upcoming" onclick="window.HRz.Menu.closeAll(false, true)">
                  <span>UPCOMING EVENTS</span>
                  <i>→</i>
                </a>
                <a class="mobile-list-btn" href="#events?tab=past" onclick="window.HRz.Menu.closeAll(false, true)">
                  <span>PAST EVENTS</span>
                  <i>→</i>
                </a>
              </div>
            </div>
          </div>

        </div>

        <div class="drawer-footer-nav">
          <a href="#garage" onclick="window.HRz.Menu.closeAll(false, true)">My Garage</a>
          <a href="#tracking" onclick="window.HRz.Menu.closeAll(false, true)">Orders</a>
          <a href="#reviews" onclick="window.HRz.Menu.closeAll(false, true)">Reviews</a>
          <a href="#help" onclick="window.HRz.Menu.closeAll(false, true)">FAQ</a>
        </div>
      </div>
    `;
  }

  static bindMenuEvents() {
    const mainMenuBtn = document.getElementById("mainMenuBtn");
    const closeBtn = document.getElementById("closeMenuDrawerBtn");

    if (mainMenuBtn) {
      mainMenuBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openDrawer();
      };
    }
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeAll();
      };
    }

    const drawerSearchGo = document.getElementById("drawerSearchGo");
    const drawerSearchInput = document.getElementById("drawerSearchInput");
    if (drawerSearchGo && drawerSearchInput) {
      const handleSearch = () => {
        const val = drawerSearchInput.value.trim();
        if (val) {
          window.location.hash = `catalog?search=${encodeURIComponent(val)}`;
          this.closeAll(false, true);
        }
      };
      drawerSearchGo.onclick = handleSearch;
      drawerSearchInput.onkeydown = (e) => { if (e.key === "Enter") handleSearch(); };
    }

    document.querySelectorAll("#mainMenuDrawer .accordion-toggle").forEach(toggle => {
      toggle.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = toggle.parentElement;
        const isOpen = item.classList.contains("active");
        
        // Optionally close other active items in mobile view for cleaner viewing
        item.parentElement.querySelectorAll(".accordion-item").forEach(i => {
          if (i !== item) {
            i.classList.remove("active");
            const ch = i.querySelector(".chevron");
            if (ch) ch.textContent = "+";
          }
        });

        item.classList.toggle("active", !isOpen);
        const chevron = toggle.querySelector(".chevron");
        if (chevron) chevron.textContent = !isOpen ? "–" : "+";
      };
    });
  }

  static openDrawer() {
    const drawer = document.getElementById("mainMenuDrawer");
    const overlay = document.getElementById("overlay");
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevents mobile background scrolling glitch
    
    if (!window.history.state || !window.history.state.panelOpen) {
      window.history.pushState({ panelOpen: true }, "");
    }
  }

  static closeAll(isPopState = false, skipHistory = false) {
    const drawer = document.getElementById("mainMenuDrawer");
    const overlay = document.getElementById("overlay");
    const wasOpen = drawer && drawer.classList.contains("open");
    if (drawer) drawer.classList.remove("open");
    if (!document.getElementById("cartDrawer")?.classList.contains("open") &&
        !document.getElementById("searchPanel")?.classList.contains("open")) {
      if (overlay) overlay.classList.remove("open");
    }
    document.querySelectorAll(".mega-nav-item").forEach(item => item.classList.remove("open"));
    document.body.style.overflow = ""; // Restores background scrolling
    
    if (wasOpen && !isPopState && window.history.state && window.history.state.panelOpen) {
      if (!skipHistory) {
        window.history.back();
      } else {
        window.history.replaceState({}, "");
      }
    }
  }

  static navigateToSearch(query) {
    window.location.hash = `catalog?search=${encodeURIComponent(query)}`;
    this.closeAll();
  }

  /* =============================================
     ABOUT US & EVENTS RENDERERS (ZERO EMOJI)
     ============================================= */
  static renderAbout(container) {
    container.innerHTML = `
      <div class="breadcrumb-trail" style="padding: 20px 4.5vw 0;">
        <a href="#home">Home</a> / <span class="current">About Us</span>
      </div>

      <!-- TELEMETRY HERO SECTION -->
      <section class="about-hero">
        <div class="telemetry-bar">
          <span class="status-indicator"></span>
          <code>// TELEMETRY: HIGHWAY PROVED • TRACK CERTIFIED • REDLINE TESTED //</code>
        </div>
        <div class="about-hero-content">
          <p class="eyebrow red">INDIA'S ELITE RIDER SYNDICATE</p>
          <h1>WE DON'T FOLLOW ROADS.<br />WE FORGE <em>LEGENDS.</em></h1>
          <div class="racing-accent-line"></div>
          <p class="lead-text">"Your machine is not just steel and combustion—it's an identity forged in titanium and asphalt. HRz Pitstop exists to defend the bond between rider and horizon with uncompromising engineering."</p>
        </div>
      </section>

      <!-- THE RIDER'S CREED & MANIFESTO BOX -->
      <section class="about-manifesto-box section">
        <div class="manifesto-top-bar">
          <div class="manifesto-title">
            <span class="pulse-dot"></span>
            <strong>THE HRZ RIDER'S CREED // WHY WE EXIST</strong>
          </div>
          <span class="manifesto-tag">[ ZERO COMPROMISE PROTOCOL ]</span>
        </div>
        <div class="manifesto-quotes-grid">
          <div class="quote-tile">
            <div class="tile-header">
              <span class="q-number">01 //</span>
              <span class="q-badge">ARMOR</span>
            </div>
            <h4>"ASPHALT NEVER FORGIVES. NEITHER DO WE."</h4>
            <p>We reject questionable welds, flimsy brackets, and imitation armor. Every part in our engineering bay must survive punishing high-frequency engine vibration and monsoon cloudbursts before touching your motorcycle.</p>
          </div>
          <div class="quote-tile highlight-tile">
            <div class="tile-header">
              <span class="q-number">02 //</span>
              <span class="q-badge red-badge">PHILOSOPHY</span>
            </div>
            <h4>"BORN FOR THE REDLINE. PROVEN ON REAL ROADS."</h4>
            <p>From Khardung La's suffocating zero-degree passes to high-speed weekend switchbacks on the blacktop, our protective crash armor and performance exhausts are validated by veteran riders who push past the absolute limit.</p>
          </div>
          <div class="quote-tile">
            <div class="tile-header">
              <span class="q-number">03 //</span>
              <span class="q-badge">PRECISION</span>
            </div>
            <h4>"BOLT-ON PRECISION. ZERO CHASSIS HACKS."</h4>
            <p>Your frame is sacred. Every crash guard, bash plate, and auxiliary fog mount comes with a definitive 100% direct bolt-on guarantee—no hacking, no makeshift drilling, no structural compromises.</p>
          </div>
        </div>
      </section>

      <!-- ILLUMINATED STATS GRID -->
      <section class="about-stats-grid">
        <div class="stat-card racing-card">
          <div class="card-accent-bar"></div>
          <h2>100%</h2>
          <strong>GENUINE CERTIFIED PARTS</strong>
          <span class="tech-spec-badge">[ DOT / ECE 22.06 / CE LEVEL 2 ]</span>
          <p>Sourced straight from global legends like AGV, Alpinestars, Denali, Sena & Rynox.</p>
        </div>
        <div class="stat-card racing-card">
          <div class="card-accent-bar"></div>
          <h2>50,000+</h2>
          <strong>RIDERS ARMORED & READY</strong>
          <span class="tech-spec-badge">[ HIGHWAY & TRACK VETERANS ]</span>
          <p>From cross-country ADV expeditions to weekend track days, our equipment endures extreme abuse.</p>
        </div>
        <div class="stat-card racing-card">
          <div class="card-accent-bar"></div>
          <h2>250+</h2>
          <strong>VERIFIED BIKE MODELS</strong>
          <span class="tech-spec-badge">[ LASER-MAPPED FITMENT ]</span>
          <p>Precision 3D CAD modeling and custom fitment verification for Royal Enfield, KTM, BMW, Yamaha & Ducati.</p>
        </div>
        <div class="stat-card racing-card">
          <div class="card-accent-bar"></div>
          <h2>ZERO</h2>
          <strong>COMPROMISES ALLOWED</strong>
          <span class="tech-spec-badge">[ EXPRESS INSURED SHIPPING ]</span>
          <p>Complimentary priority shipping on orders above ₹2,999 with complete warranty backing.</p>
        </div>
      </section>

      <!-- THE ENGINEERING BAY & NARRATIVE -->
      <section class="about-narrative section">
        <div class="narrative-col">
          <p class="eyebrow gold">ENGINEERED FOR THE UNTAMED // EST. 2024</p>
          <h2>WHEN THE TACHOMETER NEEDLE HITS <em>REDLINE.</em></h2>
          
          <blockquote class="rider-quote-box">
            "When you hit top gear on a rain-drenched stretch of midnight highway, you shouldn't wonder if your auxiliary lights will short or if your luggage rack will hold. You should only feel pure, unadulterated freedom."
          </blockquote>

          <p>At HRz Pitstop, we eliminate guesswork. Our technical crew works tirelessly to test, torture, and verify every single product before inducting it into our catalog. If we wouldn't mount it on our own personal superbikes and ADVs, it doesn't leave our shop.</p>
          
          <div class="about-tech-specs-list">
            <div class="tech-row">
              <span class="spec-tag">[PRO-ALLOY]</span>
              <div>
                <strong>Laser-Cut T6 Aluminum Bash Plates & Sliders</strong>
                <p>Built to absorb destructive impact kinetic energy without transferring stress to your mounting engine bolts.</p>
              </div>
            </div>
            <div class="tech-row">
              <span class="spec-tag">[IP68 RATED]</span>
              <div>
                <strong>Submersible Auxiliary Lighting & Relay Harnesses</strong>
                <p>Zero voltage drops, plug-and-play wiring loops, and high-penetration amber/white LED optic beam patterns.</p>
              </div>
            </div>
            <div class="tech-row">
              <span class="spec-tag">[EXPEDITION]</span>
              <div>
                <strong>Ballistic Nylon Touring Luggage & Saddlebags</strong>
                <p>Ultrasonic welded storm-proof dry seams designed for thousands of kilometers of relentless high-speed buffeting.</p>
              </div>
            </div>
          </div>

          <div style="margin-top: 32px; display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="#catalog" class="button button-red">Explore Verified Catalog <span>→</span></a>
            <a href="#garage" class="accent-button">Configure Your Garage <span>→</span></a>
          </div>
        </div>
        
        <div class="narrative-col image-box">
          <div class="tech-image-wrapper">
            <div class="corner-bracket top-left"></div>
            <div class="corner-bracket top-right"></div>
            <div class="corner-bracket bottom-left"></div>
            <div class="corner-bracket bottom-right"></div>
            <img src="images/hero-rider.png" alt="HRz Pitstop Garage & Custom Tuning Bay" class="about-img-frame" />
            <div class="telemetry-overlay">
              <code>LAT: 28.6139° N | LON: 77.2090° E // BAY OPERATIONAL</code>
            </div>
          </div>
          <div class="img-badge-floating">EST. 2024 • INDIA'S HIGH-PERFORMANCE PITSTOP</div>
        </div>
      </section>

      <!-- SYNDICATE CALL TO ACTION -->
      <section class="about-cta section">
        <div class="cta-card racing-cta">
          <div class="cta-glow-bg"></div>
          <span class="cta-pre">READY TO UPGRADE YOUR MACHINE?</span>
          <h3>HAVE A CUSTOM BUILD OR ADV EXPEDITION IN MIND?</h3>
          <p>Our veteran pit crew is on standby to assist with custom electrical load balancing, ADV crash protection layouts, and track-day riding gear fitting.</p>
          <div class="cta-actions-flex">
            <a href="#help" class="button button-red">Talk to an HRz Specialist Today <span>→</span></a>
            <a href="#events" class="accent-button">View Community Meetups & Rallies <span>→</span></a>
          </div>
        </div>
      </section>
    `;
  }

  static renderEvents(container, activeTab = "upcoming") {
    if (!activeTab || (activeTab !== "upcoming" && activeTab !== "past")) {
      activeTab = "upcoming";
    }

    container.innerHTML = `
      <div class="breadcrumb-trail" style="padding: 20px 4.5vw 0;">
        <a href="#home">Home</a> / <span class="current">Events & Rallies</span>
      </div>

      <section class="events-hero">
        <div>
          <p class="eyebrow red">JOIN THE HRZ COMMUNITY</p>
          <h1>RIDE OUTS, MEETS & <em>TRACK DAYS</em></h1>
          <p class="lead-text">Experience high-altitude expeditions, technical hands-on workshops, and community night rides with fellow enthusiasts.</p>
        </div>
      </section>

      <div class="events-tabs-bar">
        <a href="#events?tab=upcoming" class="event-tab ${activeTab === 'upcoming' ? 'active' : ''}">UPCOMING EVENTS (3)</a>
        <a href="#events?tab=past" class="event-tab ${activeTab === 'past' ? 'active' : ''}">PAST EVENTS (3)</a>
      </div>

      <section class="events-list section">
        ${activeTab === "upcoming" ? this.getUpcomingEventsHTML() : this.getPastEventsHTML()}
      </section>
    `;
  }

  static getUpcomingEventsHTML() {
    return `
      <div class="event-cards-grid">
        <div class="event-card upcoming">
          <div class="event-date-badge">
            <span class="month">OCT</span>
            <span class="day">14-22</span>
            <span class="year">2026</span>
          </div>
          <div class="event-details">
            <span class="event-tag">EXPEDITION & RALLY</span>
            <h3>HIMALAYAN CONQUEROR RIDE-OUT 2026</h3>
            <p class="event-location">📍 Route: Chandigarh → Manali → Sarchu → Leh → Khardung La</p>
            <p>Join an elite pack of 40 ADV riders on a high-altitude endurance rally. Includes complete mechanical pit-crew follow vehicle, oxygen backup, night campfire clinics, and pre-ride bike protection inspections.</p>
            <div class="event-meta">
              <span>Eligible: All ADVs 250cc+ (Himalayan, KTM 390, BMW GS, Tiger)</span>
              <button class="button button-red" onclick="alert('Registration interest recorded! Our pit crew will contact you within 24 hours.')">Register Interest <span>→</span></button>
            </div>
          </div>
        </div>

        <div class="event-card upcoming">
          <div class="event-date-badge">
            <span class="month">NOV</span>
            <span class="day">05</span>
            <span class="year">2026</span>
          </div>
          <div class="event-details">
            <span class="event-tag">WORKSHOP & SHOWCASE</span>
            <h3>MIDNIGHT AUXILIARY LIGHTING CLINIC & TEST RIDE</h3>
            <p class="event-location">📍 HRz Flagship Studio & Highway Circuit, Gurgaon / NCR</p>
            <p>Witness live comparisons of Denali, Future Eyes, and Maddog LED fog lights in total darkness. Master professional wiring harnesses, alternator load balancing, and fog penetration angles with HRz master electricians.</p>
            <div class="event-meta">
              <span>Free Admission • Complimentary Refreshments</span>
              <button class="button button-red" onclick="alert('You have been RSVPd for the Lighting Clinic!')">Reserve Free Seat <span>→</span></button>
            </div>
          </div>
        </div>

        <div class="event-card upcoming">
          <div class="event-date-badge">
            <span class="month">DEC</span>
            <span class="day">12</span>
            <span class="year">2026</span>
          </div>
          <div class="event-details">
            <span class="event-tag">OFF-ROAD TRAINING</span>
            <h3>WESTERN GHATS DIRT & SLIDER BOOTCAMP</h3>
            <p class="event-location">📍 Adventure Dirt Park, Lonavala / Pune</p>
            <p>Put your crash guards, bash plates, and frame sliders to the ultimate test in a controlled trail environment. Learn rock crossings, gravel braking, and quick motorcycle recovery techniques from certified rally trainers.</p>
            <div class="event-meta">
              <span>Limited to 25 Riders • Protective Armor Mandatory</span>
              <button class="button button-red" onclick="alert('Bootcamp registration initiated! Check your email for equipment criteria.')">Join Bootcamp <span>→</span></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static getPastEventsHTML() {
    return `
      <div class="event-cards-grid">
        <div class="event-card past">
          <div class="event-date-badge past-badge">
            <span class="month">JUL</span>
            <span class="day">18</span>
            <span class="year">2025</span>
          </div>
          <div class="event-details">
            <span class="event-tag completed">COMPLETED RALLY</span>
            <h3>LADAKH PITSTOP RALLY 2025</h3>
            <p class="event-location">📍 Leh, Ladakh • 2,400+ km Trapped & Tamed</p>
            <p>Over 250 riders successfully tackled water crossings and zero-degree temperatures. ZERO chassis damages reported across all bikes running HRz Heavy-Duty Crash Guards and Skid Plates.</p>
            <div class="event-meta">
              <span>250+ Participants • 14 Days</span>
              <button class="accent-button" onclick="alert('Viewing Ladakh Rally 2025 Photo & Technical Logbook!')">View Rally Logbook <span>→</span></button>
            </div>
          </div>
        </div>

        <div class="event-card past">
          <div class="event-date-badge past-badge">
            <span class="month">MAY</span>
            <span class="day">22</span>
            <span class="year">2025</span>
          </div>
          <div class="event-details">
            <span class="event-tag completed">EXHIBITION</span>
            <h3>CAFE RACER & CUSTOM BUILD SHOWDOWN</h3>
            <p class="event-location">📍 Marine Drive & Custom Bay, Mumbai</p>
            <p>A high-octane gathering of custom Continental GT 650s, Interceptor mods, and Hunter 350 streetfighters featuring custom clip-ons, CNC bar-end mirrors, and performance exhaust acoustics.</p>
            <div class="event-meta">
              <span>120+ Customs Showcased</span>
              <button class="accent-button" onclick="alert('Opening Cafe Racer Gallery!')">View Custom Builds <span>→</span></button>
            </div>
          </div>
        </div>

        <div class="event-card past">
          <div class="event-date-badge past-badge">
            <span class="month">JAN</span>
            <span class="day">10</span>
            <span class="year">2025</span>
          </div>
          <div class="event-details">
            <span class="event-tag completed">NIGHT TEST</span>
            <h3>MONSOON NIGHT VISIBILITY PROTOCOL TEST</h3>
            <p class="event-location">📍 Malshej Ghats Night Circuit</p>
            <p>Extreme rainfall and blinding mist test rides to certify IP68 waterproof rating on all touring saddlebags, tank bags, and yellow fog light beam patterns before catalog induction.</p>
            <div class="event-meta">
              <span>Verified 14 Lighting Kits</span>
              <button class="accent-button" onclick="alert('Downloading Tech Validation Report!')">Download Report <span>→</span></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

window.HRz.Menu = Menu;
