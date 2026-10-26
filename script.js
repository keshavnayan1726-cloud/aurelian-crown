/* ===================================================================
   AURELIAN CROWN HAIR PATCH STUDIO - EDITORIAL INTERACTIONS
   Founders: Ajay Thakur & Bittu Thakur | Sector 3A, Laxman Vihar, Gurugram
   Direct Contact: 9958467830 / 7827867830
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initComparisonSlider();
  initMenuToggle();
  initCallDropdown();
  initConsultationForm();
});

/* ===================================================================
   1. AMBIENT LUXURY THREE.JS CANVAS (Subtle Champagne Light Shimmer)
   =================================================================== */
function initAmbientCanvas() {
  const container = document.getElementById('ambient-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Soft Champagne Dust Particles
  const particleCount = 140;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 36;
    positions[i + 1] = (Math.random() - 0.5) * 24;
    positions[i + 2] = (Math.random() - 0.5) * 20;

    // Warm champagne bronze tones
    colors[i] = 0.61;     // R
    colors[i + 1] = 0.47; // G
    colors[i + 2] = 0.22; // B
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.65
  });

  const particleMesh = new THREE.Points(geometry, material);
  scene.add(particleMesh);

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particleMesh.rotation.y = elapsedTime * 0.02 + mouseX * 0.05;
    particleMesh.rotation.x = elapsedTime * 0.01 + mouseY * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ===================================================================
   2. INTERACTIVE BEFORE/AFTER DRAG SLIDER
   =================================================================== */
function initComparisonSlider() {
  const container = document.getElementById('sliderViewport');
  const overlayClip = document.getElementById('overlayClip');
  const divider = document.getElementById('sliderDivider');
  const imgOverlay = document.getElementById('imgOverlay');

  if (!container || !overlayClip || !divider) return;

  function setDimensions() {
    if (imgOverlay && container) {
      imgOverlay.style.width = `${container.clientWidth}px`;
      imgOverlay.style.height = `${container.clientHeight}px`;
      imgOverlay.style.objectFit = 'cover';
    }
  }
  setDimensions();
  window.addEventListener('resize', setDimensions);

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    overlayClip.style.width = `${percentage}%`;
    divider.style.left = `${percentage}%`;
  }

  // Mouse Interaction
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Interaction (Mobile)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ===================================================================
   3. MOBILE NAVIGATION TOGGLE
   =================================================================== */
function initMenuToggle() {
  const toggleBtn = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Close when nav link clicked
  const links = navMenu.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/* ===================================================================
   4. DIRECT CALL DROPDOWN
   =================================================================== */
function initCallDropdown() {
  const btn = document.getElementById('callDropdownBtn');
  const dropdownWrap = document.querySelector('.direct-call-dropdown');
  if (!btn || !dropdownWrap) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownWrap.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    dropdownWrap.classList.remove('open');
  });
}

/* ===================================================================
   5. CONSULTATION FORM -> WHATSAPP REDIRECT
   =================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const phone = document.getElementById('cPhone').value.trim();
    const packageChoice = document.getElementById('cBudget').value;
    const date = document.getElementById('cDate').value || 'Earliest available slot';
    const notes = document.getElementById('cNotes').value.trim() || 'None';

    const message = `*Aurelian Crown Studio Appointment Request*%0A%0A` +
      `*Client Name:* ${name}%0A` +
      `*Contact Phone:* ${phone}%0A` +
      `*Selected Package:* ${packageChoice}%0A` +
      `*Preferred Date:* ${date}%0A` +
      `*Special Notes:* ${notes}%0A%0A` +
      `_Looking forward to consulting with Ajay Thakur & Bittu Thakur at Sector 3A Laxman Vihar Gurugram._`;

    window.open(`https://wa.me/919958467830?text=${message}`, '_blank');
  });
}
