/* =============================================
   HRz PITSTOP – Dynamic SEO & JSON-LD Structured Data Engine
   ============================================= */

window.HRz = window.HRz || {};

class SEOService {
  static updateSEOForView(viewName, data = {}) {
    this.updateCanonicalURL(viewName, data);
    this.injectJSONLD(viewName, data);
  }

  static updateCanonicalURL(viewName, data = {}) {
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    const baseURL = window.location.origin + window.location.pathname;
    let url = baseURL;
    if (viewName === "product" && data.product) {
      url = `${baseURL}?view=product&id=${data.product.id}`;
    } else if (viewName !== "home") {
      url = `${baseURL}?view=${viewName}`;
    }
    canonical.setAttribute("href", url);
  }

  static injectJSONLD(viewName, data = {}) {
    const existingScript = document.getElementById("dynamic-jsonld");
    if (existingScript) existingScript.remove();

    const schemas = [];

    schemas.push({
      "@context": "https://schema.org",
      "@type": "MotorcycleStore",
      "name": "HRz Pitstop",
      "url": window.location.origin,
      "logo": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23e63946'/><text x='50' y='68' font-size='52' font-weight='900' text-anchor='middle' fill='white' font-family='sans-serif'>HRz</text></svg>",
      "description": "India's #1 Motorcycle Accessories & Riding Gear Store with Verified Fitment Guarantee.",
      "telephone": "+91 98765 43210",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "addressCountry": "IN"
      }
    });

    const breadcrumbItems = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin }
    ];

    if (viewName === "catalog") {
      breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": "Catalog", "item": `${window.location.origin}/#catalog` });
    } else if (viewName === "product" && data.product) {
      breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": "Catalog", "item": `${window.location.origin}/#catalog` });
      breadcrumbItems.push({ "@type": "ListItem", "position": 3, "name": data.product.name, "item": `${window.location.origin}/#product?id=${data.product.id}` });
      
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data.product.name,
        "image": [data.product.image],
        "description": data.product.highlights ? data.product.highlights.join(". ") : data.product.name,
        "sku": data.product.sku,
        "brand": {
          "@type": "Brand",
          "name": "HRz Pitstop"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "INR",
          "price": data.product.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": data.product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "HRz Pitstop"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": data.product.rating || "4.9",
          "reviewCount": data.product.reviewCount || "150"
        }
      });
    }

    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    });

    const script = document.createElement("script");
    script.id = "dynamic-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemas, null, 2);
    document.head.appendChild(script);
  }
}

window.HRz.SEO = SEOService;
