// Global state
let bootcampsData = [];
const bootcampCache = new Map();

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('bootcamp-grid');
  const reviewsGrid = document.getElementById('reviews-grid');

  // Fetch Bootcamps (now includes courses and reviews)
  fetchBootcamps();

  // Modal Close Logic
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });

  // Check if user is logged in and update navbar
  checkUserState();
});

// Fetch Bootcamps with Pagination
window.fetchBootcamps = function (page = 1) {
  const grid = document.getElementById('bootcamp-grid');
  const reviewsGrid = document.getElementById('reviews-grid');
  const paginationContainer = document.getElementById('pagination-container');

  const cacheKey = `page_${page}`;

  // Check cache first
  if (bootcampCache.has(cacheKey)) {
    const cached = bootcampCache.get(cacheKey);
    renderBootcamps(cached.data, cached.pagination, grid, reviewsGrid, paginationContainer);
    return;
  }

  // Show skeleton loading state
  grid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-header"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line medium"></div>
    `;
    grid.appendChild(skeleton);
  }

  fetch(`/api/v1/bootcamps?page=${page}&limit=6`) // Limit to 6 per page
    .then(res => res.json())
    .then(data => {
      bootcampsData = data.data;
      const pagination = data.pagination;

      // Cache the data
      bootcampCache.set(cacheKey, { data: bootcampsData, pagination });

      // Render
      renderBootcamps(bootcampsData, pagination, grid, reviewsGrid, paginationContainer);
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i> 
          Failed to load bootcamps. Is the server running?
        </div>
      `;
    });
}

// Helper function to render bootcamps
function renderBootcamps(bootcampsData, pagination, grid, reviewsGrid, paginationContainer) {
  grid.innerHTML = '';

  // Handle empty data
  if (bootcampsData.length === 0) {
    grid.innerHTML = '<p class="description">No bootcamps found. Be the first to add one!</p>';
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  // Render Cards
  bootcampsData.forEach(bootcamp => {
    const card = createBootcampCard(bootcamp);
    grid.appendChild(card);
  });

  // Render Reviews Section
  renderReviews(bootcampsData, reviewsGrid);

  // Render Pagination
  renderPagination(pagination, paginationContainer);
}

function renderPagination(pagination, container) {
  if (!container) return;

  container.innerHTML = '';

  if (pagination.prev) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Prev';
    const debouncedPrev = debounce(() => window.fetchBootcamps(pagination.prev.page), 300);
    prevBtn.addEventListener('click', debouncedPrev);
    container.appendChild(prevBtn);
  }

  if (pagination.next) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn pagination-btn';
    nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    const debouncedNext = debounce(() => window.fetchBootcamps(pagination.next.page), 300);
    nextBtn.addEventListener('click', debouncedNext);
    container.appendChild(nextBtn);
  }
}

async function checkUserState() {
  try {
    const res = await fetch('/api/v1/auth/me');
    const data = await res.json();

    if (data.success && data.data) {
      // User is logged in
      updateNavbarForLoggedInUser(data.data);
    }
  } catch (err) {
    // User not logged in, keep default nav
    console.log('User not logged in');
  }
}

