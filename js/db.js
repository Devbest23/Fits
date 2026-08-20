/* js/db.js - LocalStorage Database Manager */

const DB_KEY = 'fits_products';
const CART_KEY = 'fits_cart';
const CAT_KEY = 'fits_categories';

// Initial dummy data to populate the store if empty
const initialProducts = [];

const initialCategories = [
  'ROPA DE ENTRENAMIENTO',
  'ZAPATILLAS DE RUNNING',
  'ESTILO DE VIDA',
  'ACCESORIOS'
];

function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(CAT_KEY)) {
    localStorage.setItem(CAT_KEY, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(CART_KEY)) {
    localStorage.setItem(CART_KEY, JSON.stringify([]));
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
  
  // Pequeña notificación visual
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
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  updateCartIcon
};
