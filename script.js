/* ===================================================================
   AURELIAN CROWN HAIR PATCH STUDIO - JAVASCRIPT & 3D INTERACTIVITY
   Owners & Specialists: Ajay Thakur & Bittu Thakur
   Sector 3A, Laxman Vihar, Gurugram
   Direct Contact: 9958467830 / 7827867830
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJSHero();
  initBeforeAfterSlider();
  init3DCardTilt();
  initCalculator();
  initMobileMenu();
  initCallDropdown();
  initConsultationForm();
});

/* ===================================================================
   1. THREE.JS INTERACTIVE 3D HERO SCENE (Golden Crown & Floating Hair Strands)
   =================================================================== */
function initThreeJSHero() {
  const container = document.getElementById('three-hero-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfff3cc, 0.7);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xd4af37, 2.5, 80);
  pointLight1.position.set(15, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x00f0ff, 1.2, 60);
  pointLight2.position.set(-20, -10, 15);
  scene.add(pointLight2);

  // Group for rotating crown & follicle strands
  const crownGroup = new THREE.Group();

  // Base Ring
  const baseRingGeo = new THREE.TorusGeometry(6.5, 0.45, 16, 64);
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.85,
    roughness: 0.25
  });
  const baseRing = new THREE.Mesh(baseRingGeo, goldMaterial);
  baseRing.rotation.x = Math.PI / 2;
  crownGroup.add(baseRing);

  // Inner ring
  const innerRingGeo = new THREE.TorusGeometry(6.4, 0.2, 16, 64);
  const innerRing = new THREE.Mesh(innerRingGeo, goldMaterial);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.9;
  crownGroup.add(innerRing);

  // Crown Peaks
  const peakCount = 7;
  for (let i = 0; i < peakCount; i++) {
    const angle = (i / peakCount) * Math.PI * 2;
    const radius = 6.4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const coneHeight = i % 2 === 0 ? 3.6 : 2.5;
    const peakGeo = new THREE.ConeGeometry(0.7, coneHeight, 16);
    const peakMesh = new THREE.Mesh(peakGeo, goldMaterial);
    peakMesh.position.set(x, coneHeight / 2 + 0.8, z);
    peakMesh.rotation.y = -angle;
    crownGroup.add(peakMesh);

    const jewelGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const jewelMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xd4af37,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9
    });
    const jewelMesh = new THREE.Mesh(jewelGeo, jewelMat);
    jewelMesh.position.set(x, coneHeight + 1.0, z);
    crownGroup.add(jewelMesh);
  }

  // Floating Hair Strands
  const strandGroup = new THREE.Group();
  const strandCount = 18;
  for (let i = 0; i < strandCount; i++) {
    const curvePoints = [];
    const rad = 7 + Math.random() * 2;
    const baseAngle = (i / strandCount) * Math.PI * 2;
    for (let j = 0; j < 5; j++) {
      const angle = baseAngle + j * 0.25;
      const y = (j - 2) * 2.5;
      const r = rad + Math.sin(j * 1.5) * 1.8;
      curvePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    const spline = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(spline, 32, 0.08, 8, false);
    const strandMat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xf5e08b : 0xaa8012,
      metalness: 0.7,
      roughness: 0.3
    });
    const strandMesh = new THREE.Mesh(tubeGeo, strandMat);
    strandGroup.add(strandMesh);
  }
  crownGroup.add(strandGroup);

  crownGroup.position.set(8, -1, 0);
  crownGroup.rotation.x = 0.45;
  scene.add(crownGroup);

  // Gold Particle Swarm
  const particleCount = 260;
  const particleGeo = new THREE.BufferGeometry();
  const posArray = new Float32Array(particleCount * 3);
  const colorArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 60;
    posArray[i + 1] = (Math.random() - 0.5) * 45;
    posArray[i + 2] = (Math.random() - 0.5) * 35;

    colorArray[i] = 0.85 + Math.random() * 0.15;
    colorArray[i + 1] = 0.7 + Math.random() * 0.2;
    colorArray[i + 2] = 0.25;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 2.5;
    targetY = mouseY * 1.5;
    crownGroup.rotation.y += 0.007;
    crownGroup.rotation.x = 0.4 + Math.sin(elapsedTime * 0.8) * 0.08 + targetY * 0.15;
    crownGroup.position.y = -1 + Math.sin(elapsedTime * 1.2) * 0.6;
    crownGroup.rotation.z = targetX * 0.1;

    strandGroup.rotation.y = -elapsedTime * 0.15;
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = elapsedTime * 0.015;

    if (window.innerWidth < 992) {
      crownGroup.position.set(0, 0, -10);
      crownGroup.scale.set(0.65, 0.65, 0.65);
    } else {
      crownGroup.position.set(8, -1, 0);
      crownGroup.scale.set(1, 1, 1);
    }

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
function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderContainer');
  const afterWrap = document.getElementById('baAfterWrap');
  const handle = document.getElementById('baSliderHandle');
  const afterImg = document.getElementById('baAfterImg');

  if (!container || !afterWrap || !handle) return;

  function updateImageWidth() {
    if (afterImg) {
      afterImg.style.width = `${container.clientWidth}px`;
    }
  }
  updateImageWidth();
  window.addEventListener('resize', updateImageWidth);

  let isDragging = false;

  function setSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    afterWrap.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events for Mobile
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ===================================================================
   3. 3D CARD TILT ON MOUSE MOVE
   =================================================================== */
