// Data Layer: Products Array of Objects
const productsData = [
  {
    id: 1,
    title: 'Country Sourdough Loaf',
    category: 'breads',
    tags: ['sourdough', 'vegan'],
    description: 'Our flagship bread made with 100% stone-ground flour, water, sea salt, and wild yeast starter.',
    price: '$7.50 – $9.00',
    image: 'img/bakery-bread.png',
    alt: 'Basket of freshly baked artisan sourdough loaves and rolls'
  },
  {
    id: 2,
    title: 'Heritage Seeded Rye',
    category: 'breads',
    tags: ['sourdough', 'seeded'],
    description: 'Dense sourdough rye packed with toasted flax, sunflower, and pumpkin seeds.',
    price: '$8.50 – $10.00',
    image: 'img/bakery-signature-loaf.png',
    alt: 'Signature dark crusty rye sourdough loaf'
  },
  {
    id: 3,
    title: 'Traditional French Baguette',
    category: 'breads',
    tags: ['vegan', 'classic'],
    description: 'Crispy crust with an airy interior, baked twice daily for breakfast and lunch service.',
    price: '$4.00 – $4.50',
    image: 'img/bakery-bread.png',
    alt: 'Fresh French Baguettes with crispy golden crust'
  },
  {
    id: 4,
    title: 'Classic Butter Croissant',
    category: 'pastries',
    tags: ['butter'],
    description: 'Laminated with Normandy butter, creating 27 delicate, crispy layers.',
    price: '$3.75 – $4.25',
    image: 'img/bakery-feature-small.png',
    alt: 'Golden flaky butter croissant'
  },
  {
    id: 5,
    title: 'Pain au Chocolat',
    category: 'pastries',
    tags: ['chocolate'],
    description: 'Filled with two batons of 64% Valrhona dark chocolate inside laminated dough.',
    price: '$4.50 – $5.00',
    image: 'img/bakery-feature-small.png',
    alt: 'Pain au chocolat pastry with dark chocolate core'
  },
  {
    id: 6,
    title: 'Cardamom Bun',
    category: 'pastries',
    tags: ['spiced'],
    description: 'Swedish-style twisted bun flavored with freshly ground green cardamom and coarse sugar.',
    price: '$4.00 – $4.50',
    image: 'img/bakery-feature-small.png',
    alt: 'Cardamom and cinnamon knot pastry'
  },
  {
    id: 7,
    title: 'Seasonal Fruit Tart',
    category: 'cakes',
    tags: ['fruit', 'sweet'],
    description: 'Sweet pastry shell lined with vanilla bean pastry cream and fresh seasonal fruit.',
    price: '$28.00 – $45.00',
    image: 'img/bakery-storefront.png',
    alt: 'Layered dark chocolate cake with berry topping'
  },
  {
    id: 8,
    title: 'Dark Chocolate Olive Oil Cake',
    category: 'cakes',
    tags: ['chocolate', 'gluten-friendly'],
    description: 'Moist flourless chocolate cake enriched with extra virgin olive oil and sea salt.',
    price: '$35.00 – $50.00',
    image: 'img/bakery-storefront.png',
    alt: 'Rich chocolate ganache layer cake'
  }
];

// Initialize Product Filter Feature
function initProductFilter() {
  const filterContainer = document.getElementById('product-filter-controls');
  const searchInput = document.getElementById('product-search');
  const gridContainer = document.getElementById('products-grid');

  if (!gridContainer) {console.log("Nope"); } // Exit if not on products.html

  const savedFilter = localStorage.getItem('northstar_active_filter') || 'all';

  const initialBtn = document.querySelector(`[data-filter="${savedFilter}"]`);
  if (initialBtn) {
    setActiveFilterButton(initialBtn);
  }

  // Initial render with saved state
  filterAndRenderProducts(savedFilter, searchInput ? searchInput.value : '');

  // Event Listener: Filter Buttons
  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;

      const category = btn.getAttribute('data-filter');
      setActiveFilterButton(btn);

      // Step 4: Save choice to localStorage
      localStorage.setItem('northstar_active_filter', category);

      const query = searchInput ? searchInput.value : '';
      filterAndRenderProducts(category, query);
    });
  }

  // Event Listener: Search Bar Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeBtn = document.querySelector('#product-filter-controls button[aria-pressed="true"]');
      const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      filterAndRenderProducts(category, e.target.value);
    });
  }
}

// Set active button styling & accessibility attribute
function setActiveFilterButton(activeBtn) {
  const buttons = document.querySelectorAll('#product-filter-controls button');
  buttons.forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('active-filter');
  });
  activeBtn.setAttribute('aria-pressed', 'true');
  activeBtn.classList.add('active-filter');
}

// Modular Function: Filter data array
function filterProducts(category, searchQuery) {
  const query = searchQuery.trim().toLowerCase();

  return productsData.filter(product => {
    const matchesCategory = (category === 'all') ||
      (product.category === category) ||
      (product.tags.includes(category));

    const matchesSearch = (query === '') ||
      (product.title.toLowerCase().includes(query)) ||
      (product.description.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });
}

// Modular Function: Render products into DOM
function renderProducts(filteredProducts) {
  const gridContainer = document.getElementById('products-grid');
  const liveCount = document.getElementById('results-count');

  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  if (filteredProducts.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p><strong>No products found matching your filter criteria.</strong></p>
        <p>Try resetting the search or selecting another category.</p>
      </div>
    `;
    if (liveCount) liveCount.textContent = 'No matching products found.';
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.alt}">
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <span class="price-range">Pricing: ${product.price}</span>
    `;
    gridContainer.appendChild(card);
  });

  // Accessible screen-reader announcement
  if (liveCount) {
    liveCount.textContent = `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'}.`;
  }
}

