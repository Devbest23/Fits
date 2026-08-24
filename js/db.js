/* js/db.js - LocalStorage Database Manager */

const DB_KEY = 'fits_products';
const CART_KEY = 'fits_cart';
const CAT_KEY = 'fits_categories';
const COMMENTS_KEY = 'fits_comments';

// Initial default products with new schema
const initialProducts = [
  {
    id: 'p1',
    name: 'CAMISETA COMPRESSION PRO',
    type: 'detal',
    category: 'ROPA DE ENTRENAMIENTO',
    isOffer: true,
    price: 45.00,
    salePrice: 34.99,
    image: 'img/fits%20two.png',
    tag: 'SALE',
    packageQuantity: null
  },
  {
    id: 'p2',
    name: 'ZAPATILLAS RUNNING NITRO 5.0',
    type: 'detal',
    category: 'ZAPATILLAS DE RUNNING',
    isOffer: false,
    price: 120.00,
    salePrice: null,
    image: 'img/fits%20two.png',
    tag: 'NEW',
    packageQuantity: null
  },
  {
    id: 'p3',
    name: 'CHAMARRA DEPORTE THERMO',
    type: 'detal',
    category: 'ESTILO DE VIDA',
    isOffer: true,
    price: 85.00,
    salePrice: 65.00,
    image: 'img/fits%20two.png',
    tag: 'SALE',
    packageQuantity: null
  },
  {
    id: 'p4',
    name: 'PACK DE BANDAS DE RESISTENCIA',
    type: 'detal',
    category: 'ACCESORIOS',
    isOffer: false,
    price: 25.00,
    salePrice: null,
    image: 'img/fits%20two.png',
    tag: null,
    packageQuantity: null
  },
  {
    id: 'p5',
    name: 'LOTE CAMISETAS COMPRESSION (12 UNIDADES)',
    type: 'mayor',
    category: 'AL MAYOR',
    isOffer: false,
    price: 320.00,
    salePrice: null,
    image: 'img/fits%20two.png',
    tag: 'MAYOR',
    packageQuantity: 12
  },
  {
    id: 'p6',
    name: 'PACK ACCESORIOS GIMNASIO (24 UNIDADES)',
    type: 'mayor',
    category: 'AL MAYOR',
    isOffer: false,
    price: 280.00,
    salePrice: null,
    image: 'img/fits%20two.png',
    tag: 'MAYOR',
    packageQuantity: 24
  }
];

const initialCategories = [
  'ROPA DE ENTRENAMIENTO',
  'ZAPATILLAS DE RUNNING',
  'ESTILO DE VIDA',
  'ACCESORIOS'
];

const initialComments = [
  {
    id: 'c1',
    author: 'Carlos Mendoza',
    rating: 5,
    date: '2026-08-20',
    comment: 'La calidad de las camisetas de compresión es increíble. Ajuste perfecto para entrenamientos de alta intensidad.'
  },
  {
    id: 'c2',
    author: 'Valeria Gómez',
    rating: 5,
    date: '2026-08-18',
    comment: 'Compré un paquete al mayor para nuestro centro deportivo y la atención por WhatsApp fue rápida y formal. Totalmente recomendado.'
  },
  {
    id: 'c3',
    author: 'Andrés Silva',
    rating: 4,
    date: '2026-08-15',
    comment: 'Las zapatillas Nitro son súper livianas y con excelente amortiguación. El producto llegó tal cual lo descrito.'
  }
];

function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialProducts));
  } else {
    // Migration: ensure products have 'type', 'isOffer', 'packageQuantity'
    let products = JSON.parse(localStorage.getItem(DB_KEY));
    if (Array.isArray(products)) {
      let modified = false;
      products = products.map(p => {
        if (!p.type) {
          modified = true;
          return {
            ...p,
            type: p.showInWholesale ? 'mayor' : 'detal',
            isOffer: p.showInOffers === true || (p.salePrice !== null && p.salePrice !== undefined),
            packageQuantity: p.packageQuantity || (p.showInWholesale ? 10 : null)
          };
        }
        return p;
      });
      if (modified) {
        localStorage.setItem(DB_KEY, JSON.stringify(products));
      }
    }
  }
  if (!localStorage.getItem(CAT_KEY)) {
    localStorage.setItem(CAT_KEY, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(CART_KEY)) {
    localStorage.setItem(CART_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(initialComments));
  }
}

// --- PRODUCTS ---
function getProducts() {
  return JSON.parse(localStorage.getItem(DB_KEY)) || [];
}

function getProductById(id) {
  return getProducts().find(p => p.id === id);
}

function saveProducts(products) {
  localStorage.setItem(DB_KEY, JSON.stringify(products));
}

function addProduct(product) {
  const products = getProducts();
  product.id = 'p' + Date.now();
  products.push(product);
  saveProducts(products);
}

function updateProduct(id, updatedData) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    saveProducts(products);
  }
}

function deleteProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
}

// --- CATEGORIES ---
function getCategories() {
  return JSON.parse(localStorage.getItem(CAT_KEY)) || [];
}

function addCategory(cat) {
  const cats = getCategories();
  if (!cats.includes(cat)) {
    cats.push(cat);
    localStorage.setItem(CAT_KEY, JSON.stringify(cats));
  }
}

// --- COMMENTS ---
function getComments() {
  return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || [];
}

function addComment(author, rating, comment, image = null) {
  const comments = getComments();
  const newComment = {
    id: 'c' + Date.now(),
    author: author.trim() || 'Cliente',
    rating: parseInt(rating, 10) || 5,
    date: new Date().toISOString().split('T')[0],
    comment: comment.trim(),
    image: image || null
  };
  comments.unshift(newComment); // new comments at top
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  return newComment;
}

// --- CART ---
function getCart() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const products = getProducts();
  const validCart = cart.filter(item => products.some(p => p.id === item.productId));
  if (validCart.length !== cart.length) {
    localStorage.setItem(CART_KEY, JSON.stringify(validCart));
  }
  return validCart;
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartIcon();
}

function addToCart(productId, quantity = 1, size = 'M') {
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId && item.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity, size });
  }
  saveCart(cart);
  alert("Producto añadido al carrito");
}

function removeFromCart(productId, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.productId === productId && item.size === size));
  saveCart(cart);
}

function updateCartQuantity(productId, size, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.productId === productId && item.size === size);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    saveCart(cart);
  }
}

function updateCartIcon() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcons = document.querySelectorAll('a[href="carrito.html"]');
  
  cartIcons.forEach(cartIcon => {
    let badge = cartIcon.querySelector('.cart-badge');
    if (totalItems > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-badge badge rounded-pill bg-primary position-absolute top-0 start-100 translate-middle';
        badge.style.fontSize = '0.6rem';
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
      }
      badge.textContent = totalItems;
    } else {
      if (badge) {
        badge.remove();
      }
    }
  });
}

// Initialize on load
initDB();

// Export to global scope
window.FITS_DB = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  getComments,
  addComment,
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  updateCartIcon
};


