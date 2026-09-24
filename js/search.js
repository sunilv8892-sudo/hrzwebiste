/* =============================================
   HRz PITSTOP – Search Panel & Autocomplete Module
   Adapted for editorial design search panel
   ============================================= */

window.HRz = window.HRz || {};

class SearchEngine {
  static init() {
    const input = document.getElementById("globalSearch");
    const popover = document.getElementById("searchAutocomplete");
    const escapeHTML = window.HRz.Utils.escapeHTML;

    if (!input || !popover) return;

    const handleSearch = window.HRz.Utils.debounce(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        popover.innerHTML = "";
        return;
      }

      const activeBike = window.HRz.Storage.getActiveBike();
      const allProducts = window.HRz.DB.products;
      const bikeProducts = window.HRz.DB.getProductsForBike(activeBike);
      const bikeProductIds = new Set(bikeProducts.map(p => p.id));

      const matches = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      ).sort((a, b) => {
        const aFit = bikeProductIds.has(a.id) ? 1 : 0;
        const bFit = bikeProductIds.has(b.id) ? 1 : 0;
        return bFit - aFit;
      }).slice(0, 5);

      if (matches.length === 0) {
        popover.innerHTML = `<p style="padding:14px;color:#666;">No gear found. Try crash guard or helmet.</p>`;
      } else {
        popover.innerHTML = matches.map(p => `
          <div class="autocomplete-item" data-id="${escapeHTML(p.id)}">
            <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" />
            <div class="info">
              <strong>${escapeHTML(p.name)}</strong>
              <small>${escapeHTML(p.category)} · ${window.HRz.Utils.formatCurrency(p.price)}</small>
            </div>
          </div>
        `).join("");
      }

      popover.querySelectorAll(".autocomplete-item").forEach(item => {
        item.onclick = () => {
          const id = item.dataset.id;
          popover.innerHTML = "";
          input.value = "";
          // Close search panel properly
          if (window.HRz.App) {
            window.HRz.App.closeAllPanels(false, true);
          } else {
            document.getElementById("searchPanel")?.classList.remove("open");
            document.getElementById("overlay")?.classList.remove("open");
          }
          window.location.hash = `product?id=${id}`;
        };
      });
    }, 200);

    input.addEventListener("input", handleSearch);

    // Enter key to go to catalog search
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = input.value.trim();
        if (q) {
          popover.innerHTML = "";
          if (window.HRz.App) {
            window.HRz.App.closeAllPanels(false, true);
          } else {
            document.getElementById("searchPanel")?.classList.remove("open");
            document.getElementById("overlay")?.classList.remove("open");
          }
          window.location.hash = `catalog?search=${encodeURIComponent(q)}`;
        }
      }
    });
  }
}

window.HRz.Search = SearchEngine;
