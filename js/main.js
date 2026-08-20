/* FITS - Scripts */

document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Update Cart Icon
  if (window.FITS_DB) {
    window.FITS_DB.updateCartIcon();
  }

  // Find dynamic grid
  const grid = document.getElementById('products-grid');
  if (grid && window.FITS_DB) {
    const pageType = grid.dataset.page;
    renderGrid(grid, pageType);

    // Setup filters for products.html and al-mayor.html
    const checkboxes = document.querySelectorAll('aside .form-check-input');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', () => renderGrid(grid, pageType));
    });
  }

  // Handle Cart Page
  const cartContainer = document.getElementById('cart-items-container');
  if (cartContainer && window.FITS_DB) {
    renderCart(cartContainer);
  }
});

function renderGrid(grid, pageType) {
  let products = window.FITS_DB.getProducts();

  // Filter based on explicit toggles if they exist (backward compatibility for old products)
  if (pageType === 'products') {
    products = products.filter(p => p.showInProducts !== false); // default to true if undefined
  } else if (pageType === 'ofertas') {
    products = products.filter(p => p.showInOffers === true || (p.showInOffers === undefined && p.salePrice !== null));
  } else if (pageType === 'al-mayor') {
    products = products.filter(p => p.showInWholesale === true || p.showInWholesale === undefined);
  } else if (pageType === 'index') {
    // Only show top 3 for index that are marked for products
    products = products.filter(p => p.showInProducts !== false).slice(0, 3);
  } else if (pageType === 'recomendados') {
    products = products.filter(p => p.showInRecommended === true).slice(0, 4);
  }

  // Apply category filters if we are on products or al-mayor
  if (pageType === 'products' || pageType === 'al-mayor') {
    const activeCats = Array.from(document.querySelectorAll('aside .form-check-input:checked'))
      .map(chk => chk.nextElementSibling.textContent.trim());
    
    if (activeCats.length > 0) {
      products = products.filter(p => activeCats.includes(p.category));
    }
  }

  grid.innerHTML = '';
  
  const countEl = document.getElementById('productCount');
  if (countEl) countEl.textContent = `MOSTRANDO ${products.length} RESULTADOS`;

  if (products.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-5 text-on-surface-variant">No se encontraron productos.</div>';
    return;
  }

  products.forEach(p => {
    // Determine price display based on pageType
    let priceHTML = '';
    let isSale = p.salePrice !== null || p.showInOffers;
    let finalPrice = p.price;
    
    if (pageType === 'al-mayor') {
      // 20% discount
      finalPrice = (p.price * 0.8).toFixed(2);
      priceHTML = `
        <div class="d-flex flex-column">
          <span class="font-mono small text-on-surface-variant text-decoration-line-through">$${p.price.toFixed(2)}</span>
          <span class="font-mono fw-semibold text-primary">$${finalPrice}</span>
        </div>
      `;
    } else if (p.salePrice !== null && p.salePrice !== undefined) {
      finalPrice = p.salePrice;
      priceHTML = `
        <div class="d-flex flex-column">
          <span class="font-mono small text-on-surface-variant text-decoration-line-through">$${p.price.toFixed(2)}</span>
          <span class="font-mono fw-semibold text-error">$${finalPrice.toFixed(2)}</span>
        </div>
      `;
    } else {
      priceHTML = `<span class="font-mono fw-semibold text-on-surface">$${finalPrice.toFixed(2)}</span>`;
    }

    const tagHTML = p.tag ? `<span class="product-tag ${p.tag === 'SALE' ? 'sale' : ''}">${p.tag}</span>` : '';
    // default image fallback
    const imgUrl = p.image || 'img/fits%20two.png';

    const card = document.createElement('div');
    // On index, use slightly different cols
    if (pageType === 'index') card.className = 'col-md-6 col-xl-4';
    else if (pageType === 'recomendados') card.className = 'col';
    else card.className = 'col';
    
    card.innerHTML = `
      <div class="product-card">
        <div class="img-wrap">
          <img src="${imgUrl}" alt="${p.name}" />
          ${tagHTML}
        </div>
        <div class="card-body d-flex flex-column flex-grow-1">
          <div class="font-mono label-caps text-on-surface-variant mb-1">${p.category}</div>
          <h3 class="font-headline text-primary mb-2" style="font-size: 18px">${p.name}</h3>
          <div class="mt-auto d-flex align-items-center justify-content-between pt-2">
            ${priceHTML}
            <button
              type="button"
              class="btn btn-primary technical-shadow label-caps d-inline-flex align-items-center gap-1"
              onclick="window.FITS_DB.addToCart('${p.id}', 1, 'M')"
            >
              <span class="material-symbols-outlined" style="font-size: 18px">add_shopping_cart</span>
              AGREGAR
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderCart(container) {
  const cartItems = window.FITS_DB.getCart();
  container.innerHTML = '';
  
  if (cartItems.length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant py-4">Tu carrito está vacío.</p>';
    document.getElementById('cart-subtotal').textContent = '$0.00';
    document.getElementById('cart-total').textContent = '$0.00';
    return;
  }

  let subtotal = 0;
  let cartTextForWhatsApp = 'Hola FITS! Quiero hacer el siguiente pedido:%0A%0A';

  cartItems.forEach(item => {
    const p = window.FITS_DB.getProductById(item.productId);
    if (!p) return;

    const price = p.salePrice || p.price; 
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    cartTextForWhatsApp += `- ${item.quantity}x ${p.name} (Talla: ${item.size}) - $${itemTotal.toFixed(2)}%0A`;

    const imgUrl = p.image || 'img/fits%20two.png';

    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between align-items-center border-bottom border-outline-variant py-3 flex-wrap gap-3';
    row.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${imgUrl}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
        <div>
          <h4 class="font-headline text-primary mb-0" style="font-size:16px;">${p.name}</h4>
          <span class="font-mono small text-on-surface-variant">Talla: ${item.size} | $${price.toFixed(2)}</span>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center bg-surface border border-outline-variant rounded">
          <button class="btn btn-sm btn-link text-on-surface text-decoration-none px-2" onclick="updateQty('${p.id}', '${item.size}', ${item.quantity - 1})">-</button>
          <span class="font-mono px-2">${item.quantity}</span>
          <button class="btn btn-sm btn-link text-on-surface text-decoration-none px-2" onclick="updateQty('${p.id}', '${item.size}', ${item.quantity + 1})">+</button>
        </div>
        <span class="font-mono fw-semibold text-primary">$${itemTotal.toFixed(2)}</span>
        <button class="btn btn-sm btn-link text-error p-0" onclick="updateQty('${p.id}', '${item.size}', 0)">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;
    container.appendChild(row);
  });

  document.getElementById('cart-subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('cart-total').textContent = '$' + subtotal.toFixed(2); // No shipping fee

  cartTextForWhatsApp += `%0ATotal: $${subtotal.toFixed(2)}%0A%0AGracias!`;

  // Attach WhatsApp URL to checkout button
  const checkoutBtn = document.getElementById('btnCheckoutWhatsApp');
  if (checkoutBtn) {
    // Replace YOUR_PHONE_NUMBER with actual number
    const phoneNumber = "1234567890";
    checkoutBtn.href = `https://wa.me/${phoneNumber}?text=${cartTextForWhatsApp}`;
  }
}

// Helper for cart page
window.updateQty = function(productId, size, qty) {
  window.FITS_DB.updateCartQuantity(productId, size, qty);
  renderCart(document.getElementById('cart-items-container'));
};