function updateNavbarForLoggedInUser(user) {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  navLinks.innerHTML = `
    <span class="user-display">
      <i class="fas fa-user-circle"></i> ${user.name}
    </span>
    <button class="nav-btn-text" id="logout-btn">
      <i class="fas fa-sign-out-alt"></i> Logout
    </button>
    <a href="https://documenter.getpostman.com/view/40486758/2sB3QJNW9T" target="_blank" class="nav-btn">
      <i class="fas fa-book"></i> API Docs
    </a>
  `;

  // Add logout handler
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

async function handleLogout() {
  try {
    await fetch('/api/v1/auth/logout');
    window.location.reload();
  } catch (err) {
    console.error('Logout failed:', err);
  }
}

function createBootcampCard(bootcamp) {
  const card = document.createElement('div');
  card.className = 'bootcamp-card';

  // Map bootcamp IDs to specific images - each bootcamp gets its own unique image
  const imageMap = {
    '5d713995b721c3bb38c1f5d0': '/uploads/image1.jpg', // Devworks
    '5d713a66ec8f2b88b8f830b8': '/uploads/image2.jpg', // ModernTech
    '5d725a037b292f5f8ceff787': '/uploads/image3.jpg', // Codemasters
    '5d725a1b7b292f5f8ceff788': '/uploads/image4.jpg', // Devcentral
    '5d725a037b292f5f8ceff789': '/uploads/aaron-burden-LNwn_A9RGHo-unsplash.jpg', // Quantum
    '5d725a037b292f5f8ceff790': '/uploads/aaron-burden-QJDzYT_K8Xg-unsplash.jpg', // Pixel
    '5d725a037b292f5f8ceff791': '/uploads/iewek-gnos-hhUx08PuYpc-unsplash.jpg', // Cloud
    '5d725a037b292f5f8ceff792': '/uploads/jeshoots-com-pUAM5hPaCRI-unsplash.jpg', // Mobile
    '5d725a037b292f5f8ceff793': '/uploads/marvin-meyer-SYTO3xs06fU-unsplash.jpg', // Cyber
    '5d725a037b292f5f8ceff794': '/uploads/thought-catalog-505eectW54k-unsplash.jpg' // Agile
  };

  const bgImage = bootcamp.photo && bootcamp.photo !== 'no-photo.jpg'
    ? `/uploads/${bootcamp.photo}`
    : (imageMap[bootcamp._id] || '/uploads/image1.jpg');

  const courseCount = bootcamp.courses ? bootcamp.courses.length : 0;

  card.innerHTML = `
    <img 
      src="${bgImage}" 
      class="card-img" 
      alt="${bootcamp.name}" 
      loading="lazy"
      onerror="this.src='https://via.placeholder.com/700x400/1a1a1a/4ade80?text=Bootcamp'"
    >
    <div class="card-content">
      <h3 class="card-title">${bootcamp.name}</h3>
      <div class="card-location">
        <i class="fas fa-map-marker-alt"></i> ${bootcamp.location.city}, ${bootcamp.location.country || 'USA'}
      </div>
      <p class="card-desc">${bootcamp.description.substring(0, 90)}...</p>
      
      <div class="card-course-count">
        <i class="fas fa-book-open"></i> ${courseCount} Courses Available
      </div>

      <div class="card-contact">
        ${bootcamp.email ? `<div class="card-contact-item"><i class="fas fa-envelope"></i> ${bootcamp.email}</div>` : ''}
        ${bootcamp.phone ? `<div class="card-contact-item"><i class="fas fa-phone"></i> ${bootcamp.phone}</div>` : ''}
        ${bootcamp.website ? `<div class="card-contact-item"><i class="fas fa-globe"></i> <a href="${bootcamp.website}" target="_blank">Website</a></div>` : ''}
      </div>

      <div class="card-footer">
        <span class="rating-badge">
          <i class="fas fa-star"></i> ${bootcamp.averageRating ? bootcamp.averageRating.toFixed(1) : 'N/A'}
        </span>
        <span class="price-tag">
           ${bootcamp.averageCost ? '$' + bootcamp.averageCost : 'Free'}
        </span>
      </div>
      <button class="nav-btn-primary view-details-btn btn-details" data-bootcamp-id="${bootcamp._id}">
        View Details
      </button>
    </div>
  `;

  // Add click event listener to the button
  const detailsBtn = card.querySelector('.view-details-btn');
  detailsBtn.addEventListener('click', () => openDetails(bootcamp._id));

  return card;
}

function renderReviews(bootcamps, container) {
  // Aggregate all reviews
  let allReviews = [];
  bootcamps.forEach(b => {
    if (b.reviews) {
      b.reviews.forEach(r => {
        // Add bootcamp name to review for context
        r.bootcampName = b.name;
        allReviews.push(r);
      });
    }
  });

  // Shuffle reviews randomly
  allReviews.sort(() => Math.random() - 0.5);

  // Take only 6 reviews
  const selectedReviews = allReviews.slice(0, 6);

  if (selectedReviews.length === 0) {
    container.innerHTML = '<p class="no-reviews-msg">No reviews yet.</p>';
    return;
  }

  container.innerHTML = '';
  selectedReviews.forEach(review => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-header">
        <span class="review-rating"><i class="fas fa-star"></i> ${review.rating}/10</span>
        <span class="review-bootcamp">${review.bootcampName}</span>
      </div>
      <h4 class="review-title">${review.title}</h4>
      <p class="review-text">"${review.text.substring(0, 150)}..."</p>
    `;
    container.appendChild(card);
  });
}

// Global scope for onclick
window.openDetails = (id) => {
  console.log('Opening details for:', id); // Debug
  const bootcamp = bootcampsData.find(b => b._id === id);

  if (!bootcamp) {
    console.error('Bootcamp not found in local data for id:', id);
    return;
  }

  const modalBody = document.getElementById('modal-body-content');
  const modal = document.getElementById('bootcamp-modal');

  if (!modal || !modalBody) {
    console.error('Modal elements not found!');
    return;
  }

  // Courses HTML
  let coursesHtml = '<p>No courses found.</p>';
  if (bootcamp.courses && bootcamp.courses.length > 0) {
    coursesHtml = bootcamp.courses.map(c => `
      <div class="course-item">
        <div class="course-header">
          <span class="course-title">${c.title}</span>
          <span class="course-cost">${c.tuition ? '$' + c.tuition : 'Free'}</span>
        </div>
        <div class="course-details">
          <i class="fas fa-clock"></i> ${c.weeks} Weeks &bull; 
          <i class="fas fa-layer-group"></i> ${c.minimumSkill || 'All Levels'} &bull;
          <i class="fas fa-graduation-cap"></i> ${c.scholarhipsAvailable ? 'Scholarships' : 'No Scholarships'}
        </div>
      </div>
    `).join('');
  }

  // Careers/Skills
  const skillsHtml = bootcamp.careers ? bootcamp.careers.map(c =>
    `<span class="modal-badge">${c}</span>`
  ).join('') : '';

  modalBody.innerHTML = `
    <div class="modal-hero">
      <h2 class="modal-title">${bootcamp.name}</h2>
      <div class="modal-stats">
        <span class="rating-badge" style="margin-right: 1rem;">
          <i class="fas fa-star"></i> ${bootcamp.averageRating ? bootcamp.averageRating.toFixed(1) : 'N/A'}
        </span>
        <span class="modal-cost">
          ${bootcamp.averageCost ? 'Avg Cost: $' + bootcamp.averageCost : 'Free'}
        </span>
      </div>
      <p class="modal-desc">${bootcamp.description}</p>
      <div class="modal-skills">
        ${skillsHtml}
      </div>
    </div>

    <h3>Available Courses (${bootcamp.courses ? bootcamp.courses.length : 0})</h3>
    <div class="course-list">
      ${coursesHtml}
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
};

function closeModal() {
  const modal = document.getElementById('bootcamp-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}
