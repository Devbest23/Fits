/* FITS - Scripts */

document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Update Cart Icon
  if (window.FITS_DB) {
    window.FITS_DB.updateCartIcon();
  }

  // Render Offers Grid in al-detal.html if present
  const offersGrid = document.getElementById('offers-grid');
  if (offersGrid && window.FITS_DB) {
    renderOffersGrid(offersGrid);
  }

  // Render Comments in index.html if present
  const commentsContainer = document.getElementById('comments-container');
  if (commentsContainer && window.FITS_DB) {
    renderComments(commentsContainer);

    const commentImageFile = document.getElementById('commentImageFile');
    const commentImageInput = document.getElementById('commentImage');

    if (commentImageFile && commentImageInput) {
      commentImageFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es demasiado grande. Por favor sube una imagen menor a 2MB.');
            commentImageFile.value = '';
            commentImageInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = function(evt) {
            commentImageInput.value = evt.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          commentImageInput.value = '';
        }
      });
    }

    const btnSubmitComment = document.getElementById('btnSubmitComment');
    if (btnSubmitComment) {
      btnSubmitComment.addEventListener('click', () => {
        const author = document.getElementById('commentAuthor').value;
        const rating = document.getElementById('commentRating').value;
        const text = document.getElementById('commentText').value;
        const image = commentImageInput ? commentImageInput.value : null;

        if (!author || !text) {
          alert('Por favor completa tu nombre y tu opinión.');
          return;
        }

        window.FITS_DB.addComment(author, rating, text, image);
        
        const modalEl = document.getElementById('commentModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();

        document.getElementById('commentForm').reset();
        if (commentImageInput) commentImageInput.value = '';
        renderComments(commentsContainer);
      });
    }
  }

  // Find dynamic main grid
  const grid = document.getElementById('products-grid');
  if (grid && window.FITS_DB) {
    const pageType = grid.dataset.page;
    renderGrid(grid, pageType);

    // Setup category filters for al-detal.html
    const categoryInputs = document.querySelectorAll('#categories-filter-container input');
    categoryInputs.forEach(chk => {
      chk.addEventListener('change', () => renderGrid(grid, pageType));
    });
  }

  // Handle Cart Page
  const cartContainer = document.getElementById('cart-items-container');
  if (cartContainer && window.FITS_DB) {
    renderCart(cartContainer);
  }
});

