/* ===================================================================
   AURELIAN CROWN HAIR PATCH STUDIO - HIGH PERFORMANCE INTERACTIONS
   Founders: Ajay Thakur & Bittu Thakur | Sector 3A, Laxman Vihar, Gurugram
   Direct Contact: +91 99584 67830 / +91 78278 67830
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
  initCallDropdown();
  initComparisonSlider();
  initFaqAccordions();
  initConsultationForm();
  initAnalyticsTracking();

  // Lazy load Three.js ambient particles on larger screens only
  if (window.innerWidth > 768) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => initAmbientCanvas());
    } else {
      setTimeout(initAmbientCanvas, 800);
    }
  }
});

/* ===================================================================
   1. AMBIENT THREE.JS CANVAS (Desktop Only Shimmer)
   =================================================================== */
function initAmbientCanvas() {
  const container = document.getElementById('ambient-canvas');
  if (!container || typeof THREE === 'undefined') return;

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Subtle Champagne Dust Particles
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 36;
      positions[i + 1] = (Math.random() - 0.5) * 24;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      colors[i] = 0.62;     // R
      colors[i + 1] = 0.46; // G
      colors[i + 2] = 0.14; // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.5
    });

    const particleMesh = new THREE.Points(geometry, material);
    scene.add(particleMesh);

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particleMesh.rotation.y = elapsedTime * 0.015 + mouseX * 0.04;
      particleMesh.rotation.x = elapsedTime * 0.008 + mouseY * 0.04;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }, { passive: true });
  } catch (err) {
    console.warn('Ambient visual disabled:', err);
  }
}

/* ===================================================================
   2. BEFORE/AFTER COMPARISON SLIDER
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
  window.addEventListener('resize', setDimensions, { passive: true });

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
   3. MOBILE NAVIGATION TOGGLE & DROPDOWN HANDLING
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

  // Handle mobile click on dropdown toggle
  const dropdownToggle = navMenu.querySelector('.dropdown-toggle');
  if (dropdownToggle && window.innerWidth <= 992) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentDropdown = dropdownToggle.closest('.nav-dropdown');
      if (parentDropdown) {
        parentDropdown.classList.toggle('open');
      }
    });
  }

  // Close when non-dropdown nav link clicked
  const links = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
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
   5. ACCESSIBLE FAQ ACCORDIONS
   =================================================================== */
function initFaqAccordions() {
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item-card');
      if (!parent) return;

      const isOpen = parent.classList.contains('active');

      // Optional: Close siblings if desired
      const group = parent.closest('.faq-accordion-group');
      if (group) {
        group.querySelectorAll('.faq-item-card').forEach(item => {
          if (item !== parent) {
            item.classList.remove('active');
            const panel = item.querySelector('.faq-answer-panel');
            if (panel) panel.style.display = 'none';
          }
        });
      }

      if (isOpen) {
        parent.classList.remove('active');
        const panel = parent.querySelector('.faq-answer-panel');
        if (panel) panel.style.display = 'none';
      } else {
        parent.classList.add('active');
        const panel = parent.querySelector('.faq-answer-panel');
        if (panel) panel.style.display = 'block';
      }
    });
  });
}

/* ===================================================================
   6. CONSULTATION FORM -> WHATSAPP REDIRECT
   =================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cName')?.value.trim() || 'Client';
    const phone = document.getElementById('cPhone')?.value.trim() || 'Not provided';
    const packageChoice = document.getElementById('cBudget')?.value || 'General Consultation';
    const date = document.getElementById('cDate')?.value || 'Earliest available slot';
    const notes = document.getElementById('cNotes')?.value.trim() || 'None';

    const message = `*Aurelian Crown Studio Appointment Request*%0A%0A` +
      `*Client Name:* ${name}%0A` +
      `*Phone:* ${phone}%0A` +
      `*System / Concern:* ${packageChoice}%0A` +
      `*Preferred Date:* ${date}%0A` +
      `*Client Notes:* ${notes}%0A%0A` +
      `_Connecting for 1-on-1 private fitting with Ajay Thakur & Bittu Thakur in Sector 3A Laxman Vihar Gurugram._`;

    // Trigger Analytics Event if configured
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        event_category: 'Consultation Form',
        event_label: packageChoice
      });
    }

    window.open(`https://wa.me/919958467830?text=${message}`, '_blank');
  });
}

/* ===================================================================
   7. CONVERSION & ANALYTICS EVENT TRACKING
   =================================================================== */
function initAnalyticsTracking() {
  // Track all WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.textContent.trim() || btn.getAttribute('aria-label') || 'WhatsApp Click';
      if (typeof gtag === 'function') {
        gtag('event', 'contact', {
          event_category: 'WhatsApp',
          event_label: label
        });
      }
    });
  });

  // Track phone call clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tel = btn.getAttribute('href');
      if (typeof gtag === 'function') {
        gtag('event', 'contact', {
          event_category: 'Phone Call',
          event_label: tel
        });
      }
    });
  });
}
