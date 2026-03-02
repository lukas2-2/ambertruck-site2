(function(){
  const BASE = (window.SITE_CONFIG && window.SITE_CONFIG.BASE_URL) ? window.SITE_CONFIG.BASE_URL.replace(/\/$/,'') : '';

  function text(el){ return (el && (el.textContent||'').trim()) || ''; }
  function numFromPrice(s){
    const d = (s||'').replace(/[^\d]/g,'');
    return d ? Number(d) : null;
  }
  function ensureJsonLd(id, obj){
    let el = document.getElementById(id);
    if(!el){
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(obj, null, 2);
  }

  function buildBreadcrumb(){
    const bc = document.querySelector('[data-breadcrumb]');
    if(!bc) return;
    const parts = bc.getAttribute('data-breadcrumb').split('|').map(s=>s.trim()).filter(Boolean);
    const itemListElement = parts.map((name, i) => {
      const li = {"@type":"ListItem","position": i+1,"name": name};
      if(i === 0){
        li.item = (BASE ? BASE + '/' : '/');
      }
      return li;
    });
    ensureJsonLd('jsonld-breadcrumbs', {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement": itemListElement});
  }

  function buildProductsJsonLd(){
    const cards = Array.from(document.querySelectorAll('.product-card, .product-info'));
    if(!cards.length) return;

    const products = [];
    cards.forEach((c) => {
      const nameEl = c.querySelector('.product-title, .product-name, h3, h4, .title, strong') || c;
      const priceEl = c.querySelector('.product-price, .price') || c.closest('.product')?.querySelector('.price');
      const codeEl = c.querySelector('.product-code, .code, .sku') || c;

      const name = text(nameEl);
      const price = numFromPrice(text(priceEl));
      if(!name || price === null) return;

      let code = text(codeEl);
      const m = code.match(/(код|артикул)\s*[:#]?\s*([A-Za-z0-9\-\_]+)/i);
      if(m) code = m[2]; else code = '';

      products.push({
        "@type":"Product",
        "name": name,
        "brand":{"@type":"Brand","name":"Ambertruck"},
        "sku": code || undefined,
        "offers":{
          "@type":"Offer",
          "priceCurrency":"RUB",
          "price": String(price),
          "availability":"https://schema.org/InStock"
        }
      });
    });

    if(!products.length) return;

    ensureJsonLd('jsonld-itemlist', {
      "@context":"https://schema.org",
      "@type":"ItemList",
      "itemListElement": products.map((p, i) => ({"@type":"ListItem","position": i+1,"item": p}))
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    buildBreadcrumb();
    buildProductsJsonLd();
  });
})();