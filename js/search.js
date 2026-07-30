/* =============================================
   HRz PITSTOP – Search Panel & Autocomplete Module
   Adapted for editorial design search panel
   ============================================= */

window.HRz = window.HRz || {};

class SearchEngine {
  static init() {
    const input = document.getElementById("globalSearch");
    const popover = document.getElementById("searchAutocomplete");

    if (!input || !popover) return;

    const handleSearch = window.HRz.Utils.debounce(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        popover.innerHTML = "";
        return;
      }

      const activeBike = window.HRz.Storage.getActiveBike();
      const products = window.HRz.DB.getProductsForBike(activeBike);

      const matches = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        popover.innerHTML = `<p style="padding:14px;color:#666;">No gear found. Try crash guard or helmet.</p>`;
      } else {
        popover.innerHTML = matches.map(p => `
          <div class="autocomplete-item" data-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <div class="info">
              <strong>${p.name}</strong>
              <small>${p.category} · ${window.HRz.Utils.formatCurrency(p.price)}</small>
            </div>
          </div>
        `).join("");
      }

      popover.querySelectorAll(".autocomplete-item").forEach(item => {
        item.onclick = () => {
          const id = item.dataset.id;
          popover.innerHTML = "";
          input.value = "";
          // Close search panel
          document.getElementById("searchPanel")?.classList.remove("open");
          document.getElementById("overlay")?.classList.remove("open");
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
          document.getElementById("searchPanel")?.classList.remove("open");
          document.getElementById("overlay")?.classList.remove("open");
          window.location.hash = `catalog?search=${encodeURIComponent(q)}`;
        }
      }
    });
  }
}

window.HRz.Search = SearchEngine;
