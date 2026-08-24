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

  const prodTypeSelect = document.getElementById('prodType');
  const detalFields = document.getElementById('detalFields');
  const mayorFields = document.getElementById('mayorFields');
  const prodIsOfferChk = document.getElementById('prodIsOffer');
  const salePriceContainer = document.getElementById('salePriceContainer');

  function toggleTypeFields() {
    const type = prodTypeSelect.value;
    if (type === 'mayor') {
      detalFields.style.display = 'none';
      mayorFields.style.display = 'block';
      salePriceContainer.style.display = 'none';
    } else {
      detalFields.style.display = 'block';
      mayorFields.style.display = 'none';
      salePriceContainer.style.display = prodIsOfferChk.checked ? 'block' : 'none';
    }
  }

  prodTypeSelect.addEventListener('change', toggleTypeFields);
  prodIsOfferChk.addEventListener('change', () => {
    if (prodTypeSelect.value === 'detal') {
      salePriceContainer.style.display = prodIsOfferChk.checked ? 'block' : 'none';
    }
  });

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
      const isMayor = p.type === 'mayor';
      const typeBadge = isMayor 
        ? '<span class="badge bg-info text-dark">Al Mayor</span>' 
        : '<span class="badge bg-primary">Al Detal</span>';
      
      const catOrDesc = isMayor ? 'Venta por volumen' : (p.category || 'General');
      const offerOrPkg = isMayor 
        ? `<span class="badge bg-secondary">${p.packageQuantity || 1} uds/paquete</span>`
        : (p.salePrice ? `<span class="text-error font-mono">$${p.salePrice.toFixed(2)}</span>` : '-');

      tr.innerHTML = `
        <td><img src="${p.image || 'img/fits%20two.png'}" alt="${p.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
        <td class="font-headline text-primary">${p.name}</td>
        <td>${typeBadge}</td>
        <td class="font-mono small">${catOrDesc}</td>
        <td class="font-mono">$${p.price.toFixed(2)}</td>
        <td>${offerOrPkg}</td>
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
    document.getElementById('prodType').value = p.type || 'detal';
    
    if (p.category) document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodNewCategory').value = '';
    
    document.getElementById('prodIsOffer').checked = p.isOffer === true || !!p.salePrice;
    document.getElementById('prodPackageQuantity').value = p.packageQuantity || '';

    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodSalePrice').value = p.salePrice || '';
    document.getElementById('prodImage').value = p.image || '';
    document.getElementById('prodImageFile').value = ''; 
    document.getElementById('prodTag').value = p.tag || '';
    document.getElementById('showRecommended').checked = p.showInRecommended === true;

    toggleTypeFields();
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
        alert("La imagen es demasiado grande. Por favor, sube una imagen menor a 2MB.");
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
    const name = document.getElementById('prodName').value.trim();
    const price = parseFloat(document.getElementById('prodPrice').value);
    const type = prodTypeSelect.value;

    if (!name || isNaN(price)) {
      alert("Nombre y Precio válido son requeridos.");
      return;
    }

    const id = document.getElementById('prodId').value;
    
    let category = 'GENERAL';
    let isOffer = false;
    let salePrice = null;
    let packageQuantity = null;

    if (type === 'detal') {
      category = catSelect.value;
      const newCat = catNew.value.trim().toUpperCase();
      if (newCat) {
        category = newCat;
        window.FITS_DB.addCategory(category);
        loadCategories();
      }
      isOffer = prodIsOfferChk.checked;
      if (isOffer) {
        const sp = parseFloat(document.getElementById('prodSalePrice').value);
        salePrice = !isNaN(sp) ? sp : null;
      }
    } else if (type === 'mayor') {
      category = 'AL MAYOR';
      const pkgQty = parseInt(document.getElementById('prodPackageQuantity').value, 10);
      packageQuantity = !isNaN(pkgQty) && pkgQty > 0 ? pkgQty : 10;
    }

    const prodData = {
      name: name,
      type: type,
      category: category,
      price: price,
      salePrice: salePrice,
      isOffer: isOffer,
      packageQuantity: packageQuantity,
      image: document.getElementById('prodImage').value,
      tag: document.getElementById('prodTag').value || null,
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
    prodTypeSelect.value = 'detal';
    prodIsOfferChk.checked = false;
    toggleTypeFields();
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