// Helper to bridge filtering and rendering
function filterAndRenderProducts(category, searchQuery) {
  const matches = filterProducts(category, searchQuery);
  renderProducts(matches);
}

function initContactFormValidation() {
  const form = document.getElementById('preorder-form');
  if (!form) return; // Exit if not on contact.html

  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const dateInput = document.getElementById('pickup-date');
  const typeSelect = document.getElementById('request-type');
  const detailsInput = document.getElementById('item-details');

  // Step 4: Load saved contact details from localStorage
  loadSavedFormData(nameInput, emailInput);

  // Restrict pickup date selector to 24 hours in advance minimum
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Save Name & Email to localStorage as user types
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      localStorage.setItem('northstar_user_name', nameInput.value);
      clearFieldError(nameInput);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      localStorage.setItem('northstar_user_email', emailInput.value);
      clearFieldError(emailInput);
    });
  }

  // Clear inline errors dynamically when fields change
  [dateInput, typeSelect, detailsInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => clearFieldError(field));
      field.addEventListener('change', () => clearFieldError(field));
    }
  });

  // Step 3: Handle Form Submit Event
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    clearAllErrors(form);

    let isValid = true;
    let firstInvalidField = null;

    // 1. Required Check: Name
    if (!validateRequired(nameInput)) {
      showFieldError(nameInput, 'Please enter your full name.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = nameInput;
    }

    // 2. Required & Format Check: Email
    if (!validateRequired(emailInput)) {
      showFieldError(emailInput, 'Please enter your email address.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else if (!validateEmailFormat(emailInput.value)) {
      showFieldError(emailInput, 'Please enter a valid email address (e.g., alex@example.com).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = emailInput;
    }

    // 3. Date Check: Minimum 24 Hours Notice
    if (!validateRequired(dateInput)) {
      showFieldError(dateInput, 'Please select a pickup date.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = dateInput;
    } else if (!validateFutureDate(dateInput.value)) {
      showFieldError(dateInput, 'Pickup date must be at least 24 hours in advance.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = dateInput;
    }

    // 4. Required Select Check: Request Type
    if (!validateRequired(typeSelect)) {
      showFieldError(typeSelect, 'Please select a request type.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = typeSelect;
    }

    // 5. Min Length Check: Item Details
    if (!validateRequired(detailsInput)) {
      showFieldError(detailsInput, 'Please provide item details for your order.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = detailsInput;
    } else if (!validateMinLength(detailsInput.value, 10)) {
      showFieldError(detailsInput, 'Item details must be at least 10 characters long.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = detailsInput;
    }

    // Complete Submission or Set Focus to First Error
    if (isValid) {
      showFormSuccess(form);
    } else if (firstInvalidField) {
      firstInvalidField.focus();
    }
  });
}

/* Helper Functions */

function validateRequired(input) {
  return input && input.value.trim() !== '';
}

function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function validateMinLength(value, minLength) {
  return value.trim().length >= minLength;
}

function validateFutureDate(dateString) {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today;
}

function showFieldError(inputElement, errorMessage) {
  inputElement.setAttribute('aria-invalid', 'true');
  inputElement.classList.add('input-error');

  let errorElement = document.getElementById(`${inputElement.id}-error`);
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.id = `${inputElement.id}-error`;
    errorElement.className = 'field-error-message';
    errorElement.setAttribute('role', 'alert');
    inputElement.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = errorMessage;
  inputElement.setAttribute('aria-describedby', errorElement.id);
}

function clearFieldError(inputElement) {
  inputElement.removeAttribute('aria-invalid');
  inputElement.classList.remove('input-error');

  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    errorElement.remove();
  }
}

function clearAllErrors(form) {
  const errorMessages = form.querySelectorAll('.field-error-message');
  errorMessages.forEach(msg => msg.remove());

  const invalidInputs = form.querySelectorAll('[aria-invalid]');
  invalidInputs.forEach(input => {
    input.removeAttribute('aria-invalid');
    input.classList.remove('input-error');
  });

  const successMsg = form.querySelector('.form-success-banner');
  if (successMsg) successMsg.remove();
}

function loadSavedFormData(nameInput, emailInput) {
  const savedName = localStorage.getItem('northstar_user_name');
  const savedEmail = localStorage.getItem('northstar_user_email');

  if (savedName && nameInput) nameInput.value = savedName;
  if (savedEmail && emailInput) emailInput.value = savedEmail;
}

function showFormSuccess(form) {
  const successBanner = document.createElement('div');
  successBanner.className = 'form-success-banner';
  successBanner.setAttribute('role', 'status');
  successBanner.style.cssText = `
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    font-weight: bold;
  `;
  successBanner.textContent = 'Thank you! Your pre-order request has been validated and submitted successfully. We will confirm via email within 24 hours.';

  form.prepend(successBanner);
  form.reset();
}

// Bootstrapping the code, otherwise none of the above functions will run.
renderProducts(productsData);
initProductFilter();
initContactFormValidation();
