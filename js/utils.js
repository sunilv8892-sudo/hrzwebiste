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

window.HRz.Utils = { formatCurrency, renderStarRating, showToast, setupModalAccessibility, debounce, escapeHTML };
