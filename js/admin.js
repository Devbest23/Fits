/* js/admin.js - CMS Logic */

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('adminProductsTable');
  const catSelect = document.getElementById('prodCategory');
  const catNew = document.getElementById('prodNewCategory');
  const modalEl = document.getElementById('productModal');
  const modal = new bootstrap.Modal(modalEl);
  const form = document.getElementById('productForm');
  const btnSave = document.getElementById('btnSaveProduct');
  const btnClearDB = document.getElementById('btnClearDB');
  const fileInput = document.getElementById('prodImageFile');

  // Populate categories
  function loadCategories() {
    catSelect.innerHTML = '';
    const categories = window.FITS_DB.getCategories();
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });
  }
  loadCategories();

  function renderTable() {
    const products = window.FITS_DB.getProducts();
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-on-surface-variant py-4">No hay productos. Añade uno nuevo.</td></tr>';
      return;
    }

    products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.image || 'img/fits%20two.png'}" alt="${p.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
        <td class="font-headline text-primary">${p.name}</td>
        <td class="font-mono small">${p.category}</td>
        <td class="font-mono">$${p.price.toFixed(2)}</td>
        <td class="font-mono text-error">${p.salePrice ? '$' + p.salePrice.toFixed(2) : '-'}</td>
        <td>${p.tag ? `<span class="badge bg-primary text-background">${p.tag}</span>` : '-'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-2 btn-edit" data-id="${p.id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${p.id}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Attach events
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => editProduct(e.target.dataset.id));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => deleteProductFlow(e.target.dataset.id));
    });
  }

  function editProduct(id) {
    const p = window.FITS_DB.getProductById(id);
    if (!p) return;
    
    document.getElementById('productModalLabel').textContent = 'Editar Producto';
    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodNewCategory').value = '';
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodSalePrice').value = p.salePrice || '';
    document.getElementById('prodImage').value = p.image || '';
    document.getElementById('prodImageFile').value = ''; // clear file input
    document.getElementById('prodTag').value = p.tag || '';
    
    document.getElementById('showProducts').checked = p.showInProducts !== false;
    document.getElementById('showOffers').checked = p.showInOffers === true;
    document.getElementById('showWholesale').checked = p.showInWholesale === true;
    document.getElementById('showRecommended').checked = p.showInRecommended === true;

    modal.show();
  }

  function deleteProductFlow(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      window.FITS_DB.deleteProduct(id);
      renderTable();
    }
  }

  // Handle image conversion to base64
  let base64Image = null;
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Por favor, sube una imagen menor a 2MB para no saturar el LocalStorage.");
        fileInput.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        base64Image = evt.target.result;
        document.getElementById('prodImage').value = base64Image;
      };
      reader.readAsDataURL(file);
    } else {
      base64Image = null;
    }
  });

  btnSave.addEventListener('click', () => {
    // Basic validation
    if (!document.getElementById('prodName').value || !document.getElementById('prodPrice').value) {
      alert("Nombre y Precio son requeridos.");
      return;
    }

    const id = document.getElementById('prodId').value;
    
    let category = catSelect.value;
    const newCat = catNew.value.trim().toUpperCase();
    if (newCat) {
      category = newCat;
      window.FITS_DB.addCategory(category);
      loadCategories(); // refresh list
    }

    const prodData = {
      name: document.getElementById('prodName').value,
      category: category,
      price: parseFloat(document.getElementById('prodPrice').value),
      salePrice: document.getElementById('prodSalePrice').value ? parseFloat(document.getElementById('prodSalePrice').value) : null,
      image: document.getElementById('prodImage').value, // Could be base64 or previous URL
      tag: document.getElementById('prodTag').value || null,
      showInProducts: document.getElementById('showProducts').checked,
      showInOffers: document.getElementById('showOffers').checked,
      showInWholesale: document.getElementById('showWholesale').checked,
      showInRecommended: document.getElementById('showRecommended').checked
    };

    if (id) {
      window.FITS_DB.updateProduct(id, prodData);
    } else {
      window.FITS_DB.addProduct(prodData);
    }

    modal.hide();
    renderTable();
  });

  // Reset form when opening modal for new product
  document.getElementById('btnNewProduct').addEventListener('click', () => {
    document.getElementById('productModalLabel').textContent = 'Añadir Producto';
    form.reset();
    document.getElementById('prodId').value = '';
    document.getElementById('prodImage').value = '';
    base64Image = null;
    document.getElementById('showProducts').checked = true;
    document.getElementById('showOffers').checked = false;
    document.getElementById('showWholesale').checked = false;
    document.getElementById('showRecommended').checked = false;
  });

  if (btnClearDB) {
    btnClearDB.addEventListener('click', () => {
      if (confirm('¿ATENCIÓN: Estás a punto de borrar todos los productos y datos guardados. ¿Deseas continuar?')) {
        localStorage.removeItem('fits_products');
        localStorage.removeItem('fits_categories');
        localStorage.removeItem('fits_cart');
        location.reload();
      }
    });
  }

  renderTable();
});