function renderComments(container) {
  const comments = window.FITS_DB.getComments();
  container.innerHTML = '';
  
  if (comments.length === 0) {
    container.innerHTML = '<div class="col-12 text-center py-4 text-on-surface-variant">Aún no hay comentarios. ¡Sé el primero en opinar!</div>';
    return;
  }

  comments.forEach(c => {
    let starsSVG = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= c.rating) {
        starsSVG += `<svg class="svg-icon" style="color: #f59e0b; width:16px; height:16px;" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      } else {
        starsSVG += `<svg class="svg-icon" style="color: #cbd5e1; width:16px; height:16px;" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>`;
      }
    }

    const imageHTML = c.image ? `
      <div class="mt-3 overflow-hidden rounded border border-outline-variant" style="max-height: 200px;">
        <img src="${c.image}" alt="Foto del producto" style="width: 100%; height: 200px; object-fit: cover;">
      </div>
    ` : '';

    const initial = c.author ? c.author.charAt(0).toUpperCase() : 'C';

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="glass-panel border border-outline-variant p-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center gap-2">
              <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold font-mono" style="width: 38px; height: 38px; font-size: 14px;">
                ${initial}
              </div>
              <div>
                <h3 class="font-headline text-primary mb-0" style="font-size: 16px;">${c.author}</h3>
                <div class="d-flex align-items-center gap-1 mt-1">${starsSVG}</div>
              </div>
            </div>
            <span class="font-mono small text-on-surface-variant">${c.date}</span>
          </div>
          <p class="text-on-surface-variant mb-0" style="font-size: 14px; line-height: 1.6;">
            "${c.comment}"
          </p>
          ${imageHTML}
        </div>
        <div class="mt-3 pt-3 border-top border-outline-variant d-flex align-items-center gap-1 text-primary small font-mono">
          <svg class="svg-icon text-primary" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          COMPRA VERIFICADA
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderOffersGrid(container) {
  let products = window.FITS_DB.getProducts();
  let offers = products.filter(p => (p.type === 'detal' || !p.type) && (p.isOffer === true || p.salePrice !== null));

  container.innerHTML = '';
  if (offers.length === 0) {
    container.innerHTML = '<div class="col-12 text-center py-4 text-on-surface-variant">No hay ofertas destacadas disponibles por el momento.</div>';
    return;
  }

  offers.forEach(p => {
    const price = p.price;
    const salePrice = p.salePrice || (price * 0.8);
    const imgUrl = p.image || 'img/fits%20two.png';

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="product-card border border-error">
        <div class="img-wrap">
          <img src="${imgUrl}" alt="${p.name}" />
          <span class="product-tag sale">OFERTA</span>
        </div>
        <div class="card-body d-flex flex-column flex-grow-1">
          <div class="font-mono label-caps text-on-surface-variant mb-1">${p.category || 'OFERTA'}</div>
          <h3 class="font-headline text-primary mb-2" style="font-size: 16px">${p.name}</h3>
          <div class="mt-auto d-flex align-items-center justify-content-between pt-2">
            <div class="d-flex flex-column">
              <span class="font-mono small text-on-surface-variant text-decoration-line-through">$${price.toFixed(2)}</span>
              <span class="font-mono fw-semibold text-error">$${salePrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              class="btn btn-primary technical-shadow label-caps d-inline-flex align-items-center gap-1 btn-sm"
              onclick="window.FITS_DB.addToCart('${p.id}', 1, 'M')"
            >
              <span class="material-symbols-outlined" style="font-size: 16px">add_shopping_cart</span>
              AGREGAR
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderGrid(grid, pageType) {
  let products = window.FITS_DB.getProducts();

  if (pageType === 'al-detal') {
    products = products.filter(p => p.type === 'detal' || !p.type);
    
    // Apply category filters
    const activeCatElements = Array.from(document.querySelectorAll('#categories-filter-container input:checked'));
    if (activeCatElements.length > 0) {
      const activeCats = activeCatElements.map(chk => chk.value || chk.nextElementSibling.textContent.trim());
      products = products.filter(p => activeCats.includes(p.category));
    }
  } else if (pageType === 'al-mayor') {
    products = products.filter(p => p.type === 'mayor');
  } else if (pageType === 'index') {
    products = products.filter(p => p.type === 'detal' || !p.type).slice(0, 3);
  } else if (pageType === 'recomendados') {
    products = products.filter(p => p.showInRecommended === true).slice(0, 4);
    if (products.length === 0) {
      products = window.FITS_DB.getProducts().slice(0, 4);
    }
  }

  grid.innerHTML = '';
  
  const countEl = document.getElementById('productCount');
  if (countEl) countEl.textContent = `MOSTRANDO ${products.length} RESULTADOS`;

  if (products.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-5 text-on-surface-variant">No se encontraron productos en esta sección.</div>';
    return;
  }

  products.forEach(p => {
    let priceHTML = '';
    const isMayor = p.type === 'mayor';
    const isSale = (p.isOffer || p.salePrice !== null) && !isMayor;
    const imgUrl = p.image || 'img/fits%20two.png';

    if (isMayor) {
      priceHTML = `
        <div class="d-flex flex-column">
          <span class="badge bg-secondary mb-1 align-self-start font-mono" style="font-size: 0.65rem;">${p.packageQuantity || 10} UNIDADES / PAQ</span>
          <span class="font-mono fw-semibold text-primary">$${p.price.toFixed(2)}</span>
        </div>
      `;
    } else if (isSale) {
      const salePrice = p.salePrice || (p.price * 0.8);
      priceHTML = `
        <div class="d-flex flex-column">
          <span class="font-mono small text-on-surface-variant text-decoration-line-through">$${p.price.toFixed(2)}</span>
          <span class="font-mono fw-semibold text-error">$${salePrice.toFixed(2)}</span>
        </div>
      `;
    } else {
      priceHTML = `<span class="font-mono fw-semibold text-on-surface">$${p.price.toFixed(2)}</span>`;
    }

    let tagHTML = '';
    if (isMayor) {
      tagHTML = '<span class="product-tag" style="background:#0284c7; color:#fff;">AL MAYOR</span>';
    } else if (p.tag) {
      tagHTML = `<span class="product-tag ${p.tag === 'SALE' ? 'sale' : ''}">${p.tag}</span>`;
    } else if (isSale) {
      tagHTML = '<span class="product-tag sale">SALE</span>';
    }

    const card = document.createElement('div');
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
          <div class="font-mono label-caps text-on-surface-variant mb-1">${isMayor ? 'VENTA POR PAQUETE' : (p.category || 'AL DETAL')}</div>
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

    const price = (p.type === 'detal' && p.salePrice) ? p.salePrice : p.price; 
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    const details = p.type === 'mayor' ? `(Paquete de ${p.packageQuantity || 10} uds)` : `(Talla: ${item.size})`;
    cartTextForWhatsApp += `- ${item.quantity}x ${p.name} ${details} - $${itemTotal.toFixed(2)}%0A`;

    const imgUrl = p.image || 'img/fits%20two.png';

    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between align-items-center border-bottom border-outline-variant py-3 flex-wrap gap-3';
    row.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${imgUrl}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
        <div>
          <h4 class="font-headline text-primary mb-0" style="font-size:16px;">${p.name}</h4>
          <span class="font-mono small text-on-surface-variant">${details} | $${price.toFixed(2)}</span>
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
  document.getElementById('cart-total').textContent = '$' + subtotal.toFixed(2);

  cartTextForWhatsApp += `%0ATotal: $${subtotal.toFixed(2)}%0A%0AGracias!`;

  // Attach WhatsApp URL to checkout button
  const checkoutBtn = document.getElementById('btnCheckoutWhatsApp');
  if (checkoutBtn) {
    const phoneNumber = "1234567890";
    checkoutBtn.href = `https://wa.me/${phoneNumber}?text=${cartTextForWhatsApp}`;
  }
}

// Helper for cart page
window.updateQty = function(productId, size, qty) {
  window.FITS_DB.updateCartQuantity(productId, size, qty);
  renderCart(document.getElementById('cart-items-container'));
};


