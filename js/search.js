/* =============================================
   HRz PITSTOP – Header Search & Autocomplete Module
   ============================================= */

window.HRz = window.HRz || {};

class SearchEngine {
  static init() {
    const input = document.getElementById("globalSearch");
    const goBtn = document.getElementById("globalSearchGo");
    const popover = document.getElementById("searchAutocomplete");

    if (!input || !popover) return;

    const handleSearch = window.HRz.Utils.debounce(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        popover.classList.remove("show");
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
        popover.innerHTML = `<div class="autocomplete-no-results">No parts matching "${q}"</div>`;
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

      popover.classList.add("show");

      popover.querySelectorAll(".autocomplete-item").forEach(item => {
        item.onclick = () => {
          const id = item.dataset.id;
          popover.classList.remove("show");
          input.value = "";
          window.location.hash = `product?id=${id}`;
        };
      });
    }, 200);

    input.addEventListener("input", handleSearch);

    if (goBtn) {
      goBtn.onclick = () => {
        const q = input.value.trim();
        if (q) {
          popover.classList.remove("show");
          window.location.hash = `catalog?search=${encodeURIComponent(q)}`;
        }
      };
    }

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !popover.contains(e.target)) {
        popover.classList.remove("show");
      }
    });
  }
}

window.HRz.Search = SearchEngine;