function init3DCardTilt() {
  const heroCard = document.getElementById('hero3DCard');
  if (heroCard) {
    const cardInner = heroCard.querySelector('.card-inner');
    
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      cardInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // Tilt on benefit cards
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 6;
      const rotY = (x / (rect.width / 2)) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ===================================================================
   4. INTERACTIVE PRICE ESTIMATOR CALCULATOR (₹3,000 to ₹30,000)
   =================================================================== */
function initCalculator() {
  const areaBtns = document.querySelectorAll('#calcAreaOptions .calc-opt-btn');
  const baseBtns = document.querySelectorAll('#calcBaseOptions .calc-opt-btn');
  const methodBtns = document.querySelectorAll('#calcMethodOptions .calc-opt-btn');
  const priceDisplay = document.getElementById('calcResultPrice');
  const summaryDisplay = document.getElementById('calcSummaryText');
  const bookEstimateBtn = document.getElementById('bookEstimateBtn');

  let currentAreaCost = 0;
  let currentAreaName = "Front Hairline";

  let currentBaseCost = 3000;
  let currentBaseName = "Standard Classic (₹3,000)";

  let currentMethodCost = 0;
  let currentMethodName = "Medical Grade Tape";

  function updateCalculation() {
    const total = currentBaseCost + currentAreaCost + currentMethodCost;
    priceDisplay.textContent = `₹${total.toLocaleString('en-IN')}/-`;
    summaryDisplay.textContent = `${currentAreaName} with ${currentBaseName} & ${currentMethodName}.`;
  }

  areaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      areaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAreaCost = parseInt(btn.getAttribute('data-cost') || 0);
      currentAreaName = btn.getAttribute('data-name');
      updateCalculation();
    });
  });

  baseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      baseBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBaseCost = parseInt(btn.getAttribute('data-base-cost') || 3000);
      currentBaseName = btn.getAttribute('data-base-name');
      updateCalculation();
    });
  });

  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMethodCost = parseInt(btn.getAttribute('data-method-cost') || 0);
      currentMethodName = btn.getAttribute('data-method-name');
      updateCalculation();
    });
  });

  if (bookEstimateBtn) {
    bookEstimateBtn.addEventListener('click', () => {
      const total = currentBaseCost + currentAreaCost + currentMethodCost;
      const message = `Hello Ajay Thakur and Bittu Thakur, I checked the estimate on your Aurelian Crown website:%0A%0A*Area:* ${currentAreaName}%0A*Package:* ${currentBaseName}%0A*Method:* ${currentMethodName}%0A*Total Estimate:* ₹${total.toLocaleString('en-IN')}/-%0A%0AI would like to book a consultation slot at your Sector 3A Laxman Vihar studio.`;
      window.open(`https://wa.me/919958467830?text=${message}`, '_blank');
    });
  }
}

/* ===================================================================
   5. MOBILE MENU TOGGLE
   =================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  const links = navLinks.querySelectorAll('.nav-item');
  links.forEach(l => {
    l.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/* ===================================================================
   6. CALL OPTIONS DROPDOWN
   =================================================================== */
function initCallDropdown() {
  const dropdownBtn = document.getElementById('callDropdownBtn');
  const dropdownWrap = document.querySelector('.call-options-dropdown');
  if (!dropdownBtn || !dropdownWrap) return;

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownWrap.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    dropdownWrap.classList.remove('open');
  });
}

/* ===================================================================
   7. CONSULTATION BOOKING FORM -> WHATSAPP REDIRECT
   =================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const stage = document.getElementById('hairLossStage').value;
    const date = document.getElementById('preferredDate').value || 'Earliest available slot';
    const msg = document.getElementById('userMessage').value.trim() || 'None';

    const whatsappMessage = `*New Appointment Request - Aurelian Crown Studio*%0A%0A` +
      `*Client Name:* ${name}%0A` +
      `*Phone:* ${phone}%0A` +
      `*Selected Package / Condition:* ${stage}%0A` +
      `*Preferred Date:* ${date}%0A` +
      `*Special Notes:* ${msg}%0A%0A` +
      `_Please confirm my consultation with Ajay Thakur & Bittu Thakur at Sector 3A Laxman Vihar Gurugram._`;

    window.open(`https://wa.me/919958467830?text=${whatsappMessage}`, '_blank');
  });
}
