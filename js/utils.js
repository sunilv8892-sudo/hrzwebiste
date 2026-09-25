/* =============================================
   HRz PITSTOP – Shared Utilities & UI Helpers Module
   ============================================= */

window.HRz = window.HRz || {};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function renderStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let starsHtml = "";
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHtml += `<span class="star-icon full">★</span>`;
    } else if (i === fullStars && hasHalf) {
      starsHtml += `<span class="star-icon half">★</span>`;
    } else {
      starsHtml += `<span class="star-icon empty">☆</span>`;
    }
  }
  return `<span class="rating-stars">${starsHtml} <strong class="rating-num">${rating.toFixed(1)}</strong></span>`;
}

function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast-message toast-${type}`;
  const safeMessage = escapeHTML(String(message));
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <span class="toast-text">${safeMessage}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function setupModalAccessibility(modalEl, closeCallback) {
  if (!modalEl) return;

  modalEl.setAttribute("role", "dialog");
  modalEl.setAttribute("aria-modal", "true");
  modalEl.setAttribute("tabindex", "-1");

  const focusableElements = modalEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (firstElement) firstElement.focus();

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (closeCallback) closeCallback();
      modalEl.removeEventListener("keydown", handleKeyDown);
    }

    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  modalEl.addEventListener("keydown", handleKeyDown);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function smartSearch(query, products, activeBike) {
  if (!query) return products;
  
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  if (tokens.length === 0) return products;

  const scoredProducts = products.map(p => {
    let score = 0;
    const nameStr = p.name.toLowerCase();
    const brandStr = p.brand.toLowerCase();
    const catStr = p.category.toLowerCase();
    
    const allWords = [...new Set([...nameStr.split(/\s+/), ...brandStr.split(/\s+/), ...catStr.split(/\s+/)])];
    
    let tokensMatched = 0;
    
    for (const token of tokens) {
      let bestTokenScore = 0;
      
      if (nameStr.includes(token)) bestTokenScore = Math.max(bestTokenScore, 10);
      if (brandStr.includes(token)) bestTokenScore = Math.max(bestTokenScore, 15);
      if (catStr.includes(token)) bestTokenScore = Math.max(bestTokenScore, 15);
      if (p.sku && p.sku.toLowerCase().includes(token)) bestTokenScore = Math.max(bestTokenScore, 20);

      if (p.bike_compatibility) {
          for (const b of p.bike_compatibility) {
              if (b.toLowerCase().includes(token)) {
                  bestTokenScore = Math.max(bestTokenScore, 12);
              }
          }
      }
      
      if (bestTokenScore === 0 && token.length > 3) {
         for (const w of allWords) {
             if (w.length > 3) {
                 const dist = levenshtein(token, w);
                 const maxTypos = w.length >= 6 ? 2 : 1;
                 if (dist <= maxTypos) {
                     bestTokenScore = Math.max(bestTokenScore, 8 - dist);
                 }
             }
         }
      }
      
      if (bestTokenScore > 0) {
        score += bestTokenScore;
        tokensMatched++;
      }
    }
    
    if (tokensMatched === 0) return { product: p, score: 0 };
    
    if (tokensMatched === tokens.length) {
       score *= 2.0; 
    } else if (tokensMatched > 0) {
       score *= (tokensMatched / tokens.length);
    }
    
    if (activeBike && window.HRz.DB && window.HRz.DB.checkFitment) {
        if (window.HRz.DB.checkFitment(p.id, activeBike)) {
            score += 10;
        }
    }
    
    return { product: p, score: score };
  });
  
  return scoredProducts
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}

window.HRz.Utils = { formatCurrency, renderStarRating, showToast, setupModalAccessibility, debounce, escapeHTML, levenshtein, smartSearch };
